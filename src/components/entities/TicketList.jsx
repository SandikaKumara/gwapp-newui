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
    <section className="flex flex-col gap-3 flex-wrap overflow-x-auto">
      <SearchBox ref={searchBoxRef} handleSearch={handleSearch} />

      {loading ? (
        <LoadingComponent />
      ) : (
        <table className="table-fixed border-collapse border border-gray-200">
          <thead>
            <tr className="">
              <th className="border border-gray-200 p-2 min-w-24 w-24 whitespace-nowrap">
                ID
              </th>
              <th className="border border-gray-200 p-2 min-w-96 whitespace-nowrap">
                Title
              </th>
              <th className="border border-gray-200 p-2 min-w-44 w-44 whitespace-nowrap">
                Status
              </th>
              <th className="border border-gray-200 p-2 min-w-48 w-48 whitespace-nowrap">
                Created Date
              </th>
              <th className="border border-gray-200 p-2 w-16 whitespace-nowrap">
                Reply
              </th>
            </tr>
          </thead>

          <tbody>
            {ticketList.map((ticket, index) => (
              <tr key={index}>
                <td className="border border-gray-200 p-4 uppercase">
                  #{ticket?.slug}
                </td>
                <td className="border border-gray-200 p-4">{ticket?.title}</td>
                <td className="border border-gray-200 p-4 text-center">
                  <span
                    className="py-2 px-4 w-fit h-fit rounded-full font-bold text-red-50"
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
                </td>
                <td className="border border-gray-200 p-4">
                  {format(new Date(ticket?.createdAt), "yyyy/MM/dd, HH:mm:ss")}
                </td>
                <td className="p-4 flex justify-center items-center h-full">
                  <Link
                    href={`/dashboard/ticket/${ticket.id}`}
                    className="flex justify-center items-center"
                  >
                    <FaReplyAll
                      className="text-lg text-blue-500"
                      title="Reply"
                    />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* List of tickets */}

      {/* {ticketList.map((ticket) => (
        <div
          key={ticket?.id}
          className="flex justify-between gap-1 flex-wrap rounded w-full h-fit bg-white px-4 py-2 shadow-md hover:bg-gray-100"
        >
          <div className="uppercase text-sm">{ticket?.id}</div>
          <div className="flex flex-col gap-1 min-w-[300px]">
            <div className="font-semibold">{ticket?.title}</div>
            <div className="text-xs">
              <span
                className="p-2  w-fit h-fit rounded-2xl font-bold text-red-50 text-[0.6rem]"
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
            {format(new Date(ticket?.createdAt), "yyyy/MM/dd, HH:mm:ss")}
          </div>

          <div className="font-bold flex flex-col justify-start items-end cursor-pointer">
            <Link href={`/dashboard/ticket/${ticket.id}`}>
              <FaReplyAll className="text-lg text-blue-500" title="Reply" />
            </Link>
          </div>
        </div>
      ))} */}

      {/* {ticketList.map((ticket) => (
        <div
          key={ticket?.id}
          className="flex justify-between gap-1 flex-wrap rounded w-full h-fit bg-white px-4 py-2 shadow-md hover:bg-gray-100"
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
           
          >
            <Link href={`/dashboard/ticket/${ticket.id}`}>
              <FaReplyAll className="text-lg text-blue-500" title="Reply" />
            </Link>
          </div>

          
        </div>
      ))} */}
    </section>
  );
};

export default TicketList;
