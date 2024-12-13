import React from "react";

function Background() {
  return (
    <>
      <div
        className="fixed top-0 left-10 w-3 bg-blue-400 h-[300px] rounded-xl animate-ping opacity-20"
        style={{ animationDuration: "5s" }}
      ></div>

      <div
        className="fixed top-0 left-16 w-3 bg-blue-400 h-[250px] rounded-xl animate-ping opacity-20"
        style={{ animationDuration: "5s", animationDelay: "1s" }}
      ></div>

      <div
        className="fixed top-0 left-24 w-3 bg-blue-400 h-[100px] rounded-xl animate-ping opacity-20"
        style={{ animationDuration: "5s", animationDelay: "2s" }}
      ></div>

      <div
        className="fixed bottom-0 left-10 w-[200px] bg-blue-400 h-[200px] rounded-md animate-bounce opacity-20"
        style={{ animationDuration: "3s" }}
      ></div>

      <div
        className="fixed bottom-100 left-1/3 w-[150px] bg-blue-400 h-[150px] rounded-full animate-bounce opacity-20 delay-150"
        style={{ animationDuration: "4s" }}
      ></div>

      <div
        className="fixed bottom-0 left-1/2 w-[80px] bg-blue-400 h-[80px] rounded-full animate-bounce opacity-20 delay-75"
        style={{ animationDuration: "5s" }}
      ></div>

      <div
        className="fixed right-10 top-10 w-[100px] bg-blue-400 h-[100px] rounded-full animate-bounce opacity-20 delay-75"
        style={{ animationDuration: "4s" }}
      ></div>

      <div
        className="fixed right-10 bottom-10 w-[50px] bg-blue-400 h-[50px] rounded-full animate-bounce opacity-20 delay-75"
        style={{ animationDuration: "5s" }}
      ></div>

      <div
        className="fixed right-1/2 bottom-1/2 w-[100px] bg-blue-400 h-[100px] rounded-full animate-ping opacity-20 delay-75"
        style={{ animationDuration: "4s" }}
      ></div>
    </>
  );
}

export default Background;
