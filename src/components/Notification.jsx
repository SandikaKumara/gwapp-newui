"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";
import { AiOutlineNotification } from "react-icons/ai";
import { getNotificationLogsForUser } from "@/dbActions/notificationLog";
import { useSession } from "@/providers/SessionProvider";
import { AiFillNotification } from "react-icons/ai";
import { FaRegBell } from "react-icons/fa";

function Notification({ isAdmin, openModalNotification }) {
  const [numberOfMessages, setNumberOfMessages] = useState();
  const [showNotification, setShowNotification] = useState(false);
  const [noticeCount, setNoticeCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const changeRefreshStatus = (prev) => setRefresh(!prev);

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
  }, [refresh]);

  return (
    <div className="flex justify-center group items-center relative hover:bg-white hover:bg-opacity-5 px-5">
      <div className="relative">
        {/* <Link href={"/dashboard/userNotification"}> */}
        <FaRegBell className="text-2xl text-white" />
        {/* </Link> */}

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

      <div className="flex flex-col justify-center items-start w-96 h-fit p-4 pr-4 pl-4 absolute bottom-0 right-0 translate-y-full  font-medium text-nowrap rounded-sm scale-0  opacity-100 group-hover:opacity-100 group-hover:scale-100 transform-origin transition-all duration-500 pointer-events-auto z-[30] bg-white origin-top border-2 border-indigo-100 shadow-lg">
        <ul className="flex flex-col gap-2 w-full">
          {messages.map((message) => (
            <li key={message?.id}>
              <ChatMessage
                notification={message?.notification}
                logId={message?.id}
                openModalNotification={openModalNotification}
                setRefresh={changeRefreshStatus}
              />
            </li>
          ))}

          {/* {messages.map((message) => (
            <li key={message?.id}>
              <ChatMessage notification={message?.notification} />
            </li>
          ))} */}

          {/* <li>
            <ChatMessage
              header={"Administrator [2024-01-20 12:00:19]"}
              message={"Hello"}
            />
          </li> */}
        </ul>

        <Link
          className="text-sm text-blue-500 text-center w-full mt-6"
          href={"/dashboard/userNotification"}
        >
          More..
        </Link>
      </div>
    </div>
  );
}

export default Notification;
