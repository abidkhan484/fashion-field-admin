import React from "react";

export default function FooterAdmin() {
  return (
    <>
      <footer className="fixed w-full bottom-0 right-0">
        <div className="container ml-0 md:ml-64">
          <hr className="mb-4 border-b-1 border-blueGray-200" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4">
              <div className="text-sm text-blueGray-500 font-semibold py-1 text-center md:text-left">
              </div>
            </div>
            <div className="w-full md:w-8/12 px-4">
                Copyright © {new Date().getFullYear()}{" "}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
