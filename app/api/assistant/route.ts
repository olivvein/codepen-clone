import OpenAI from "openai";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set the runtime to edge for best performance
export const runtime = "edge";

export async function GET(req: Request, res: Response) {
  //const { messages } = await req.json();
  //console.log("New Chat")
  //console.log(messages)

  // Ask OpenAI for a streaming chat completion given the prompt
  //   const response = await openai.chat.completions.create({
  //     model: 'gpt-4-turbo-preview',
  //     stream: true,
  //     messages,
  //   });

  const assistantId = "asst_U5bLd3odaRDZv9d73JmGo8zD";
  const thread = await openai.beta.threads.create();

  const response2 = await openai.beta.assistants.list();
  console.log(response2);

  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: "Make the coolest clock ever",
  });

  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistantId,
  });

  let runSuccess = await openai.beta.threads.runs.retrieve(thread.id, run.id);
  console.log(runSuccess.status);
  while (runSuccess.status !== "completed") {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Attendre 1 seconde
    runSuccess = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    console.log(runSuccess.status);
    const messagesAll = await openai.beta.threads.messages.list(thread.id);
    console.log(messagesAll);
  }

  const messagesAll = await openai.beta.threads.messages.list(thread.id);
  console.log(messagesAll);

  return new Response(JSON.stringify(messagesAll), { status: 200 });
}
