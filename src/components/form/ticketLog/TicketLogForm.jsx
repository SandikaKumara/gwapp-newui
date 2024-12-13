"use client";

import InputBox from "@/components/InputBox";
import SaveButton from "@/components/SaveButton";
import TextArea from "@/components/TextArea";
import { createTicketLog } from "@/dbActions/ticketLog";
import { useMessageBox } from "@/providers/MessageProvider";
import { useState } from "react";

const TicketLogForm = ({ ticketId, handleShowForm }) => {
  const [attachment, setAttachment] = useState();

  const showMessage = useMessageBox();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);
    formdata.append("attachment", attachment);

    const result = await createTicketLog(formdata, ticketId);
    if (result) {
      showMessage(result.type, result.message);
      handleShowForm();
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-100 p-6 shadow-md flex flex-col gap-3"
      encType="multipart/form-data"
    >
      <TextArea label={"Note"} rows="5" name={"note"} />
      <InputBox label={"Attachment"} name={"file"} type="file" />
      <div className="flex items-center gap-2 bg-red-600 w-fit py-1 px-3 text-red-50 rounded-md">
        <input type="checkbox" name="resolved" />
        <span>Resolved</span>
      </div>

      <SaveButton label="Save" />
    </form>
  );
};

export default TicketLogForm;
