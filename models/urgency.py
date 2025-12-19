# models/urgency.py
def score_urgency(features, sentiment, tracking):
    score = 0

    if features["not_delivered"]:
        score += 4
    if features["delay"]:
        score += 3
    if features["lost"]:
        score += 5

    if sentiment < -0.5:
        score += 2

    if tracking["is_delayed"]:
        score += min(3, tracking["delay_days"])

    return min(score, 10)
