"use client";
import React, { useEffect, useRef, useState } from "react";
import SearchBox from "../SearchBox";
import LoadingComponent from "../LoadingComponent";
import { getLogAudits } from "@/dbActions/loginAudit";
import { format } from "date-fns";
import { MdCheckCircleOutline } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";

function LoginAuditList() {
  const [searchText, setSearchText] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchBoxRef = useRef();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const logs = await getLogAudits(searchText);

        if (logs && logs.type === "success") {
          setLogs(logs.message);
        }
      } catch (err) {
        console.error("Failed to fetch logs : ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [searchText]);

  const handleSearch = () => {
    setSearchText(searchBoxRef.current.value);
  };

  return (
    <section className="flex flex-col gap-3 flex-wrap">
      <SearchBox ref={searchBoxRef} handleSearch={handleSearch} />

      {loading && <LoadingComponent />}
      {/* List of users */}
      {logs.map((log) => (
        <div
          key={log.id}
          className="flex justify-between  flex-wrap rounded-md w-full h-fit border-dotted border-b-2 border-zinc-300 px-3 text-sm"
        >
          <div className="font-normal w-[200px] text-xs">
            {format(new Date(log.createdAt), "yyyy/MM/dd, HH:mm:ss")}
          </div>

          <div className="relative w-[200px] h-fit">
            <span className="text-[0.8rem]">{log?.userName}</span>
          </div>

          <div className="relative w-[200px] h-fit">
            <span className="text-[0.8rem]">
              {log.user?.firstName} {log.user?.lastName}
            </span>
          </div>

          <div className="flex flex-col justify-center gap-1 items-start min-w-[300px] text-xs">
            <span className="text-[0.8rem]">{log?.remarks}</span>
          </div>

          <div className="flex justify-end gap-1 items-start min-w-[200px]">
            {log?.status === "success" ? (
              <>
                <MdCheckCircleOutline className="text-xl text-green-700" />{" "}
                <span className="text-green-700">Success</span>
              </>
            ) : log?.status === "failed" ? (
              <>
                <MdOutlineCancel className="text-xl text-red-700" />
                <span className="text-red-700">Failed</span>
              </>
            ) : (
              ""
            )}
          </div>

          {/* <div className="flex flex-col justify-between items-start min-w-[300px] text-xs">
            <div>
              Created At:{" "}
              {format(new Date(log.createdAt), "yyyy/MM/dd, HH:mm:ss")}
            </div>
          </div> */}
        </div>
      ))}
    </section>
  );
}

export default LoginAuditList;
