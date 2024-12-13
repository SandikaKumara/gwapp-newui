import UserRolesList from "@/components/entities/UserRolesList";
import NewDialogButton from "@/components/NewDialogButton";

function UserrolePage() {
  return (
    <div className="pl-4 flex flex-col">
      <header className="flex justify-between">
        <h1 className="font-bold text-2xl uppercase">User Roles</h1>

        <NewDialogButton url={"/dashboard/userRole/create"} />
      </header>
      {/* List of user roles */}
      <UserRolesList />
    </div>
  );
}

export default UserrolePage;
