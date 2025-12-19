from models.analyze import analyze_complaint

result = analyze_complaint(
    "My post was not delivered and I am very frustrated",
    "EF789"
)

print(result)
