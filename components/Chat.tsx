'use client';
 
import { useChat } from 'ai/react';
import { ChangeEvent, use, useState,useContext, useEffect } from 'react';
import Editor from '@/components/Editor';
 import { HtmlCodeContext } from '@/components/Context';



export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const {htmlCode, setHtmlCode,jsCode, setJsCode,visibleJsCode,setVisibleJsCode,cssCode, setCssCode} = useContext(HtmlCodeContext);
 



  const editor=Editor();

  const handle2 = (data: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(data)
  }

  const extractMultipleCodeSnippetInMarkdown = (str: string) => {
    return str.match(/```([\s\S]*?)```/g) || [];
  }

  const detectLanguage = (str: string) => {
    return str.match(/html|css|js/)?.[0].replace("```", "") || "";
  }

  const systemPrompt=`You only create HTML,JS and CSS code. 
The HTML will be is inside <BODY> tag.
You write in md format. you only write good code.
You will create each snippet separately for each language. 
You only provide code snippets. no explaination, no title, no comment. 
You use Tailwind and react.js
Allways separate the html, css and js in separate code snippets.
add theses imports to your js script :
import React from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";

import { setup as twindSetup } from 'https://cdn.skypack.dev/twind/shim'
allways make the app take 100% of available space, with dark background. 
Use card and beautiful tailwind style to present the result.
  `;


  useEffect(() => {
    messages.push({
        role: 'system', content: systemPrompt,
        id: '0'
    })
    setHtmlCode("<H1>Hi there 8</H1>")
  }, []);


  //For each new message I want to add the message.content to Editor htmlCode

  useEffect(() => {
    //console.log(messages);
    if (messages.length >2) {
        const newMessage = messages[messages.length - 1];
        //send the message to the editor to the right language
        const snippets=extractMultipleCodeSnippetInMarkdown(newMessage.content);
        for (let i = 0; i < snippets.length; i++) {
          const language=detectLanguage(snippets[i]);
          console.log(language);
          console.log(snippets[i]);
          if (language === 'html') {
            setHtmlCode(snippets[i]);
          }
          if (language === 'css') {
            setCssCode(snippets[i]);
          }
            if (language === 'js') {
                setJsCode(snippets[i]);
                setVisibleJsCode(snippets[i]);
            }
        }
        
        return;
        console.log("snippets");
        console.log(snippets);
        for (let i = 0; i < snippets.length; i++) {
          const language=detectLanguage(snippets[i]);
          if (language === 'html') {
            setHtmlCode(snippets[i]);
          }
        }
      }
  }, [messages]);
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      
 
      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
      {/* {messages.map(m => (
        <div key={m.id} className="">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))} */}
    </div>
  );
}