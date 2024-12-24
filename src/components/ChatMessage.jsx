import { format } from "date-fns";
import React, { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Modal from "./Modal";
import { updateReadNotificationLog } from "@/dbActions/notificationLog";

function ChatMessage({
  notification,
  logId,
  openModalNotification,
  setRefresh,
}) {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const openModal = () => setIsModalOpen(true);
  // const closeModal = () => setIsModalOpen(false);

  const handleOnclick = async () => {
    const result = await updateReadNotificationLog(logId);
    setRefresh();
    openModalNotification(notification);
  };

  return (
    <div
      className="w-full h-fit p-2 flex flex-col gap-1 rounded-sm shadow-md border border-gray-300 text-sm whitespace-nowrap hover:bg-gray-100 relative"
      onClick={handleOnclick}
    >
      <div className="text-wrap font-semibold mb-2 flex items-center justify-between">
        {notification?.title}

        {/* <div href={"#"} className="text-lg hover:font-bold hover:text-red-500">
          <IoIosCloseCircleOutline />
        </div> */}
      </div>

      <div className="text-wrap font-sans text-xs">
        {format(new Date(notification?.createdAt), "yyyy/MM/dd, HH:mm:ss")}
      </div>

      {/* <Modal isOpen={isModalOpen} onClose={closeModal} title={""}>
        <p>{notification?.message}</p>
      </Modal> */}
    </div>
  );
}

export default ChatMessage;
