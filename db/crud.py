from db.database import get_connection
import uuid
from datetime import datetime

def create_ticket(user_id, text, tracking_id):
    conn = get_connection()
    cur = conn.cursor()

    ticket_id = str(uuid.uuid4())
    cur.execute(
        "INSERT INTO tickets VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (
            ticket_id,
            user_id,
            text,
            tracking_id,
            "NEW",
            None,
            None,
            None,
            datetime.utcnow().isoformat()
        )
    )

    conn.commit()
    conn.close()
    return ticket_id
