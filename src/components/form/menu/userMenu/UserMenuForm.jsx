"use client";

import CheckBox from "@/components/CheckBox";
import { getMenuByIdAction } from "@/dbActions/menu";
import { getUserRolesForTenant } from "@/dbActions/userRole";
import {
  createUserRoleMenuAction,
  deleteUserRoleMenuAction,
  getUserRolesByMenuAction,
} from "@/dbActions/userRoleMenu";
import { useMessageBox } from "@/providers/MessageProvider";
import { useEffect, useState } from "react";

const UserMenuForm = ({ selectedMenuId }) => {
  const [tenantUserRoles, setTenantUserRoles] = useState([]);
  const [assignedUserroles, setAssignedUserroles] = useState([]);
  const [status, setStatus] = useState(true);
  const [availableTenants, setAvailableTenants] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState();

  const showMessage = useMessageBox();

  const handleAssign = async (e) => {
    const result = await createUserRoleMenuAction(selectedMenuId, e);
    setStatus(!status);
    showMessage(result.type, result.message);
  };

  const handleDelete = async (e) => {
    const result = await deleteUserRoleMenuAction(e);
    setStatus(!status);
    showMessage(result.type, result.message);
  };

  useEffect(() => {
    const fetchTenantUserRoles = async (tenantId) => {
      const userRoles = await getUserRolesForTenant(tenantId);
      setTenantUserRoles(userRoles);
    };

    const fetchAssignedUserRoles = async (menuId) => {
      const userRoles = await getUserRolesByMenuAction(menuId);
      setAssignedUserroles(userRoles);
    };

    const fetchMenu = async (id) => {
      const menu = await getMenuByIdAction(id);
      if (menu) {
        setSelectedMenu(menu);
        fetchTenantUserRoles(menu.tenantId);
      }
    };

    fetchAssignedUserRoles(selectedMenuId);

    selectedMenuId && fetchMenu(selectedMenuId);
  }, [selectedMenuId, status]);

  useEffect(() => {
    const fetchAvailableUserRoles = () => {
      const assignedUserRoleIds = assignedUserroles.map(
        (userRole) => userRole.userRoleId
      );

      const availableList = tenantUserRoles.filter(
        (userRole) => !assignedUserRoleIds.includes(userRole.id)
      );
      setAvailableTenants(availableList);
    };

    fetchAvailableUserRoles();
  }, [selectedMenuId, assignedUserroles, tenantUserRoles]);

  return (
    <div>
      <h2 className="font-bold px-3 py-2 bg-blue-950 w-fit rounded-t-xl text-white shadow-md">
        User Roles
      </h2>
      <div className="w-full flex flex-row justify-between p-2 rounded-b-md rounded-tr-md -md max-h-64 bg-white shadow-md">
        {/* List of tenants */}
        <div className="w-1/2 border-r-4 border-gray-100 p-2 overflow-scroll">
          {availableTenants.map((tenant) => (
            <CheckBox
              key={tenant.id}
              label={tenant.name}
              addDelete={"add"}
              onClickEvent={() => handleAssign(tenant.id)}
            />
          ))}
        </div>

        {/* List of assigned tenants */}
        <div className="w-1/2 p-2 overflow-scroll">
          {assignedUserroles.map((userRole) => (
            <CheckBox
              key={userRole.id}
              label={userRole.userRole?.name}
              addDelete={"delete"}
              onClickEvent={() => handleDelete(userRole.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserMenuForm;
