import { updateReadNotificationLog } from "@/dbActions/notificationLog";
import { format } from "date-fns";
import React from "react";
import { CiRead } from "react-icons/ci";

function UserNotification({ log, handleShowMessage, children }) {
  const handleRead = async (id) => {
    const result = await updateReadNotificationLog(id);
    if (result) {
      handleShowMessage(result.type, result.message);
    }
  };

  return (
    <div
      className={`border-slate-200 border-b-2 shadow-sm w-full min-w-[300px] text-sm`}
    >
      <div className="flex justify-between w-full bg-slate-100 p-3">
        <div className="font-bold">
          {log?.notification?.title}
          <span className="font-thin text-sm font-mono text-blue-700">
            {" "}
            [{" "}
            {format(
              new Date(log?.notification?.createdAt),
              "yyyy/MM/dd, HH:mm:ss"
            )}{" "}
            ]
          </span>
        </div>

        {!log?.read && (
          <div
            className="font-black hover:text-red-400 flex items-center gap-1 cursor-pointer"
            onClick={() => handleRead(log?.id)}
          >
            <span>Read ?</span> <CiRead className="font-black text-lg" />
          </div>
        )}
      </div>
      <div className={`p-3 ${log?.read ? "font-extralight" : "font-bold"}`}>
        {children}
      </div>
    </div>
  );
}

export default UserNotification;
