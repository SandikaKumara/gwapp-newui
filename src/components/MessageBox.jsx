"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  TiTickOutline,
  TiWarningOutline,
  TiTimesOutline,
  TiInfoLargeOutline,
} from "react-icons/ti";

function MessageBox({ type, message }) {
  const colorClasses = {
    success: {
      text: "text-green-500",
      border: "border-green-500",
      background: "bg-green-900",
      icon: <TiTickOutline className="text-green-500 text-lg" />,
    },
    warning: {
      text: "text-amber-500",
      border: "border-amber-500",
      background: "bg-amber-900",
      icon: <TiWarningOutline className="text-amber-500 text-lg" />,
    },
    error: {
      text: "text-red-500",
      border: "border-red-500",
      background: "bg-red-950",
      icon: <TiTimesOutline className="text-red-500 text-lg" />,
    },
    info: {
      text: "text-cyan-500",
      border: "border-cyan-500",
      background: "bg-cyan-900",
      icon: <TiInfoLargeOutline className="text-cyan-500 text-lg" />,
    },
  };

  const classes = colorClasses[type] || colorClasses.info; // fallback into info when type is undefined

  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
    }, 6000);

    const currentTimerRef = timerRef.current;

    return () => clearTimeout(currentTimerRef);
  }, [type, message]);

  return (
    <div
      className={`fixed top-4 right-2 flex flex-col w-[95%] md:w-[600px] z-[99] shadow-md border-[1px] rounded-md ${
        classes.border
      } ${classes.background} duration-1000 ease-out ${
        visible ? "opacity-90" : "opacity-0"
      }`}
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      {/* close button */}
      <div
        className={`${classes.text} absolute -top-2 -left-3 rounded-full w-7 h-7 p-1 flex justify-center items-center border-2 ${classes.border} ${classes.background} font-bold font-sans hover:cursor-pointer hover:text-zinc-200`}
        onClick={() => setVisible(false)}
      >
        {" "}
        X{" "}
      </div>
      {/* Content */}
      <div
        className={`px-4 py-5 text-pretty ${classes.text} text-sm shadow-lg flex items-center gap-2`}
      >
        <span>{classes.icon}</span>
        {message}
      </div>
    </div>
  );
}

export default MessageBox;
