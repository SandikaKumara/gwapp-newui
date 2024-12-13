"use client";
import Loading from "@/app/loading";
import UsersList from "@/components/entities/UsersList";
import NewDialogButton from "@/components/NewDialogButton";

function UserPage() {
  return (
    <div className="flex flex-col gap-4 px-4 py-2 bg-white rounded shadow-md">
      <header className="flex justify-between">
        <h1 className="font-bold text-2xl uppercase">Users</h1>

        <NewDialogButton url={"/dashboard/user/create"} />
      </header>

      <UsersList />
    </div>
  );
}

export default UserPage;
