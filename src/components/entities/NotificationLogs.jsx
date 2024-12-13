"use client";
import { getNotificationLogsAction } from "@/dbActions/notificationLog";
import { useMessageBox } from "@/providers/MessageProvider";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdCheckCircleOutline } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";

function NotificationLogs({ selectedNotificationId, refresh }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async (id) => {
      const list = await getNotificationLogsAction(id);

      if (list && list.type === "success") {
        setLogs(list.message);
      }
    };

    fetchLogs(selectedNotificationId);
  }, [selectedNotificationId, refresh]);
  return (
    <div className="flex flex-col gap-2 text-sm ">
      <div className=" flex bg-blue-100 p-1 font-extrabold rounded-md ">
        <div className="w-[600px] pl-2">Name</div>
        <div className="w-[300px]">Sent</div>
        <div className="w-[300px]">Read</div>
      </div>

      {logs.map((log) => (
        <div key={log.id} className="flex pl-2 hover:bg-slate-100">
          <div className="w-[600px] font-mono">
            {log.user?.firstName} {log.user?.lastName}
          </div>
          <div className="w-[300px]">
            {log?.sent ? (
              <MdCheckCircleOutline className="text-green-500 text-2xl" />
            ) : (
              <MdOutlineCancel className="text-pink-500 text-2xl" />
            )}
          </div>
          <div className="w-[300px]">
            {log?.read ? (
              <MdCheckCircleOutline className="text-green-500 text-2xl" />
            ) : (
              <MdOutlineCancel className="text-pink-500 text-2xl" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default NotificationLogs;
