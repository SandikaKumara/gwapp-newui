"use client";
import NotificationList from "@/components/entities/NotificationList";
import NewDialogButton from "@/components/NewDialogButton";
import { useSession } from "@/providers/SessionProvider";

function NotificationPage() {
  const { sessionTenant } = useSession();

  return (
    <div className="flex flex-col gap-4">
      <header className="flex justify-between">
        <h1 className="font-bold text-2xl text-zinc-950">Notifications</h1>
        {sessionTenant?.isAdmin && (
          <NewDialogButton url={"/dashboard/notification/create"} />
        )}
      </header>

      <NotificationList />
    </div>
  );
}

export default NotificationPage;
