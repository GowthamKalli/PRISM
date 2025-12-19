# models/sentiment.py
from textblob import TextBlob

def get_sentiment(text: str):
    polarity = TextBlob(text).sentiment.polarity
    return polarity  # -1 to +1
