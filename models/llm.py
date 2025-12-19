import os
from google import genai

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not set")

client = genai.Client(api_key=API_KEY)

def generate_llm_response(prompt: str) -> str:
    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=prompt
    )

    if response and response.text:
        return response.text.strip()

    raise RuntimeError("Empty response from Gemini")
