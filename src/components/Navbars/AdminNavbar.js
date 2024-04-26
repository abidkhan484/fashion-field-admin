import React from "react";

import UserDropdown from "../../components/Dropdowns/UserDropdown.js";

export default function Navbar() {
  return (
    <>
      {/* Navbar */}
      <nav className="flex top-0 left-0 w-full md:flex-row md:flex-nowrap md:justify-start items-center p-4 mb-24">
        <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          {/* <a
            className="text-purple-600 text-sm uppercase hidden lg:inline-block font-semibold"
            href="#pablo"
            onClick={(e) => e.preventDefault()}
          >
            Dashboard
          </a> */}

          <div></div>
          {/* User */}
          <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
            <li>
              <button className="relative p-2 border border-gray-800 mr-4 rounded-full hover:border-purple-500 hover:text-purple-500 focus:outline-none">

                <span className="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-purple-400 opacity-75 top-0 right-0 -mr-2 -mt-1"></span>
                <span className="absolute inline-flex rounded-full h-3 w-3 bg-purple-500 top-0 right-0 -mr-1"></span>

                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </button>
            </li>
            <li>
              <button className="relative p-2 border border-gray-800 mr-4 rounded-full hover:border-purple-500 hover:text-purple-500 focus:outline-none">

                <span className="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-purple-400 opacity-75 top-0 right-0 -mr-2 -mt-1"></span>
                <span className="absolute inline-flex rounded-full h-3 w-3 bg-purple-500 top-0 right-0 -mr-1"></span>

                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </li>
            {/* <li>
              <button className="p-2 border border-gray-800 mr-4 rounded-full hover:border-purple-500 hover:text-purple-500 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </li> */}
            <UserDropdown />
          </ul>
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}
