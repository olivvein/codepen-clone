import Anthropic from '@anthropic-ai/sdk';
import { AnthropicStream, StreamingTextResponse } from 'ai';
 
// Create an Anthropic API client (that's edge friendly)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});
 
// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';
 
export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json();

  console.log(messages)
  const systemPrompt=messages[0].content
    messages.shift()

 
  // Ask Claude for a streaming chat completion given the prompt
  const response = await anthropic.messages.create({
    messages,
    model: 'claude-3-opus-20240229',
    stream: true,
    max_tokens: 4000,
    system: systemPrompt
  });
 
  // Convert the response into a friendly text-stream
  const stream = AnthropicStream(response);
 
  // Respond with the stream
  return new StreamingTextResponse(stream);
}