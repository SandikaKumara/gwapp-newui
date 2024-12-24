"use client";
import BackButton from "@/components/BackButton";
import TicketLog from "@/components/entities/TicketLog";
import TicketLogForm from "@/components/form/ticketLog/TicketLogForm";
import PageFooter from "@/components/PageFooter";
import { getTicketAction } from "@/dbActions/ticket";
import { format } from "date-fns";
import { ImAttachment } from "react-icons/im";

import { useEffect, useState } from "react";
import { useMessageBox } from "@/providers/MessageProvider";
import { useRouter } from "next/navigation";
// import { redirect } from "next/navigation";

const TicketReplyPage = ({ params }) => {
  const [ticket, setTicket] = useState();
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const showMessage = useMessageBox();
  const router = useRouter();

  useEffect(() => {
    const fetchTicket = async (id) => {
      const item = await getTicketAction(id);

      if (item) {
        setTicket(item);
      } else {
        showMessage(
          "error",
          "Failed to fetch ticket or you don't have permission to view this ticket"
        );
        router.push("/dashboard/ticket");
      }
    };

    fetchTicket(params.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, refresh]);

  const handleShowForm = () => {
    setShowForm(!showForm);
    handleRefresh();
  };

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="flex flex-col gap-3 py-6 px-6 bg-white mt-4 rounded w-full min-w-[300px] mb-6 shadow-md">
      <div className="flex justify-end">
        <div className="w-fit">
          <BackButton url={"/dashboard/ticket"} />
        </div>
      </div>
      {/* ticket info */}
      <div className="flex flex-col gap-2 border border-gray-300 rounded-md p-6">
        <div>
          <span className="font-bold text-slate-500">Ticket ID : </span>
          <span className="font-bold text-blue-700">#{ticket?.slug}</span>
        </div>
        <div className="flex justify-between border-b-2 pb-2 border-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500">Title : </span>{" "}
            {ticket?.title}
          </div>
          <div>
            {/* {format(new Date(ticket?.createdAt), "yyyy/MM/dd, HH:mm:ss")} */}
          </div>
          <div className="mb-2">
            <span className="font-bold text-slate-500">Status : </span>
            <span
              className="text-slate-50 py-2 px-4 rounded-full"
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

        <div className="mb-4 mt-2">
          <span className="font-bold text-slate-500">Content : </span>{" "}
          {ticket?.content}
        </div>

        {ticket?.attachment && (
          <div>
            <a
              href={ticket?.attachment}
              download={ticket?.attachment.split("/").pop()}
              className="flex gap-2 items-center cursor-pointer text-blue-400"
            >
              <span className="font-bold text-slate-500">
                <ImAttachment />
              </span>
              {ticket?.attachment.split("/").pop()}
            </a>
          </div>
        )}

        <div className="flex justify-between pt-2 text-slate-400">
          <div>
            <span className="font-bold text-slate-500">Tenant : </span>
            {ticket?.tenant?.name}
          </div>
          <div>
            <span className="font-bold text-slate-500">User : </span>
            {ticket?.user?.firstName} {ticket?.user?.lastName}
          </div>
        </div>
      </div>
      {/* comment form */}

      {ticket?.status !== "CLOSED" && (
        <button
          className=" bg-emerald-600 py-2 px-4 w-fit rounded-md shadow-md text-emerald-50 font-bold hover:bg-emerald-900 mt-6"
          onClick={handleShowForm}
        >
          {showForm ? "Cancel Comment" : "Add Comment"}
        </button>
      )}

      {showForm && (
        <TicketLogForm ticketId={ticket?.id} handleShowForm={handleShowForm} />
      )}

      {/* comment logs */}

      <TicketLog ticketId={ticket?.id} refresh={refresh} />
    </div>
  );
};

export default TicketReplyPage;
