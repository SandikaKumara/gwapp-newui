"use client";

import InputBox from "@/components/InputBox";
import SaveButton from "@/components/SaveButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import validateUserForm from "./userFormValidation";
import TextArea from "@/components/TextArea";
import {
  createUserAction,
  editUserAction,
  generatePasswordResetCode,
  getUserByIdAction,
} from "@/dbActions/userActions";
import { useMessageBox } from "@/providers/MessageProvider";
import OptionBox from "@/components/OptionBox";
import { getTenantListAction } from "@/dbActions/tenant";
import { MdLockReset } from "react-icons/md";
import LoadingComponent from "@/components/LoadingComponent";

const UserForm = ({ selectedUserId, isDisabled = false }) => {
  const [errors, setErrors] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const showMessage = useMessageBox();
  let result = {};

  const handleFormSubmit = async (formdata) => {
    const validations = await validateUserForm(formdata, selectedUserId);
    setErrors(validations);
    if (validations.length === 0) {
      if (selectedUser) {
        result = await editUserAction(formdata, selectedUserId);
      } else {
        result = await createUserAction(formdata);
      }
      showMessage(result.type, result.message);
      if (result.type === "success") {
        router.push(`/dashboard/user/${result.id}`);
      }
      // console.log(router);
    }
  };

  const handlePasswordReset = async (id) => {
    const result = await generatePasswordResetCode(id);
    if (result) {
      showMessage(result.type, result.message);
    }
  };

  useEffect(() => {
    try {
      setLoading(true);
      const fetchUser = async (id) => {
        const user = await getUserByIdAction(id);
        if (user) {
          setSelectedUser(user);
        }
      };

      const getTenants = async () => {
        const tenants = await getTenantListAction("", true);
        setTenants(tenants);
      };
      selectedUserId && fetchUser(selectedUserId);
      getTenants();
    } catch (err) {
      console.error("Failed to fetch user : ", err);
    } finally {
      setLoading(false);
    }
  }, [selectedUserId]);

  return (
    <>
      {loading ? (
        <LoadingComponent />
      ) : (
        <div>
          <form
            className="flex flex-col gap-3 py-6 px-6 bg-white mt-4 rounded w-1/2 min-w-[300px] mb-6 shadow-md"
            action={handleFormSubmit}
            // encType="multipart/form-data"
          >
            <InputBox
              label={"First Name"}
              name={"firstName"}
              required={true}
              value={selectedUser?.firstName || ""}
            />
            <InputBox
              label={"Last Name"}
              name={"lastName"}
              value={selectedUser?.lastName || ""}
            />
            <InputBox
              label={"Email"}
              name={"email"}
              required={true}
              value={selectedUser?.email || ""}
              isDisabled={isDisabled}
            />
            <InputBox
              label={"Contact"}
              name={"contact"}
              value={selectedUser?.contact || ""}
            />
            <TextArea
              label={"Address"}
              name={"address"}
              rows="4"
              value={selectedUser?.address || ""}
            />
            <OptionBox
              label={"Tenant"}
              name={"tenant"}
              values={tenants}
              required
              selectedId={selectedUser?.tenantId}
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

            <div className="flex justify-between items-end">
              {selectedUserId && (
                <div className="">
                  <span
                    className="flex items-center justify-start gap-3 w-fit px-4 py-2 rounded-md shadow-lg bg-red-600 text-white cursor-pointer hover:bg-red-300"
                    title="Double click to reset the password"
                    onDoubleClick={() => {
                      handlePasswordReset(selectedUserId && selectedUserId);
                    }}
                  >
                    <MdLockReset className="text-lg" />{" "}
                    <span>Reset Password</span>
                  </span>
                </div>
              )}
              <SaveButton refresh={errors} />
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default UserForm;
