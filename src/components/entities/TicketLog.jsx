"use client";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import PageFooter from "../PageFooter";
import { getTicketLog } from "@/dbActions/ticketLog";
import { useMessageBox } from "@/providers/MessageProvider";
import { ImAttachment } from "react-icons/im";

const TicketLog = ({ ticketId, refresh }) => {
  const [logs, setLogs] = useState([]);

  const showMessage = useMessageBox();

  useEffect(() => {
    const fetchTicketLogs = async (id) => {
      const logs = await getTicketLog(id);
      // console.log(logs);

      if (logs && logs.type === "success") {
        setLogs(logs.message);
      } else {
        showMessage(logs.type, logs.message);
      }
    };

    fetchTicketLogs(ticketId);
  }, [ticketId, refresh]);

  return (
    <div className="bg-gray-50 w-full h-full flex flex-col pb-4">
      {logs.map((log) => (
        <div
          key={log.id}
          className="w-full h-fit border-2 border-dotted border-slate-400 rounded-md p-3 shadow-md"
        >
          <div className="py-2">
            <span className="font-bold">ID : </span> {log?.id}
          </div>

          <div>
            <span className="font-bold">Comment : </span> {log?.note}
          </div>

          {log?.attachment && (
            <div>
              <a
                href={log?.attachment}
                download={log?.attachment.split("/").pop()}
                className="flex gap-2 items-center cursor-pointer text-blue-400"
              >
                <span className="font-bold text-slate-500">
                  <ImAttachment />
                </span>
                {log?.attachment.split("/").pop()}
              </a>
            </div>
          )}

          <div className="flex justify-between py-2 px-2 bg-slate-200 mt-3">
            <div className="flex gap-2">
              <span className="font-bold">User : </span> {log.user?.firstName}{" "}
              {log.user?.lastName}
            </div>
            <span className="text-xs text-slate-400">
              {" "}
              {format(new Date(log?.createdAt), "yyyy/MM/dd, HH:mm:ss")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketLog;
