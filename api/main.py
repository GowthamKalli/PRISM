from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime

from db.crud import create_ticket
from services.ticket_service import process_ticket
from db.database import get_connection

app = FastAPI()


# =========================
# Request Models
# =========================

class ComplaintRequest(BaseModel):
    user_id: str
    complaint: str
    tracking_id: str
    pincode: str | None = None


class FeedbackRequest(BaseModel):
    ticket_id: str
    rating: int          # -1, 0, 1
    comment: str | None = None


# =========================
# Complaint Endpoint
# =========================

@app.post("/complaint")
def submit_complaint(data: ComplaintRequest):
    try:
        # 1️⃣ Create ticket
        ticket_id = create_ticket(
            data.user_id,
            data.complaint,
            data.tracking_id
        )

        # 2️⃣ Full AI pipeline
        response_text, analysis, context = process_ticket(
            ticket_id=ticket_id,
            complaint_text=data.complaint,
            tracking_id=data.tracking_id,
            pincode=data.pincode
        )

        # 3️⃣ User-safe response
        return {
            "ticket_id": ticket_id,
            "message": response_text
        }

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to process your complaint at the moment. Please try again later."
        )


# =========================
# Feedback Endpoint (NEW)
# =========================

@app.post("/feedback")
def submit_feedback(data: FeedbackRequest):
    if data.rating not in (-1, 0, 1):
        raise HTTPException(
            status_code=400,
            detail="Rating must be -1, 0, or 1"
        )

    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute(
            """
            INSERT INTO feedback (ticket_id, source, rating, comment, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                data.ticket_id,
                "user",
                data.rating,
                data.comment,
                datetime.utcnow().isoformat()
            )
        )

        conn.commit()
        conn.close()

        return {"status": "Feedback recorded"}

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Failed to record feedback"
        )
