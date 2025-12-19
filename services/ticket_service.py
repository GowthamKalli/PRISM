from models.analyze import analyze_complaint
from models.response import generate_response
from services.context_builder import build_context
from db.database import get_connection


def process_ticket(ticket_id, complaint_text, tracking_id, pincode=None):
    # 1️⃣ Analyze complaint (ML / NLP layer)
    analysis = analyze_complaint(complaint_text, tracking_id)

    # 2️⃣ Persist analysis results
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "INSERT INTO ticket_analysis VALUES (?, ?, ?, ?)",
        (
            ticket_id,
            analysis["category"],
            analysis["sentiment"],
            analysis["urgency"]
        )
    )

    priority_level = "High" if analysis["urgency"] >= 7 else "Medium"

    cur.execute(
        """
        UPDATE tickets
        SET priority_score = ?, priority_level = ?
        WHERE ticket_id = ?
        """,
        (analysis["urgency"], priority_level, ticket_id)
    )

    conn.commit()
    conn.close()

    # 3️⃣ Build factual context (DB + adapters)
    ticket = {
        "ticket_id": ticket_id,
        "tracking_id": tracking_id,
        "pincode": pincode
    }

    context = build_context(ticket, analysis)

    # 4️⃣ Generate AI-assisted response (NLG layer)
    response_text = generate_response(context)

    # 🔒 Safety guard (keep this)
    if not isinstance(response_text, str):
        raise RuntimeError(
            f"generate_response returned non-string: {response_text}"
        )

    # 5️⃣ Return clean outputs
    return response_text, analysis, context
