"use client";

import { getNotificationListAction } from "@/dbActions/notification";
import { useEffect, useRef, useState } from "react";
import SearchBox from "../SearchBox";
import LoadingComponent from "../LoadingComponent";
import { BsThreeDotsVertical } from "react-icons/bs";
import Link from "next/link";
import Switch from "../Switch";
import { format } from "date-fns";
import { FaEdit } from "react-icons/fa";
import ContentViewer from "../ContentViewer";

function NotificationList() {
  const [searchText, setSearchText] = useState("");
  const [notificationList, setNotificationList] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchBoxRef = useRef();

  const handleToggleActive = async (id) => {
    // await enableDisableNotifiation(id);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const notifications = await getNotificationListAction(searchText);
        // console.log("notifications: ", notifications);

        if (notifications) {
          setNotificationList(notifications);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [searchText]);

  const handleSearch = () => {
    setSearchText(searchBoxRef.current?.value);
  };

  return (
    <section className="flex flex-col gap-3 flex-wrap">
      <SearchBox ref={searchBoxRef} handleSearch={handleSearch} />

      {loading && <LoadingComponent />}
      {/* List of notifications */}
      {notificationList.map((notification) => (
        <div
          key={notification.id}
          className="flex flex-col justify-between gap-1 flex-wrap rounded w-full h-fit bg-white shadow-md hover:bg-gray-100"
        >
          <div className="flex flex-col gap-1 min-w-[300px] my-2 bg-gray-400 text-gray-50 px-4 py-2">
            <div className="font-semibold">{notification.title}</div>
            <div className="text-xs">{notification.user?.firstName}</div>
          </div>

          <div className="flex flex-col gap-1 min-w-[300px] px-2">
            <ContentViewer content={notification.message} />
            {/* <div className="">{notification.message}</div> */}
            <div className="text-xs">{notification.tenant?.name}</div>
          </div>

          {/* <div className="flex flex-col justify-center gap-1 items-start min-w-[300px] text-xs">
            <div className="flex gap-2 justify-center items-center">
              Active{" "}
              <Switch
                currentStatus={notification.isActive}
                action={() => handleToggleActive(notification.id)}
              />
            </div>
          </div> */}

          <div className="flex justify-between items-start min-w-[300px] text-xs px-4 py-2">
            {format(new Date(notification.createdAt), "yyyy/MM/dd, HH:mm:ss")}

            <Link href={`/dashboard/notification/${notification.id}`}>
              <FaEdit
                className="text-gray-500 hover:text-gray-900 text-xl"
                title="Edit"
              />
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
}

export default NotificationList;
