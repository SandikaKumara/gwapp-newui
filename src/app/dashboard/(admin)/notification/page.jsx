"use client";
import NotificationList from "@/components/entities/NotificationList";
import NewDialogButton from "@/components/NewDialogButton";
import { useSession } from "@/providers/SessionProvider";

function NotificationPage() {
  const { sessionTenant } = useSession();

  return (
    <div className="flex flex-col gap-4 px-4 py-2 bg-white rounded shadow-md">
      <header className="flex justify-between">
        <h1 className="font-bold text-2xl uppercase">Notifications</h1>
        {sessionTenant?.isAdmin && (
          <NewDialogButton url={"/dashboard/notification/create"} />
        )}
      </header>

      <NotificationList />
    </div>
  );
}

export default NotificationPage;
