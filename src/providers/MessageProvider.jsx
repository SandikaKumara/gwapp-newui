"use client";
import MessageBox from "@/components/MessageBox";
import React, { createContext, useContext, useState } from "react";

const MessageBoxContext = createContext();

export const useMessageBox = () => useContext(MessageBoxContext);

function MessageProvider({ children }) {
  const [messageData, setMessageData] = useState({
    type: "",
    message: "",
    visible: false,
  });

  const showMessage = (type, message) => {
    setMessageData({ type, message, visible: true });
    setTimeout(() => {
      setMessageData((prev) => ({ ...prev, visible: false }));
    }, 6000);
  };

  return (
    <MessageBoxContext.Provider value={showMessage}>
      {children}
      {messageData.visible && (
        <MessageBox type={messageData.type} message={messageData.message} />
      )}
    </MessageBoxContext.Provider>
  );
}

export default MessageProvider;
