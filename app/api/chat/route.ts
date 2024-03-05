import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { ChatCompletionTool } from 'openai/resources/chat/completions';
// Import the ChatCompletionTool type
 
// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});



const tools = [
  {
    type: "function",
    function: {
      name: "create_image",
      description: "Create an image from a prompt",
      parameters: {
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "The prompt to generate the image from",
          }
        },
        required: ["prompt"],
      },
    },
  },
];
 
// Set the runtime to edge for best performance
export const runtime = 'edge';

async function processOpenAIResponse(messages: any, tools: any) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    stream: true,
    messages,
    tools: tools as ChatCompletionTool[], // Cast the tools array to ChatCompletionTool[]
    tool_choice: "auto"
  });

  const toolToCall = { name: "", arguments: "" }
  let deltaResponse = "";
  const responseArray: string[] = [""];

  let userStream = new ReadableStream({
    async start(controller) {
      let isToolCall = false;
      for await (const message of response) {
        const delta = message.choices[0].delta;
        if (delta?.tool_calls) {
          console.log("Tool Call.");
          isToolCall=true;
          const toolCalls = delta.tool_calls[0];
          if (toolCalls.function) {
            if (toolCalls.function.name === "create_image") {
              //controller.enqueue(new TextEncoder().encode("create_image\n"));
              toolToCall.name = "create_image";
            }
            toolToCall.arguments = toolToCall.arguments + toolCalls.function.arguments;
          }
        } 
        if (delta.content) {
          //console.log(delta.content);
          controller.enqueue(new TextEncoder().encode(delta.content as string));
        }
      }

      if (toolToCall.name === "create_image" && toolToCall.arguments != "") {
        const prompt = JSON.parse(toolToCall.arguments).prompt;
        //controller.enqueue(new TextEncoder().encode("create_image : " + prompt + "\n" as string));
        const respFetch = fetch("http://localhost:3000/api/image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: prompt }),
        });
        const respJson = await (await respFetch).json();
        messages.push({ role: "user", content: "Here is the image you requested: " + respJson.image_url });

        controller.enqueue(new TextEncoder().encode("function_call:create_image\n" as string));
        controller.enqueue(new TextEncoder().encode("prompt:"+prompt + "\n" as string));
        controller.enqueue(new TextEncoder().encode("image_url:"+respJson.image_url + "\n" as string));

        
      }
      // if (isToolCall) {
      //   controller.enqueue(new TextEncoder().encode("End Tool Call.\n" as string));
      // }
        controller.close();
      
      //controller.close();
    },
  });

  return userStream;
}
 
export async function POST(req: Request) {
  console.log("New Chat");
  const { messages } = await req.json();
  console.log("New Chat")
  console.log(messages)

  // Ask OpenAI for a streaming chat completion given the prompt
  const userStream = await processOpenAIResponse(messages, tools);

  

  

  // Convert the response into a friendly text-stream
  

  
  
  // // Respond with the stream
  return new StreamingTextResponse(userStream);
}