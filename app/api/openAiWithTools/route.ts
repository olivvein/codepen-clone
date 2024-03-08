import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import type { ChatCompletionCreateParams } from 'openai/resources/chat';
import { ChatCompletionTool } from "openai/resources/chat/completions";

 
// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});
 
// Set the runtime to edge
export const runtime = 'edge';
 
// Function definition:
const functions: ChatCompletionCreateParams.Function[] = [
  {
    name: 'create_image',
    description: 'Create an image from a prompt',
    parameters: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'The prompt to generate the image from',
        },
        size: {
          type: 'string',
          enum: ['1024x1024', '1024x1792','1792x1024'],
          description:
            'The size of the image to generate',
        },
      },
      required: ['location', 'size'],
    },
  },
];
 
// And use it like this:
export async function POST(req: Request) {

  const { messages } = await req.json();
  console.log("openAiWithTools");
  console.log(messages);
 
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    stream: true,
    messages,
    functions
  });
 
  const stream = OpenAIStream(response, {
    experimental_onFunctionCall: async (
      { name, arguments: args },
      createFunctionCallMessages,
    ) => {
      // if you skip the function call and return nothing, the `function_call`
      // message will be sent to the client for it to handle
      if (name === 'create_image') {
        // Call a weather API here
        
        const respFetch = fetch("http://localhost:3000/api/image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: args.prompt ,size: args.size}),
        });
        const respJson = await (await respFetch).json();
        
   
        // `createFunctionCallMessages` constructs the relevant "assistant" and "function" messages for you
        const newMessages = createFunctionCallMessages(respJson);
        return openai.chat.completions.create({
          messages: [...messages, ...newMessages],
          stream: true,
          model: 'gpt-4-turbo-preview',
          // see "Recursive Function Calls" below
          functions,
        });
      }
    },
  });
  return new StreamingTextResponse(stream);
}