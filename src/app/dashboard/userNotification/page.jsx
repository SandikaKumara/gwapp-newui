import UserNotificationList from "@/components/entities/UserNotificationList";
import NewDialogButton from "@/components/NewDialogButton";
import React from "react";

function userNotificationPage() {
  return (
    <div className="flex flex-col gap-4 px-4 py-2 bg-white rounded shadow-md">
      <header className="flex justify-between">
        <h1 className="font-bold text-2xl uppercase">Notifications</h1>

        {/* <NewDialogButton url={"/dashboard/ticket/create"} /> */}
      </header>

      <UserNotificationList />
    </div>
  );
}

export default userNotificationPage;
