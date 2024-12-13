"use client";
import BackButton from "@/components/BackButton";
import UserRoleForm from "@/components/form/userRole/UserRoleForm";
import UserUserRoleForm from "@/components/form/userRole/userUserRole/UserUserRoleForm";
import { useEffect, useState } from "react";

const EditUserRolePage = ({ params }) => {
  // const [userRole, setUserRole] = useState({});

  // useEffect(() => {
  //   const fetchUserRole = async (id) => {
  //     const item = await fetchUserRole(id);
  //     setUserRole(item);
  //   };

  //   fetchUserRole(params.id);
  // }, [params]);
  return (
    <div className="pl-4 flex flex-col">
      <header className="flex justify-between">
        <h1 className="font-bold text-2xl uppercase">Edit User Role</h1>
        <BackButton url={"/dashboard/userRole"} />
      </header>
      <UserRoleForm selectedUserRoleId={params.id} />
      <UserUserRoleForm selectedUserRoleId={params.id} />
    </div>
  );
};

export default EditUserRolePage;
