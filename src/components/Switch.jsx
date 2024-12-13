"use client";
import React, { useEffect, useState } from "react";

const Switch = ({ label, currentStatus, action }) => {
  const [status, setStatus] = useState();

  const toggleSwitch = () => {
    setStatus((prevStatus) => !prevStatus);
    action();
  };

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  return (
    <>
      <div className="flex flex-col">
        {label && (
          <label className="text-sm mb-1 text-zinc-600" htmlFor="name">
            {label} :
          </label>
        )}

        <div
          className={`inline-block border-2 w-9 h-5 rounded-full relative ${
            status ? "border-green-500" : "border-red-500"
          }`}
          onClick={toggleSwitch}
        >
          <div
            className={`absolute border-4 w-3 h-3 rounded-full top-[2px] ${
              status
                ? "bg-green-500 border-green-500 left-4"
                : " border-red-500 bg-red-500 left-1"
            }`}
          ></div>
        </div>
      </div>
    </>
  );
};

export default Switch;
