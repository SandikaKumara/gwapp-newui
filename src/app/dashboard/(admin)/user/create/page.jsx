import BackButton from "@/components/BackButton";
import UserForm from "@/components/form/user/UserForm";

const createUserPage = () => {
  return (
    <div className="pl-4 flex flex-col">
      <header className="flex justify-between">
        <h1 className="font-bold text-2xl uppercase">Create User</h1>
        <BackButton url={"/dashboard/user"} />
      </header>

      <UserForm />
    </div>
  );
};

export default createUserPage;
