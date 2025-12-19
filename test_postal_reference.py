from services.postal_reference_adapter import get_postal_metadata

print("First call (API):")
print(get_postal_metadata("533449"))

print("\nSecond call (DB cache):")
print(get_postal_metadata("533449"))
