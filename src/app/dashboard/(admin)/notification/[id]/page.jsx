import BackButton from "@/components/BackButton";
import NotificationForm from "@/components/form/notification/NotificationForm";
import React from "react";

function EditNotificationPage({ params }) {
  return (
    <div className="pl-4 flex flex-col">
      <header className="flex justify-between">
        <h1 className="font-bold text-2xl text-zinc-950">Edit Notification</h1>
        <BackButton url={"/dashboard/notification"} />
      </header>
      <NotificationForm selectedNotificationId={params.id} />
      {/* <UserUserRoleForm selectedUserRoleId={params.id} /> */}
    </div>
  );
}

export default EditNotificationPage;
