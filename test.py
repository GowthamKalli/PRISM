from models.response import generate_response

print(generate_response({
    "status": "IN_TRANSIT",
    "location": "Regional Hub",
    "category": "Delivery Discrepancy",
    "is_delayed": False
}))
