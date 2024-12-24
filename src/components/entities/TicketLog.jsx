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
  }, [ticketId, refresh, showMessage]);

  return (
    <div className=" w-full h-full flex flex-col gap-10 pb-4 mt-10">
      {logs.map((log) => (
        <div
          key={log.id}
          className="bg-gray-50 w-full h-fit border border-dotted border-gray-400 rounded-md shadow-md px-4 py-4"
        >
          {/* <div className="py-2">
            <span className="font-bold">ID : </span> {log?.id}
          </div> */}

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
                <span className="font-bold text-gray-500">
                  <ImAttachment />
                </span>
                {log?.attachment.split("/").pop()}
              </a>
            </div>
          )}

          <div className="flex justify-between py-2 px-2 bg-gray-200 mt-3">
            <div className="flex gap-2 text-gray-600">
              <span className="font-bold">User : </span> {log.user?.firstName}{" "}
              {log.user?.lastName}
            </div>

            <div className="text-gray-600 uppercase">#{log?.id}</div>
            <span className="text-gray-400">
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
