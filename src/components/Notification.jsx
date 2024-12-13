"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";
import { AiOutlineNotification } from "react-icons/ai";
import { getNotificationLogsForUser } from "@/dbActions/notificationLog";
import { useSession } from "@/providers/SessionProvider";
import { AiFillNotification } from "react-icons/ai";
import { FaRegBell } from "react-icons/fa";

function Notification({ isAdmin }) {
  const [numberOfMessages, setNumberOfMessages] = useState();
  const [showNotification, setShowNotification] = useState(false);
  const [noticeCount, setNoticeCount] = useState(0);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchUserNotifications = async () => {
      const logs = await getNotificationLogsForUser();

      if (logs && logs.type === "success") {
        const unredLogs = logs.message.filter((log) => !log?.read);
        setMessages(unredLogs);
        // console.log(logs?.message?.length);

        setNoticeCount(unredLogs?.length);
      }
    };

    fetchUserNotifications();

    const interval = setInterval(fetchUserNotifications, 300000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center group items-center relative hover:bg-white hover:bg-opacity-5 px-5">
      <div className="relative">
        <Link href={"/dashboard/userNotification"}>
          <FaRegBell className="text-2xl text-white" />
        </Link>

        {noticeCount > 0 && (
          <div className="absolute -top-2 -right-4 bg-rose-600 w-6 h-6 rounded-full p-1 flex justify-center items-center">
            <span className="text-xs text-pink-50">{noticeCount}</span>
          </div>
        )}

        {/* <div className="absolute top-4 -left-4 bg-red-700 rounded-full w-5 h-5 text-gray-100 text-[0.6rem]">
            <span className="flex justify-center items-center p-1">
              {numberOfMessages && numberOfMessages}
            </span>
          </div> */}
      </div>

      {/* <div
        className="absolute w-[300px] h-fit -translate-x-1/2 top-6 pt-10
    scale-x-50 scale-y-0 group-hover:scale-x-100 group-hover:scale-y-100 
    origin-top-right transition-transform duration-300 ease-in-out 
    group-hover:block z-10"
      >
        <ul className="flex flex-col gap-1">
          {messages.map((message) => (
            <li key={message?.id}>
              <ChatMessage
                header={message?.notification?.title}
                message={message?.notification?.message}
              />
            </li>
          ))}
          
            <li>
              <ChatMessage
                header={"Administrator [2024-01-20 12:00:19]"}
                message={"Hello"}
              />
            </li>
        </ul>
      </div> */}
    </div>
  );
}

export default Notification;
