"use client";
import React, { useEffect, useRef, useState } from "react";
import SearchBox from "../SearchBox";
import LoadingComponent from "../LoadingComponent";
import { getLogAudits } from "@/dbActions/loginAudit";
import { format } from "date-fns";
import { MdCheckCircleOutline } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";
import Pagination from "../Pagination";

function LoginAuditList() {
  const [searchText, setSearchText] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const searchBoxRef = useRef();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const logs = await getLogAudits(searchText, page);

        if (logs && logs.type === "success") {
          setLogs(logs.message);
          setTotalPages(logs.pagination.totalPages);
          setTotalCount(logs.pagination.totalCount);
        }
      } catch (err) {
        console.error("Failed to fetch logs : ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [searchText, page]);

  const handleSearch = () => {
    setSearchText(searchBoxRef.current.value);
  };

  return (
    <section className="flex flex-col flex-wrap">
      <div className="flex justify-between">
        <SearchBox ref={searchBoxRef} handleSearch={handleSearch} />
        {/* <div>
          {page} - {totalPages} - {totalCount}
        </div> */}
        <Pagination
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          setPage={setPage}
        />
      </div>

      {loading ? (
        <LoadingComponent />
      ) : (
        logs.map((log) => (
          <div
            key={log.id}
            className="flex justify-between flex-wrap rounded w-full h-fit px-2 py-2 text-sm text-gray-600 hover:bg-gray-200 shadow-sm odd:bg-white even:bg-gray-100"
          >
            <div className="relative w-[200px] ">
              {format(new Date(log.createdAt), "yyyy/MM/dd, HH:mm:ss")}
            </div>

            <div className="relative w-[200px] h-fit">
              <span>{log?.userName}</span>
            </div>

            <div className="relative w-[200px] h-fit">
              <span>
                {log.user?.firstName} {log.user?.lastName}
              </span>
            </div>

            <div className="flex flex-col justify-center gap-1 items-start min-w-[300px]">
              <span>{log?.remarks}</span>
            </div>

            <div className="flex justify-start gap-1 items-center w-24">
              {log?.status === "success" ? (
                <>
                  <MdCheckCircleOutline className="text-xl text-emerald-700" />{" "}
                  <span className="text-emerald-700">Success</span>
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
        ))
      )}
      {/* List of users */}
    </section>
  );
}

export default LoginAuditList;
