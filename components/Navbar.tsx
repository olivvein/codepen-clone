"use client";

import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";
import Image from "next/image";
import Chat from "./Chat";


function Navbar() {
  return (
    <div className="  left-0 right-0 top-0 z-50 flex fixed min-w-full h-20 items-center justify-between shadow-sm bg-gray-900">
      <div className="left-0 container  flex w-full min-w-full items-center justify-between">
        <div className="left-0 hidden gap-4 md:flex items-center">
          <Link href="/">
            <div className="flex flex-row gap-1 items-center">
              
              <div className="antialiased opacity-75 text relative text-[1rem] font-extrabold leading-relaxed">
                codepAIn
              </div>
            </div>
          </Link>
        </div>
        {/* For mobile view */}
        
        
      </div>
    </div>
  );
}

export default Navbar;
