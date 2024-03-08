import anthropic
import os

client = anthropic.Anthropic(
    # defaults to os.environ.get("ANTHROPIC_API_KEY")
    #api_key="my_api_key",
)
message = client.messages.create(
    model="claude-3-opus-20240229",
    max_tokens=4000,
    temperature=0,
    system="system prompt",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello"
                }
            ]
        }
    ]
)
print(message.content)