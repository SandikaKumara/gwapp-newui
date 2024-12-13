"use client";

import CheckBox from "@/components/CheckBox";
import LoadingComponent from "@/components/LoadingComponent";
import { getTenantListAction } from "@/dbActions/tenant";
import { getUserByIdAction } from "@/dbActions/userActions";
import {
  createUserTenantAction,
  deleteUserTenantAction,
  getUserTenantListAction,
} from "@/dbActions/userTenant";
import { useMessageBox } from "@/providers/MessageProvider";
import { useEffect, useState } from "react";

const UserTenantForm = ({ selectedUserId }) => {
  const [tenants, setTenants] = useState([]);
  const [assignedTenants, setAssignedTenants] = useState([]);
  const [status, setStatus] = useState(true);
  const [availableTenants, setAvailableTenants] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [loading, setLoading] = useState(false);

  const showMessage = useMessageBox();

  const handleAssign = async (e) => {
    const result = await createUserTenantAction(selectedUser.id, e);
    setStatus(!status);
    showMessage(result.type, result.message);
  };

  const handleDelete = async (e) => {
    const result = await deleteUserTenantAction(e);
    setStatus(!status);
    showMessage(result.type, result.message);
  };

  useEffect(() => {
    const fetchUser = async (id) => {
      const user = await getUserByIdAction(id);
      if (user) {
        setSelectedUser(user);
      }
    };

    const fetchTenants = async () => {
      const tenants = await getTenantListAction("", true);
      tenants ? setTenants(tenants) : setTenants([]);
    };

    const fetchAssignedTenants = async () => {
      const tenants = await getUserTenantListAction(selectedUserId);
      tenants ? setAssignedTenants(tenants) : setAssignedTenants([]);
    };

    fetchUser(selectedUserId);
    fetchAssignedTenants();
    fetchTenants();
  }, [selectedUserId, status]);

  useEffect(() => {
    try {
      setLoading(true);
      const fetchAvailableTenants = () => {
        const assignedTenantIds = assignedTenants.map(
          (tenant) => tenant.tenantId
        );
        assignedTenantIds.push(selectedUser.tenantId);
        const availableList = tenants.filter(
          (tenant) => !assignedTenantIds.includes(tenant.id)
        );

        setAvailableTenants(availableList);
      };

      fetchAvailableTenants();
    } catch (error) {
      console.error("Failed to fetch additional tenants : ", error);
    } finally {
      setLoading(false);
    }
  }, [assignedTenants, tenants, selectedUser.tenantId]);

  return (
    <div>
      <h2 className="font-bold px-3 py-2 bg-blue-950 w-fit rounded-t-xl text-white shadow-md">
        Additional Tenants
      </h2>
      {loading ? (
        <LoadingComponent />
      ) : (
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
            {assignedTenants.map((tenant) => (
              <CheckBox
                key={tenant.id}
                label={tenant.tenant?.name}
                addDelete={"delete"}
                onClickEvent={() => handleDelete(tenant.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTenantForm;
