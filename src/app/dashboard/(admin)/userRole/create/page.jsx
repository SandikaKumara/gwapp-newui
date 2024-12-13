import BackButton from "@/components/BackButton";
import UserRoleForm from "@/components/form/userRole/UserRoleForm";

const createUserRolePage = () => {
  return (
    <div className="pl-4 flex flex-col">
      <header className="flex justify-between">
        <h1 className="font-bold text-2xl uppercase">Create User Role</h1>
        <BackButton url={"/dashboard/userRole"} />
      </header>

      <UserRoleForm />
    </div>
  );
};

export default createUserRolePage;
