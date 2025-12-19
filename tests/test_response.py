from models.response import generate_response

context = {
    "status": "DELAYED",
    "location": "Regional Hub",
    "delay_days": 5,
    "is_delayed": True,
}

print(generate_response(context))
