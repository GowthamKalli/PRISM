from models.prompt_builder import build_prompt
from models.llm import generate_llm_response


def generate_response(context):
    prompt = build_prompt(context)

    try:
        reply = generate_llm_response(prompt)
        if isinstance(reply, str) and reply.strip():
            return reply
    except Exception:
        pass

    # HARD FALLBACK (never fails)
    return (
        f"Your article is currently in transit at {context['location']}. "
        "We are monitoring the situation."
    )
