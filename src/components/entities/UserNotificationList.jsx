"use client";
import { getNotificationLogsForUser } from "@/dbActions/notificationLog";
import React, { useEffect, useRef, useState } from "react";
import UserNotification from "../UserNotification";
import { useMessageBox } from "@/providers/MessageProvider";
import SearchBox from "../SearchBox";
import LoadingComponent from "../LoadingComponent";
import { format } from "date-fns";
import ContentViewer from "../ContentViewer";

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
    <div className="flex flex-col gap-3 flex-wrap overflow-x-auto">
      <SearchBox ref={searchBoxRef} handleSearch={handleSearch} />

      {loading && <LoadingComponent />}

      <table className="table-fixed border-collapse border border-gray-200">
        <thead className="bg-gray-700 text-white">
          <tr>
            <th className="border border-gray-200 p-2 min-w-48 w-48 whitespace-nowrap">
              Date
            </th>
            <th className="border border-gray-200 p-2 min-w-64 w-64 whitespace-nowrap">
              Title
            </th>
            <th className="border border-gray-200 p-2 min-w-96 whitespace-nowrap">
              Message
            </th>
          </tr>
        </thead>
        <tbody>
          {messages.map((log) => (
            <tr key={log.id} className="odd:bg-slate-100">
              <td className="border border-gray-200 p-4">
                {format(
                  new Date(log?.notification?.createdAt),
                  "yyyy/MM/dd, HH:mm:ss"
                )}
              </td>
              <td className="border border-gray-200 p-4">
                {log?.notification?.title}
              </td>
              <td className="border border-gray-200 p-4">
                <ContentViewer content={log?.notification?.message} />
                {/* {log?.notification?.message} */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* {messages.map((log) => (
        <UserNotification
          key={log.id}
          log={log}
          handleShowMessage={handleShowMessage}
        >
          <div
            dangerouslySetInnerHTML={{ __html: log?.notification?.message }}
          />
        </UserNotification>
      ))} */}
    </div>
  );
}

export default UserNotificationList;
