"use client";

import { useMessageBox } from "@/providers/MessageProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import validateUserRoleForm from "./userRoleFormValidations";
import {
  createUserRoleAction,
  editUserRoleAction,
  getUserRoleByIdAction,
  getUserRoleListAction,
} from "@/dbActions/userRole";
import SaveButton from "@/components/SaveButton";
import InputBox from "@/components/InputBox";
import OptionBox from "@/components/OptionBox";
import { getTenantListAction } from "@/dbActions/tenant";
import LoadingComponent from "@/components/LoadingComponent";

const UserRoleForm = ({ selectedUserRoleId }) => {
  const [errors, setErrors] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [selectedUserRole, setSelectedUserRole] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const showMessage = useMessageBox();
  let result = {};

  const handleFormSubmit = async (formdata) => {
    const validations = await validateUserRoleForm(
      formdata,
      selectedUserRoleId
    );
    setErrors(validations);

    if (validations.length === 0) {
      if (selectedUserRole) {
        result = await editUserRoleAction(formdata, selectedUserRoleId);
      } else {
        result = await createUserRoleAction(formdata);
      }

      showMessage(result.type, result.message);

      if (result.type === "success") {
        router.push(`/dashboard/userRole/${result.id}`);
      }
    }
  };

  useEffect(() => {
    try {
      setLoading(true);
      const getUserRole = async (id) => {
        if (id) {
          const userRole = await getUserRoleByIdAction(id);
          if (userRole) {
            setSelectedUserRole(userRole);
          }
        }
      };

      const getTenants = async () => {
        const tenants = await getTenantListAction("", true);
        if (tenants) {
          setTenants(tenants);
        }
      };

      getTenants();
      getUserRole(selectedUserRoleId);
    } catch (err) {
      console.error("Failed to fetch user role : ", err);
    } finally {
      setLoading(false);
    }
  }, [selectedUserRoleId]);

  return (
    <>
      {loading ? (
        <LoadingComponent />
      ) : (
        <form
          className="flex flex-col gap-3 py-6 px-6 bg-white mt-4 rounded w-1/2 min-w-[300px] mb-6 shadow-md"
          action={handleFormSubmit}
        >
          <OptionBox
            label={"Tenant"}
            name={"tenant"}
            required
            values={tenants}
            selectedId={selectedUserRole?.tenantId || 0}
            isDisabled={selectedUserRole && true}
          />

          <InputBox
            label={"Name"}
            name={"name"}
            required={true}
            value={selectedUserRole?.name || ""}
          />

          {errors.length > 0 && (
            <div className="text-red-500 text-sm pt-2">
              # Input data validation errors occurred as listed below.
              {errors.map((error, index) => (
                <div className="" key={index}>
                  - {error}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end items-end">
            <SaveButton />
          </div>
        </form>
      )}
    </>
  );
};

export default UserRoleForm;
