"use client";

import CheckBox from "@/components/CheckBox";
import { getUserRoleByIdAction } from "@/dbActions/userRole";
import { getUsersOfTenant } from "@/dbActions/userTenant";
import {
  createUserUserRole,
  deleteUserUserRole,
  getUserUserRoleListAction,
} from "@/dbActions/userUserRole";
import { useMessageBox } from "@/providers/MessageProvider";
import { useEffect, useState } from "react";

const UserUserRoleForm = ({ selectedUserRoleId }) => {
  const [tenantUsers, setTenantUsers] = useState([]);
  const [assginedUsers, setAssignedUsers] = useState([]);
  const [status, setStatus] = useState(true);
  const [availableTenantUsers, setAvailableTenantUsers] = useState([]);
  const [selectedUserRole, setSelectedUserRole] = useState();

  const showMessage = useMessageBox();

  const handleAssign = async (e) => {
    const result = await createUserUserRole(selectedUserRoleId, e);
    setStatus(!status);
    showMessage(result.type, result.message);
  };

  const handleDelete = async (e) => {
    const result = await deleteUserUserRole(e);
    setStatus(!status);
    showMessage(result.type, result.message);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (selectedUserRoleId) {
        // fetch user role
        const userRole = await getUserRoleByIdAction(selectedUserRoleId);

        if (userRole) {
          setSelectedUserRole(userRole);

          // fetch user role users
          const users = await getUsersOfTenant(userRole?.tenantId);
          setTenantUsers(users);
        }
      }
    };
    const fetchAssignedUsers = async () => {
      const users = await getUserUserRoleListAction(selectedUserRoleId);
      setAssignedUsers(users);
    };
    fetchUsers();
    fetchAssignedUsers();
    // fetchAvailableUsers(selectedUserRole);
  }, [selectedUserRoleId, status]);

  useEffect(() => {
    const fetchAvailableUsers = () => {
      const assignedUserIds = assginedUsers.map((user) => user.userId);
      // assignedUserIds.push(selectedRole.userId);
      // console.log("assignedUserIds: ", assignedUserIds);

      const availableList = tenantUsers.filter(
        (user) => !assignedUserIds.includes(user.id)
      );
      setAvailableTenantUsers(availableList);
    };
    fetchAvailableUsers(selectedUserRole);
  }, [selectedUserRole, tenantUsers]);

  return (
    <div>
      <h2 className="font-bold px-3 py-2 bg-blue-950 w-fit rounded-t-xl text-white shadow-md">
        Users
      </h2>
      <div className="w-full flex flex-row justify-between p-2 rounded-b-md rounded-tr-md -md max-h-64 bg-white shadow-md">
        {/* List of tenants */}
        <div className="w-1/2 border-r-4 border-gray-100 p-2 overflow-scroll">
          {availableTenantUsers.map((user) => (
            <CheckBox
              key={user.id}
              label={user.firstName + " " + user.lastName}
              addDelete={"add"}
              onClickEvent={() => handleAssign(user.id)}
            />
          ))}
        </div>

        {/* List of assigned tenants */}
        <div className="w-1/2 p-2 overflow-scroll">
          {assginedUsers.map((user) => (
            <CheckBox
              key={user.id}
              label={user.user?.firstName + " " + user.user?.lastName}
              addDelete={"delete"}
              onClickEvent={() => handleDelete(user.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserUserRoleForm;
