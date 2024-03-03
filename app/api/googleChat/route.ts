import { GoogleGenerativeAI } from "@google/generative-ai";

// Create an OpenAI API client (that's edge friendly!)

// Set the runtime to edge for best performance
export const runtime = "edge";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const systemPrompt = `You are a pro developer in javascript html and react and tailwind.
You can create really complex app with these languages.
You have no limitation in the number of lines of code.
If requested a full app, you will do it.
You allways respond to user in one run.
You can at the begining of a response explain the functionallity that you are going to implement, only if needed to plan the app.
You only create HTML and JS. 
The HTML will be is inside <BODY> tag.
You write in md format. you only write good code.
You will create each snippet separately for each language. 
You only provide code snippets. no explaination, no title, no comment. 
You use Tailwind and react.js
Allways separate the html  and js in separate code snippets.
add theses imports to your js script :
import React from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";

if you want to import a package, you can use a cdn like https://esm.sh/ 
allways import tailwind like this :
import { setup as twindSetup } from 'https://cdn.skypack.dev/twind/shim'
allways make the app take 100% of available space, with dark background. 
Use card and beautiful tailwind style to present the result.
Allways use try catch to handle errors.
If you need to use an api, make sure it does not require an api key.
for weather use wttr.in or an other free api that does not require an api key.
https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current_weather=true  => "current_weather"
https://api.coingecko.com/api 
https://api.multiversx.com/economics?extract=price for EGLD  => "price"
https://www.francetvinfo.fr/titres.rss =>   entries "title" and "summary" and "links[0] as href " and "links[1] as image " For the News with feedparser library

in the html snippet, just put the root div.
allways start by :
appTitle: The title of the app
`;

export async function POST(req: Request) {
  const messages = await req.json();
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  console.log(messages);

  const history = [
    { role: "user", parts: systemPrompt },
    { role: "model", parts: "Ok, i will respond with a html snippet and a js snippet in MD.What do you want me to do?" },
  ];


  const chat = model.startChat({
    history: history
  });

  const lastMessage = messages[messages.length - 1];

  const msg = lastMessage.content;

  

  console.log(msg);

  const result = await chat.sendMessage(msg);
  const response = await result.response;
  const text = response.text();
  console.log(text);

  messages.push({ role: "model", content: text });

  messages.forEach((m: any) => {
    if (m.role === "model") {
      m.role = "assistant";
    }
  });

  console.log("result");
  console.log(messages);

  return new Response(JSON.stringify(messages));
}
