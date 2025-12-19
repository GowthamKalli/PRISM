from db.database import get_connection
from datetime import datetime, timedelta

DELAY_THRESHOLD_DAYS = 3


def get_tracking_context(tracking_id: str):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT current_status, last_location, last_update
        FROM postal_tracking
        WHERE tracking_id=?
        """,
        (tracking_id,)
    )
    row = cur.fetchone()

    if not row:
        now = datetime.utcnow()
        cur.execute(
            "INSERT INTO postal_tracking VALUES (?, ?, ?, ?, 0, 0)",
            (tracking_id, "IN_TRANSIT", "Regional Hub", now.isoformat())
        )
        conn.commit()
        conn.close()
        return {
            "current_status": "IN_TRANSIT",
            "last_location": "Regional Hub",
            "is_delayed": False,
            "delay_days": 0
        }

    status, location, last_update = row
    last_update_dt = datetime.fromisoformat(last_update)
    delta_days = (datetime.utcnow() - last_update_dt).days

    is_delayed = status == "IN_TRANSIT" and delta_days > DELAY_THRESHOLD_DAYS

    if is_delayed:
        cur.execute(
            """
            UPDATE postal_tracking
            SET current_status='DELAYED', is_delayed=1, delay_days=?
            WHERE tracking_id=?
            """,
            (delta_days, tracking_id)
        )
        conn.commit()

    conn.close()

    return {
        "current_status": "DELAYED" if is_delayed else status,
        "last_location": location,
        "is_delayed": is_delayed,
        "delay_days": delta_days if is_delayed else 0
    }