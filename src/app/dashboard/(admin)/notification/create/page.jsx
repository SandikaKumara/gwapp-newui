import BackButton from "@/components/BackButton";
import NotificationForm from "@/components/form/notification/NotificationForm";
import React from "react";

const createNotificationPage = () => {
  return (
    <div className="pl-4 flex flex-col">
      <header className="flex justify-between">
        <h1 className="font-bold text-2xl text-zinc-950">
          Create Notification
        </h1>
        <BackButton url={"/dashboard/notification"} />
      </header>

      <NotificationForm />
    </div>
  );
};

export default createNotificationPage;
