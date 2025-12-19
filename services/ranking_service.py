from db.database import get_connection


def recompute_global_ranking():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT ticket_id
        FROM tickets
        WHERE status != 'CLOSED'
        ORDER BY priority_score DESC, created_at ASC
        """
    )

    tickets = cur.fetchall()

    for rank, (ticket_id,) in enumerate(tickets, start=1):
        cur.execute(
            "UPDATE tickets SET global_rank=? WHERE ticket_id=?",
            (rank, ticket_id)
        )

    conn.commit()
    conn.close()
