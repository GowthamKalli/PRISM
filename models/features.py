# models/features.py
KEYWORDS = {
    "not_delivered": ["not delivered", "never received", "missing"],
    "delay": ["delayed", "late", "many days", "still waiting"],
    "lost": ["lost", "missing package"],
    "damage": ["damaged", "broken"],
    "delivery": ["delivered", "out for delivery"]
}

def extract_features(text: str):
    features = {}
    for k, phrases in KEYWORDS.items():
        features[k] = any(p in text for p in phrases)
    return features
