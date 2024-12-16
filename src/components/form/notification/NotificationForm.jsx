"use client";

import InputBox from "@/components/InputBox";
import LoadingComponent from "@/components/LoadingComponent";
import OptionBox from "@/components/OptionBox";
import SaveButton from "@/components/SaveButton";
import Switch from "@/components/Switch";
import TextArea from "@/components/TextArea";
import {
  createNotificationAction,
  editNotificationAction,
  getNotificationAction,
} from "@/dbActions/notification";
import { getTenantListAction } from "@/dbActions/tenant";
import { getUserRolesForTenant } from "@/dbActions/userRole";
import { getUsersOfTenant } from "@/dbActions/userTenant";
import { getUserUserRoleListAction } from "@/dbActions/userUserRole";
import { useMessageBox } from "@/providers/MessageProvider";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import validateNotificationForm from "./notificationFormValidations";
import Link from "next/link";
import { FaSave } from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";
import { BsFillSendArrowUpFill } from "react-icons/bs";
import {
  generateNotificationUsersAction,
  sendNotificationsAction,
} from "@/dbActions/notificationLog";
import NotificationLogs from "@/components/entities/NotificationLogs";

function NotificationForm({ selectedNotificationId }) {
  const [errors, setErrors] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState();
  const [tenants, setTenants] = useState();
  const [userRoles, setUserRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [selectedTenant, setSelectedTenant] = useState();
  // const [selectedUserRoles, setSelectedUserRoles] = useState();
  const [isSendEmail, setIsSentEmail] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(true);
  const [showGenerateButton, setShowGenarateButton] = useState(false);
  const [showSendButton, setShowSendButton] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const router = useRouter();

  const showMessage = useMessageBox();

  let result = {};

  useEffect(() => {
    try {
      setLoading(true);

      const getTenants = async () => {
        const tenants = await getTenantListAction("", true);
        if (tenants) {
          setTenants(tenants);
        }
      };

      const getNotification = async (id) => {
        const notification = await getNotificationAction(id);
        if (notification) {
          setSelectedNotification(notification);
          setIsSentEmail(notification?.isSendEmail);
        }
      };

      getTenants();
      selectedNotificationId && getNotification(selectedNotificationId);
    } catch (err) {
      console.error("Failed to fetch user role : ", err);
    } finally {
      setLoading(false);
    }
  }, [selectedNotificationId, refresh]);

  useEffect(() => {
    const showUserRolesList = async (id) => {
      await handleTenantSelection(id);
    };

    const showUserList = async (id) => {
      await handleUserRoleSelection(id);
    };

    selectedNotification?.tenantId &&
      showUserRolesList(selectedNotification?.tenantId);

    selectedNotification?.userRoleId &&
      showUserList(selectedNotification?.userRoleId);

    selectedNotification?.generated && !selectedNotification?.sent
      ? setShowSendButton(true)
      : setShowSendButton(false);

    selectedNotification?.sent
      ? setShowSaveButton(false)
      : setShowSaveButton(true);

    selectedNotification && !selectedNotification?.sent
      ? setShowGenarateButton(true)
      : setShowGenarateButton(false);
  }, [selectedNotification]);

  const handleFormSubmit = async (formData) => {
    const action = formData.get("submit");

    if (action === "create") {
      formData.append("isSendEmail", isSendEmail);

      const validations = await validateNotificationForm(
        formData,
        selectedNotificationId
      );
      setErrors(validations);
      if (validations.length === 0) {
        if (selectedNotification && selectedNotification !== "undefined") {
          result = await editNotificationAction(
            formData,
            selectedNotificationId
          );
        } else {
          result = await createNotificationAction(formData);
        }
        showMessage(result.type, result.message);
        if (result.type === "success") {
          router.push(`/dashboard/notification/${result.id}`);
        }
      }
    }

    if (action === "generate") {
      const result = await generateNotificationUsersAction(
        selectedNotificationId
      );
      showMessage(result.type, result.message);
      if (result.type === "success") {
        setRefresh((prev) => !prev);
        router.push(`/dashboard/notification/${result.id}`);
      }
    }

    if (action === "send") {
      const result = await sendNotificationsAction(selectedNotificationId);

      showMessage(result.type, result.message);
      if (result.type === "success") {
        setRefresh((prev) => !prev);
        router.push(`/dashboard/notification/${result.id}`);
      }
    }
  };

  const handleChangeTenant = () => {
    setIsSentEmail((prev) => !prev);
  };

  const handleTenantSelection = async (tenantId) => {
    if (tenantId !== 0) {
      const userRolesList = await getUserRolesForTenant(tenantId);
      if (userRolesList) {
        setUserRoles(userRolesList);
        setUsers([]);
      }
    }
  };

  const handleUserRoleSelection = async (userRoleId) => {
    if (userRoleId !== 0) {
      const usersList = await getUserUserRoleListAction(userRoleId);

      if (usersList) {
        const list = usersList
          .filter((user) => user.user?.isActive)
          .map((user) => ({
            id: user?.userId,
            name: `${user?.user?.firstName} ${user.user?.lastName}`,
          }));
        setUsers(list);
      }
    }
  };

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
            values={tenants}
            // refresh={true}
            selectedId={selectedNotification?.tenantId || 0}
            // isDisabled={selectedNotification && true}
            onChange={handleTenantSelection}
          />

          {userRoles.length > 0 && (
            <OptionBox
              label={"User Role"}
              name={"userRole"}
              values={userRoles}
              // refresh={true}
              selectedId={selectedNotification?.userRoleId || 0}
              // isDisabled={selectedNotification && true}
              onChange={handleUserRoleSelection}
            />
          )}

          {users.length > 0 && (
            <OptionBox
              label={"User"}
              name={"user"}
              values={users}
              // refresh={true}
              selectedId={selectedNotification?.assignedUserId || 0}
              // isDisabled={selectedNotification && true}
              //  onChange={handleUserRoleSelection}
            />
          )}

          <TextArea
            label={"Message"}
            name={"message"}
            rows="10"
            required={true}
            value={selectedNotification?.message || ""}
          />

          <InputBox
            label={"Title"}
            name={"title"}
            required={true}
            value={selectedNotification?.title || ""}
          />

          <Switch
            label={"Send Emails?"}
            action={handleChangeTenant}
            currentStatus={selectedNotification?.isSendEmail || false}
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

          <div className="flex justify-start items-center gap-3 py-6 mt-2">
            {showSaveButton && (
              <button
                className="bg-blue-500 rounded text-sm hover:bg-blue-300 hover:text-blue-100 cursor-pointer flex items-center justify-center gap-2 py-2 px-4 text-white text-wrap mt-6 "
                name={"submit"}
                value={"create"}
              >
                <FaSave className="text-lg" />{" "}
                <span>{selectedNotification ? "Update" : "Create"}</span>
              </button>
            )}

            {showGenerateButton && (
              <button
                className="bg-amber-500 rounded text-sm hover:bg-amber-300 hover:text-amber-100 cursor-pointer flex items-center justify-center gap-2 py-2 px-4 text-white text-wrap mt-6 "
                name={"submit"}
                value={"generate"}
              >
                <FaListCheck className="text-lg" />{" "}
                <span>Generate list of users</span>
              </button>
            )}

            {showSendButton && (
              <button
                className="bg-emerald-500 rounded text-sm hover:bg-emerald-300 hover:text-emerald-100 cursor-pointer flex items-center justify-center gap-2 py-2 px-4 text-white text-wrap mt-6 "
                name={"submit"}
                value={"send"}
              >
                <BsFillSendArrowUpFill className="text-lg" /> <span>Send</span>
              </button>
            )}
          </div>

          {selectedNotificationId && (
            <NotificationLogs
              selectedNotificationId={selectedNotificationId}
              refresh={refresh}
            />
          )}
        </form>
      )}
    </>
  );
}

export default NotificationForm;
