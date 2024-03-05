"use client";

import { useChat, Message } from "ai/react";
import { ChangeEvent, use, useState, useContext, useEffect ,FormEvent} from "react";
import Editor from "@/components/Editor";
import { HtmlCodeContext } from "@/components/Context";

export default function Chat() {
  const { messages, input,setInput, handleInputChange, handleSubmit, setMessages } =
    useChat();


  const {
    fullMessages,
    setFullMessages,
    appTitle,
    setAppTitle,
    htmlCode,
    setHtmlCode,
    jsCode,
    setJsCode,
    visibleJsCode,
    setVisibleJsCode,
    cssCode,
    setCssCode,
  } = useContext(HtmlCodeContext);


  const sendMessageGoogle = async (contentS:string) => {
    try {
      const response = await fetch('http://localhost:3000/api/googleChat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([...messages, { role: "user", content:contentS,id:3 }] ),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedMessages = await response.json();
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Failed to send message: ', error);
    }
  };

  const handleInputCode=()=>{
    console.log("handleInputCode");
    const formElement = document.getElementById("form");

        // Créez un nouvel événement de soumission de formulaire
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        
        // Associez l'événement de soumission à l'élément de formulaire
        formElement?.dispatchEvent(submitEvent);
        
        // Créez un FormEvent à partir de l'événement de soumission
        const formEvent: FormEvent<HTMLFormElement> = submitEvent as unknown as FormEvent<HTMLFormElement>;
        // Appelez handleSubmit avec le FormEvent
        //handleSubmitInput(formEvent);
  }

  const handleSubmitInput = (e: any) => {
    console.log("Will Submit");
    try {
      e.preventDefault();
    } catch (error) {
      console.log(error)
    }
    console.log("Will Submit 2");
   
    // console.log(e.target.children[0].value);
    // console.log(e.target.value);
    // messages[0].content = systemPrompt;
    // sendMessageGoogle(e.target.children[0].value);

    try {
      handleSubmit(e);
    } catch (error) {
      console.log(error)
    }
    
    
    setJsCode("");
  };

  const editor = Editor("");

  const getConversationTitle = (messages: any[]) => {
    const allMessages = [...messages];
    console.log("allMessages");
    console.log(messages);

    console.log("oldMessages");
    console.log(oldMessages);
    allMessages.forEach((m) => {
      try {
        delete m.id;
      } catch (error) {
        console.log(error);
      }
      try {
        delete m.createdAt;
      } catch (error) {
        console.log(error);
      }
    });
    if (allMessages.length === 0) {
      return "Chat";
    }
    allMessages[0].content =
      "You give this app a title based on the conversation";
    allMessages.push({
      role: "user",
      content: "Give this app a title. Just reply the title.",
    });
    fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: allMessages }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAppTitle(data);
        //setTimeOfTitle(Date.now());
        messages[0].content = systemPrompt;

        //resetMessages()
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    return allMessages[allMessages.length - 1].content;
  };

  const handle2 = (
    data: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    handleInputChange(data);
  };

  const extractMultipleCodeSnippetInMarkdown = (str: string) => {
    return str.match(/```([\s\S]*?)```/g) || [];
  };

  const extractNonCodeParts = (str: string) => {
    const regex = /```[\s\S]*?```/g;
    return str.split(regex);
  };

  const detectLanguage = (str: string) => {
    str = str.replace(/```javascript/g, "```js");
    return str.match(/html|css|js/)?.[0].replace("```", "") || "";
  };

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

allways start by :
appTitle: The title of the app
`;

  useEffect(() => {
    messages.push({
      role: "system",
      content: systemPrompt,
      id: "0",
    });
    setHtmlCode("<H1>Hi there 8</H1>");
  }, []);

  const resetMessages = () => {
    setMessages([
      {
        role: "system",
        content: systemPrompt,
        id: "0",
      },
    ]);

    messages.push({
      role: "system",
      content: systemPrompt,
      id: "0",
    });
    // console.log("oldMessages");
    // console.log(oldMessages);
    // setMessages(oldMessages);
  };

  //For each new message I want to add the message.content to Editor htmlCode

  const extractLastCodeSnippetFromMdNotClosed = (str: string) => {
    //There is multiple code snippet in the message.
    //I want to extract the last one that is not closed and the language of the snippet
    let result = { snippet: "", language: "" };
    const regex = /```(\w+)?([\s\S]*?)(```)?/g;
    let match;
    let matches = [];
    while ((match = regex.exec(str)) !== null) {
      matches.push(match);
    }
    //console.log(matches);
    for (let i = matches.length - 1; i >= 0; i--) {
      if (!matches[i][3]) {
        // if the code snippet is not closed
        result.snippet = matches[i][2].trim();
        result.language = matches[i][1] || "";
        break;
      }
    }
    return result;
  };

  useEffect(() => {
    //console.log(messages);
    if (messages.length > 2) {
      const newMessage = messages[messages.length - 1];
      //send the message to the editor to the right language
      //console.log("newMessage");
      //console.log(newMessage.content);
      const newwMessage = {
        role: newMessage.role,
        content: newMessage.content,
      };
      // push the message to the fullMessages
      setFullMessages((prev) => [...prev, newwMessage]);

      const matchAppTitle = newMessage.content.match(/appTitle:(.*)\n/);
      if (matchAppTitle) {
        const newTitle = matchAppTitle[1].trim();
        if (newTitle) {
          setAppTitle(newTitle);
          //setTimeOfTitle(Date.now());
        }
      }

      if(newMessage.content.indexOf("image_url:")!=-1){
        let newwMessage ="";
        for (const mess of fullMessages){
          newwMessage+=mess.content+"\nNow make the app\n";
        
        }
        
        //setInput(newwMessage);

      
       
        

      }

      const snippets = extractMultipleCodeSnippetInMarkdown(newMessage.content);
      for (let i = 0; i < snippets.length; i++) {
        const language = detectLanguage(snippets[i]);

        if (language === "html") {
          snippets[i] = snippets[i].replace("```html", "```");
          snippets[i] = snippets[i].replace("```", "");
          snippets[i] = snippets[i].replace("```", "");
          setHtmlCode(snippets[i]);
        }
        if (language === "css") {
          snippets[i] = snippets[i].replace("```css", "```");
          snippets[i] = snippets[i].replace("```", "");
          setCssCode(snippets[i]);
        }
        if (language === "js") {
          snippets[i] = snippets[i].replace("```jsx", "```");
          snippets[i] = snippets[i].replace("```js", "```");
          snippets[i] = snippets[i].replace("```javascript", "```");
          snippets[i] = snippets[i].replace(/```/g, "");
          setJsCode(snippets[i]);
          setVisibleJsCode(snippets[i]);
          //if time of title is less than 5 minutes, I want to change the title
          
        }
      }

      const liveSnippet = extractNonCodeParts(newMessage.content);
      if (liveSnippet) {
        let liveSnippetString = liveSnippet.join("");
        if (
          liveSnippetString &&
          (liveSnippetString.indexOf("```js") !== -1 ||
            liveSnippetString.indexOf("```javascript") !== -1)
        ) {
          liveSnippetString = liveSnippetString.replace("javascript", "js");
          liveSnippetString = liveSnippetString.replace("```js", "");
          liveSnippetString = liveSnippetString.replace("```javascript", "");
          liveSnippetString = liveSnippetString.replace("```", "");
          //remove the first blank lines
          liveSnippetString = liveSnippetString.replace(/^\s*\n/gm, "");
          setVisibleJsCode(liveSnippetString);
        }
      }
    }
  }, [messages]);
  return (
    <div className="absolute right-0 top-0 flex flex-col w-full  max-w-md py-2 mx-auto stretch items-center justify-center">
      <form onSubmit={handleSubmitInput} id="form">
        <input
          className="absolute  left-0 top-0  w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl z-50"
          value={input}
          placeholder="What do you want?"
          onChange={handleInputChange}
        />
      </form>
      <button
        onClick={resetMessages}
        className="absolute  right-0 top-0  w-50 max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl z-50"
      >
        reset
      </button>

      <button
        onClick={handleInputCode}
        className="absolute  right-0 top-0  w-50 max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl z-50"
      >
        handleInputCode
      </button>


    </div>
  );
}
