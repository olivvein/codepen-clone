import anthropic
import os
API_KEY = os.getenv('ANTHROPIC_API_KEY')
client = anthropic.Anthropic()

with client.messages.stream(
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello"}],
    model="claude-3-opus-20240229",
) as stream:
  for text in stream.text_stream:
      print(text, end="", flush=True)