"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaSave } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function SaveButton({ errors, label = "Save" }) {
  const [clicked, setClicked] = useState(false);
  const buttonRef = useRef();
  const handleClick = () => {
    e.preventDefault();
    setClicked(true);
    return true;
  };

  useEffect(() => {
    setClicked(false);
  }, [errors]);
  return (
    <>
      {clicked ? (
        <div className="bg-blue-500 rounded-xl text-sm cursor-not-allowed flex items-center justify-center gap-2 py-2 px-4 text-green-100 text-wrap mt-6 ">
          <AiOutlineLoading3Quarters className="font-bold text-lg animate-spin" />{" "}
          <FaSave className="text-lg" /> <span>{label}</span>
        </div>
      ) : (
        <button
          className="bg-blue-500 rounded text-sm hover:bg-blue-300 hover:text-blue-100 cursor-pointer flex items-center justify-center gap-2 py-2 px-4 text-white text-wrap mt-6 "
          type="submit"
          // onClick={handleClick}
          ref={buttonRef}
        >
          <FaSave className="" /> <span>{label}</span>
        </button>
      )}
    </>
  );
}

export default SaveButton;
