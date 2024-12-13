"use client";
import { getNotificationLogsForUser } from "@/dbActions/notificationLog";
import React, { useEffect, useRef, useState } from "react";
import UserNotification from "../UserNotification";
import { useMessageBox } from "@/providers/MessageProvider";
import SearchBox from "../SearchBox";

function UserNotificationList() {
  const [searchText, setSearchText] = useState("");
  const [messages, setMessages] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

  const showMessage = useMessageBox();
  const searchBoxRef = useRef();

  useEffect(() => {
    const fetchUserNotifications = async () => {
      try {
        const logs = await getNotificationLogsForUser(searchText);
        // console.log(logs);

        if (logs && logs.type === "success") {
          setMessages(logs.message);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserNotifications();
  }, [refresh, searchText]);

  const handleShowMessage = (type, message) => {
    showMessage(type, message);
    setRefresh((prev) => !prev);
  };

  const handleSearch = () => {
    setSearchText(searchBoxRef.current?.value);
  };

  return (
    <div className="flex flex-wrap gap-4 w-full">
      <SearchBox ref={searchBoxRef} handleSearch={handleSearch} />
      {messages.map((log) => (
        <UserNotification
          key={log.id}
          log={log}
          handleShowMessage={handleShowMessage}
        >
          <div
            dangerouslySetInnerHTML={{ __html: log?.notification?.message }}
          />
        </UserNotification>
      ))}
    </div>
  );
}

export default UserNotificationList;
