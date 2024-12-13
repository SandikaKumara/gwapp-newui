import Link from "next/link";
import React, { useRef, useState } from "react";
import { IoLogInOutline } from "react-icons/io5";

function Login2FAForm({ handleVerify, handleRedirectToLogin }) {
  const inputRefs = useRef([]);
  const [isComplete, setIsComplete] = useState(false);
  const [completeNumber, setCompleteNumber] = useState("");

  const handleInput = (event, index) => {
    const value = event.target.value;
    // Allow only numeric input
    if (!/^\d*$/.test(value)) {
      event.target.value = value.replace(/\D/g, ""); // Remove non-numeric characters
      return;
    }

    // Move to the next input field if a number is entered
    if (value.trim() !== "") {
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }

    // Check if all inputs are filled
    const inputs = inputRefs.current.map((input) => input?.value || "");
    if (inputs.every((val) => val.length === 1)) {
      setIsComplete(true);
      setCompleteNumber(inputs.join(""));
    } else {
      setIsComplete(false);
    }
  };

  const handleBackspace = (event, index) => {
    if (
      event.key === "Backspace" &&
      !event.target.value &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1].focus();
      setIsComplete(false);
      setCompleteNumber("");
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-r from-indigo-800 from-10% via-blue-700 via-35% to-indigo-800 to-90%">
      <div className="w-1/2 p-6 text-indigo-950 flex flex-col justify-center items-center gap-3">
        <form
          className="bg-white flex flex-col gap-5 py-10 px-10 rounded-sm shadow-sm z-0"
          action={handleVerify}
        >
          <h1 className="font-normal text-2xl w-[300px] flex gap-4 items-center">
            Two-Factor Authentication
          </h1>
          <hr className="border border-indigo-100"></hr>

          <p className="w-[300px] text-wrap font-sans text-sm">
            Enter the code from your authenticator app to continue.
          </p>

          {/* <div className="flex justify-evenly">
            <input
              type="text"
              className="border-2 border-gray-200 focus:border-gray-300 outline-none w-10 text-center py-2 rounded-md"
              maxLength={1}
              name="token"
              autoComplete="off"
            />

            <input
              type="text"
              className="border-2 border-gray-200 focus:border-gray-300 outline-none w-10 text-center py-2 rounded-md"
              maxLength={1}
              name="token"
              autoComplete="off"
            />

            <input
              type="text"
              className="border-2 border-gray-200 focus:border-gray-300 outline-none w-10 text-center py-2 rounded-md"
              maxLength={1}
              name="token"
              autoComplete="off"
            />

            <input
              type="text"
              className="border-2 border-gray-200 focus:border-gray-300 outline-none w-10 text-center py-2 rounded-md"
              maxLength={1}
              name="token"
              autoComplete="off"
            />

            <input
              type="text"
              className="border-2 border-gray-200 focus:border-gray-300 outline-none w-10 text-center py-2 rounded-md"
              maxLength={1}
              name="token"
              autoComplete="off"
            />

            <input
              type="text"
              className="border-2 border-gray-200 focus:border-gray-300 outline-none w-10 text-center py-2 rounded-md"
              maxLength={1}
              name="token"
              autoComplete="off"
            />
          </div> */}

          <div className="flex justify-evenly">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                type="text"
                ref={(el) => (inputRefs.current[index] = el)}
                className="border-2 border-gray-200 focus:border-gray-300 outline-none w-10 text-center py-2 rounded-md"
                maxLength={1}
                onChange={(event) => handleInput(event, index)}
                onKeyDown={(event) => handleBackspace(event, index)}
                autoComplete="off"
              />
            ))}
          </div>

          <div className="w-full">
            <button
              type="button"
              className="text-sm w-fit text-blue-500 hover:text-blue-700"
              onClick={() => handleRedirectToLogin()}
            >
              Back to login..?
            </button>
          </div>

          {/* <div className="text-center flex items-center gap-3 font-bold text-lg justify-center w-full bg-indigo-400  text-white p-4 rounded-sm uppercase">
            Login <IoLogInOutline className="text-xl" />
          </div> */}

          {isComplete && (
            <div>
              <input type="hidden" name="token" defaultValue={completeNumber} />
            </div>
          )}
          <button
            className={`text-center flex items-center gap-3 font-bold text-lg justify-center w-full ${
              isComplete
                ? "bg-indigo-600 hover:bg-indigo-500 transition-all duration-600 ease-in-out"
                : "bg-indigo-400"
            }   text-white p-4 rounded-sm uppercase`}
            disabled={isComplete ? false : true}
          >
            <span>Login</span> <IoLogInOutline className="text-xl" />
          </button>
        </form>

        <Link
          className="text-white text-sm cursor-pointer"
          href={"https://untanglebi.com.au"}
          target="_blank"
        >
          &copy; Untanglebi.com.au 2024
        </Link>
      </div>
    </div>
  );
}

export default Login2FAForm;
