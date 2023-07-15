/* eslint-disable @next/next/no-img-element */
import React from "react";

type Props = {};

export default function Landing({}: Props) {
  return (
    <header className="flex flex-col min-h-screen mt-4 sm:mt-12 w-[80%] ">
      <div className="bg-cp-color-3 w-screen min-h-screen h-max z-[-10] top-0 fixed"></div>

      <img
        src="https://cpwebassets.codepen.io/assets/packs/lines-2-4e66616a5ef291c3566a7ddfe1ffaaa8.svg"
        alt=""
        className="-z-[2] absolute top-[100vh] w-[500px] max-w-lg overflow-hidden sm:right-0 "
      />
      <svg
        viewBox="0 0 138 26"
        fill="none"
        stroke="#fff"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="block sm:hidden scale-[40%]"
      >
        <path d="M15 8a7 7 0 1 0 0 10m7-8.7L33 2l11 7.3v7.4L33 24l-11-7.3zm0 0 11 7.4 11-7.4m0 7.4L33 9.3l-11 7.4M33 2v7.3m0 7.4V24M52 6h5a7 7 0 0 1 0 14h-5zm28 0h-9v14h9m-9-7h6m11 1h6a4 4 0 0 0 0-8h-6v14m26-14h-9v14h9m-9-7h6m11 7V6l11 14V6"></path>
      </svg>

      <div className="flex sm:flex-row flex-col  gap-8">
        <img
          src="https://cpwebassets.codepen.io/assets/packs/illu-editor-24091b7edc92fba11a2595fe767e6c2b.png"
          className="max-w-full sm:w-[40vw] h-max aspect-auto"
          alt="code image"
        />
        <div className="flex flex-col text-white fill-white justify-center items-center sm:order-first">
          <div className="flex flex-row gap-4 antialiased w-full sm:justify-center sm:items-center ">
            <svg
              viewBox="0 0 100 100"
              className="sm:flex hidden mb-[2rem] h-12 basis-[50px]"
            >
              <path d="M100 34.2c-.4-2.6-3.3-4-5.3-5.3-3.6-2.4-7.1-4.7-10.7-7.1-8.5-5.7-17.1-11.4-25.6-17.1-2-1.3-4-2.7-6-4-1.4-1-3.3-1-4.8 0-5.7 3.8-11.5 7.7-17.2 11.5L5.2 29C3 30.4.1 31.8 0 34.8c-.1 3.3 0 6.7 0 10v16c0 2.9-.6 6.3 2.1 8.1 6.4 4.4 12.9 8.6 19.4 12.9 8 5.3 16 10.7 24 16 2.2 1.5 4.4 3.1 7.1 1.3 2.3-1.5 4.5-3 6.8-4.5 8.9-5.9 17.8-11.9 26.7-17.8l9.9-6.6c.6-.4 1.3-.8 1.9-1.3 1.4-1 2-2.4 2-4.1V37.3c.1-1.1.2-2.1.1-3.1 0-.1 0 .2 0 0zM54.3 12.3 88 34.8 73 44.9 54.3 32.4V12.3zm-8.6 0v20L27.1 44.8 12 34.8l33.7-22.5zM8.6 42.8 19.3 50 8.6 57.2V42.8zm37.1 44.9L12 65.2l15-10.1 18.6 12.5v20.1zM50 60.2 34.8 50 50 39.8 65.2 50 50 60.2zm4.3 27.5v-20l18.6-12.5 15 10.1-33.6 22.4zm37.1-30.5L80.7 50l10.8-7.2-.1 14.4z"></path>
            </svg>
            <h1 className="font-black leading-10 sm:text-[2rem] text-2xl ">
              The best place to build, test, and discover front-end&nbsp;code.
            </h1>
          </div>
          <p className="sm:text-lg text-sm pt-4 text-white/80 pb-8">
            CodePen is a <strong>social development environment</strong> for
            front-end designers and developers. Build and deploy a website, show
            off your work, build test cases to learn and debug, and find
            inspiration.
          </p>
        </div>
      </div>
      <a href="/pen/" className="SidebarCreate-module_anonButton-5yd5b">
        <span>Start Coding</span>
      </a>
    </header>
  );
}
