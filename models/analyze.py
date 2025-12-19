# models/analyze.py
from models.preprocess import preprocess
from models.features import extract_features
from models.sentiment import get_sentiment
from models.urgency import score_urgency
from services.tracking_adapter import get_tracking_context


def analyze_complaint(text: str, tracking_id: str):
    clean = preprocess(text)
    features = extract_features(clean)
    sentiment = get_sentiment(clean)

    tracking = get_tracking_context(tracking_id)
    urgency = score_urgency(features, sentiment, tracking)

    # Category logic (simple but explainable)
    if features["lost"]:
        category = "Lost Article"
    elif features["not_delivered"]:
        category = "Delivery Discrepancy"
    elif features["delay"]:
        category = "Delayed Delivery"
    else:
        category = "General Inquiry"

    return {
        "category": category,
        "sentiment": sentiment,
        "urgency": urgency,
        "features": features,
    }
