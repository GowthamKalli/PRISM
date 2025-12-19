from services.tracking_adapter import get_tracking_context
from services.postal_reference_adapter import get_postal_metadata


def build_context(ticket, analysis):
    tracking = get_tracking_context(ticket["tracking_id"])

    postal = None
    if ticket.get("pincode"):
        postal = get_postal_metadata(ticket["pincode"])

    return {
        # Ticket
        "ticket_id": ticket["ticket_id"],
        "category": analysis["category"],
        "urgency": analysis["urgency"],
        "sentiment": analysis["sentiment"],

        # Tracking
        "status": tracking["current_status"],
        "location": tracking["last_location"],
        "is_delayed": tracking["is_delayed"],
        "delay_days": tracking["delay_days"],

        # Postal metadata
        "post_office": postal["office_name"] if postal else None,
        "district": postal["district"] if postal else None,
        "state": postal["state"] if postal else None,
        "delivery_status": postal["delivery_status"] if postal else None
    }
