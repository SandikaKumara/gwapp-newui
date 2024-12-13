"use client";

import { getNotificationListAction } from "@/dbActions/notification";
import { useEffect, useRef, useState } from "react";
import SearchBox from "../SearchBox";
import LoadingComponent from "../LoadingComponent";
import { BsThreeDotsVertical } from "react-icons/bs";
import Link from "next/link";
import Switch from "../Switch";
import { format } from "date-fns";

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
    <section className="flex flex-col gap-3 flex-wrap ">
      <SearchBox ref={searchBoxRef} handleSearch={handleSearch} />

      {loading && <LoadingComponent />}
      {/* List of notifications */}
      {notificationList.map((notification) => (
        <div
          key={notification.id}
          className="flex justify-between flex-wrap gap-1 rounded-md w-full h-fit border-dotted border-b-2 border-zinc-300 p-3 text-sm"
        >
          <div className="flex flex-col gap-1 min-w-[300px]">
            <div className="font-semibold">{notification.title}</div>
            <div className="text-xs">{notification.user?.firstName}</div>
          </div>

          <div className="flex flex-col gap-1 min-w-[300px]">
            <div className="font-semibold">{notification.message}</div>
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

          <div className="flex flex-col justify-center items-start min-w-[300px] text-xs">
            Created At:{" "}
            {format(new Date(notification.createdAt), "yyyy/MM/dd, HH:mm:ss")}
          </div>

          <div className="font-bold flex flex-col justify-start items-end cursor-pointer">
            <Link href={`/dashboard/notification/${notification.id}`}>
              <BsThreeDotsVertical title="Edit" />
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
}

export default NotificationList;
