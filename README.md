# PRISM – AI-Powered Postal Complaint Resolution System

PRISM is an intelligent, explainable AI system that analyzes, prioritizes, and resolves postal complaints using NLP, logistics context, and human-in-the-loop feedback.

## Features
- AI-based complaint categorization & urgency scoring
- Context-aware response generation (Gemini)
- Admin dashboard for ranking & overrides
- Feedback-driven improvement loop
- Government data integration (India Post PIN API)

## Tech Stack
- FastAPI
- Streamlit
- SQLite
- Gemini API
- Python NLP pipeline

## Architecture
User → API → AI Analysis → DB → Admin / Feedback → Continuous Improvement
