"use client";
import BackButton from "@/components/BackButton";
import UserForm from "@/components/form/user/UserForm";
import UserTenantForm from "@/components/form/user/userTenant/UserTenantForm";
import { getUserByIdAction } from "@/dbActions/userActions";
import { useEffect, useState } from "react";

const EditUserPage = ({ params }) => {
  // const [user, setUser] = useState({});
  // useEffect(() => {
  //   const fetchUser = async (id) => {
  //     const item = await getUserByIdAction(id);
  //     setUser(item);
  //   };

  //   fetchUser(params.id);
  // }, [params]);
  return (
    <div className="pl-4 flex flex-col">
      <header className="flex justify-between">
        <h1 className="font-bold text-2xl uppercase">Edit User</h1>
        <BackButton url={"/dashboard/user"} />
      </header>
      <UserForm selectedUserId={params.id} isDisabled={true} />
      <UserTenantForm selectedUserId={params.id} />
    </div>
  );
};

export default EditUserPage;
