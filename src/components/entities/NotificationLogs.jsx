"use client";
import { getNotificationLogsAction } from "@/dbActions/notificationLog";
import { useMessageBox } from "@/providers/MessageProvider";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdCheckCircleOutline } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";
import { IoMdCheckboxOutline } from "react-icons/io";
import { MdOutlineCancelPresentation } from "react-icons/md";

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
    <div className="flex flex-col">
      <div className=" flex bg-indigo-950 text-indigo-50 p-1 font-bold uppercase rounded ">
        <div className="w-[600px] pl-2">Name</div>
        <div className="w-[300px]">Sent</div>
        <div className="w-[300px]">Read</div>
      </div>

      {logs.map((log) => (
        <div key={log.id} className="flex hover:bg-blue-100 px-2 py-1">
          <div className="w-[600px]">
            {log.user?.firstName} {log.user?.lastName}
          </div>
          <div className="w-[300px]">
            {log?.sent ? (
              <IoMdCheckboxOutline className="text-green-600 text-2xl" />
            ) : (
              <MdOutlineCancelPresentation className="text-pink-300 text-2xl" />
            )}
          </div>
          <div className="w-[300px]">
            {log?.read ? (
              <IoMdCheckboxOutline className="text-green-600 text-2xl" />
            ) : (
              <MdOutlineCancelPresentation className="text-pink-300 text-2xl" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default NotificationLogs;
