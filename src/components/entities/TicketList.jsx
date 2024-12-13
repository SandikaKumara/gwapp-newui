"use client";

import { useEffect, useRef, useState } from "react";
import SearchBox from "../SearchBox";
import Link from "next/link";
import { BsThreeDotsVertical } from "react-icons/bs";
import { getTicketListAction } from "@/dbActions/ticket";
import { format } from "date-fns";
import { FaReplyAll } from "react-icons/fa";
import PageFooter from "../PageFooter";
import LoadingComponent from "../LoadingComponent";

const TicketList = () => {
  const [searchText, setSearchText] = useState("");
  const [ticketList, setTicketList] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchBoxRef = useRef();

  // const handleToggleActive = async (id) => {
  //   await enableDisableTenant(id);
  // };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const tickets = await getTicketListAction(searchText);
        // console.log(tickets);

        setTicketList(tickets); // Set the state with the resolved data
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
        // Handle the error appropriately
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [searchText]);

  const handleSearch = () => {
    setSearchText(searchBoxRef.current.value);
  };

  return (
    <section className="flex flex-col gap-3 flex-wrap ">
      <SearchBox ref={searchBoxRef} handleSearch={handleSearch} />

      {loading && <LoadingComponent />}
      {/* List of tickets */}
      {ticketList.map((ticket) => (
        <div
          key={ticket?.id}
          className="flex justify-between flex-wrap gap-1 rounded-md w-full h-fit border-dotted border-b-2 border-zinc-300 p-3 text-sm"
        >
          <div className="flex flex-col gap-1 min-w-[300px]">
            <div className="font-semibold">{ticket?.title}</div>
            <div className="text-xs">
              <span
                className="p-2  w-fit h-fit rounded-full font-bold text-red-50 text-[0.6rem]"
                style={{
                  backgroundColor:
                    ticket?.status === "CREATED"
                      ? "red"
                      : ticket?.status === "IN-PROGRESS"
                      ? "green"
                      : "gray",
                }}
              >
                {ticket?.status}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1 min-w-[400px]">
            <div className="text-xs text-wrap">{ticket?.content}</div>
          </div>

          <div className="flex flex-col justify-center items-start min-w-[300px] text-xs">
            Created At:{" "}
            {format(new Date(ticket?.createdAt), "yyyy/MM/dd, HH:mm:ss")}
          </div>

          <div
            className="font-bold flex flex-col justify-start items-end cursor-pointer"
            // onClick={() => {
            //   handleEditTenant(tenant.id);
            // }}
          >
            <Link href={`/dashboard/ticket/${ticket.id}`}>
              <FaReplyAll className="text-lg text-blue-500" title="Reply" />
            </Link>
          </div>

          {/* <div
            className="font-bold flex flex-col justify-start items-end cursor-pointer"
            // onClick={() => {
            //   handleEditTenant(tenant.id);
            // }}
          >
            <Link href={`/dashboard/ticket/${ticket.id}`}>
              <BsThreeDotsVertical title="Edit" />
            </Link>
          </div> */}
        </div>
      ))}
    </section>
  );
};

export default TicketList;
