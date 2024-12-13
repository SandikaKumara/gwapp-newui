import React from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

function ChatMessage({ header, message }) {
  return (
    <div className="w-full h-fit p-2 border-dotted border-2 border-gray-600 flex flex-col gap-1 rounded-md shadow-md text-sm bg-gray-50">
      <div className="text-xs text-wrap font-mono font-semibold mb-2 flex items-center justify-between">
        {header}

        <div href={"#"} className="text-lg hover:font-bold hover:text-red-500">
          <IoIosCloseCircleOutline />
        </div>
      </div>

      <div className="text-wrap font-sans">{message}</div>
    </div>
  );
}

export default ChatMessage;
