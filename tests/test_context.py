from services.context_builder import build_context

analysis = {
    "category": "Delivery Discrepancy",
    "urgency": 8,
    "sentiment": -0.7,
}

ticket = {
    "ticket_id": "TESTCTX",
    "tracking_id": "EF789",
    "pincode": "110001"
}

context = build_context(ticket, analysis)
print(context)
