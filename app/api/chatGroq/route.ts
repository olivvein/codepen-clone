
import Groq from "groq-sdk";

import { OpenAIStream, StreamingTextResponse } from 'ai';
 
// Create an OpenAI API client (that's edge friendly!)
 
// Set the runtime to edge for best performance
export const runtime = 'edge';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY});
 
export async function POST(req: Request) {
  const { messages } = await req.json();
  console.log("New Chat")
  console.log(messages)
 
  // Ask OpenAI for a streaming chat completion given the prompt
//   const response = await openai.chat.completions.create({
//     model: 'gpt-4-turbo-preview',
//     stream: true,
//     messages,
//   });

  const response = await groq.chat.completions.create({
    //
    // Required parameters
    //
    messages
,
    // The language model which will generate the completion.
    model: "mixtral-8x7b-32768",

    //
    // Optional parameters
    //

    // Controls randomness: lowering results in less random completions.
    // As the temperature approaches zero, the model will become deterministic
    // and repetitive.
    temperature: 0.2,

    // The maximum number of tokens to generate. Requests can use up to
    // 2048 tokens shared between prompt and completion.
    //max_tokens: 1024,
    max_tokens: 32768,

    // Controls diversity via nucleus sampling: 0.5 means half of all
    // likelihood-weighted options are considered.
    //top_p: 1,

    // A stop sequence is a predefined or user-specified text string that
    // signals an AI to stop generating content, ensuring its responses
    // remain focused and concise. Examples include punctuation marks and
    // markers like "[end]".
    stop: null,

    // If set, partial message deltas will be sent.
    stream: true,
  });
 
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}





