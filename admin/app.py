import streamlit as st
import sys
import os
import pandas as pd
from datetime import datetime

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(PROJECT_ROOT)

from db.database import get_connection

st.set_page_config(page_title="Postal AI Admin", layout="wide")
st.title("📮 Postal Complaint Admin Dashboard")

conn = get_connection()

# =========================
# Load open tickets
# =========================
df = pd.read_sql_query(
    """
    SELECT
        ticket_id,
        user_id,
        status,
        priority_level,
        global_rank,
        created_at
    FROM tickets
    WHERE status != 'CLOSED'
    ORDER BY global_rank ASC
    """,
    conn
)

st.subheader("📋 Open Tickets")
st.dataframe(df, use_container_width=True)

# =========================
# Ticket selection
# =========================
ticket_ids = df["ticket_id"].tolist()
if not ticket_ids:
    st.info("No open tickets.")
    conn.close()
    st.stop()

selected_ticket = st.selectbox("Select Ticket", ticket_ids)

# =========================
# Update ticket status
# =========================
st.subheader("🛠️ Update Ticket Status")

new_status = st.selectbox(
    "New Status",
    ["IN_PROGRESS", "RESOLVED", "WAITING_FOR_CONFIRMATION", "CLOSED"]
)

if st.button("Update Status"):
    cur = conn.cursor()
    cur.execute(
        "UPDATE tickets SET status=? WHERE ticket_id=?",
        (new_status, selected_ticket)
    )
    conn.commit()
    st.success(f"Ticket {selected_ticket} updated to {new_status}")
    st.rerun()

# =========================
# Admin Feedback Section (NEW)
# =========================
st.subheader("📝 Admin Feedback on AI Response")

feedback_rating = st.selectbox(
    "AI Response Quality",
    options=[1, 0, -1],
    format_func=lambda x: "👍 Good" if x == 1 else "😐 Neutral" if x == 0 else "👎 Poor"
)

feedback_comment = st.text_area(
    "Admin Comment (optional)",
    placeholder="Explain why the response was good or needs improvement..."
)

if st.button("Submit Admin Feedback"):
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO feedback (ticket_id, source, rating, comment, created_at)
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            selected_ticket,
            "admin",
            feedback_rating,
            feedback_comment,
            datetime.utcnow().isoformat()
        )
    )
    conn.commit()
    st.success("Admin feedback recorded successfully")

# =========================
# Optional: Show recent feedback (nice for demo)
# =========================
st.subheader("📊 Recent Feedback")

feedback_df = pd.read_sql_query(
    """
    SELECT ticket_id, source, rating, comment, created_at
    FROM feedback
    ORDER BY created_at DESC
    LIMIT 10
    """,
    conn
)

st.dataframe(feedback_df, use_container_width=True)

conn.close()
