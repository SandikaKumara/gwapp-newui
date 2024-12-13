"use client";

import {
  deactivate2faUser,
  enableDisableAdminUser,
  enableDisableUser,
  getUserListAction,
  lockUnlockUser,
  toggle2faUser,
} from "@/dbActions/userActions";
import { useEffect, useRef, useState } from "react";
import SearchBox from "../SearchBox";
import ProfileImage from "../ProfileImage";
import Switch from "../Switch";
import { format } from "date-fns";
import Link from "next/link";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaUnlockAlt } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";
import { TbAuth2Fa } from "react-icons/tb";
import Image from "next/image";
import LoadingComponent from "../LoadingComponent";
import { FaEdit } from "react-icons/fa";

const UsersList = () => {
  const [searchText, setSearchText] = useState("");
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const searchBoxRef = useRef();

  const handleToggleActive = async (id) => {
    await enableDisableUser(id);
  };

  const handleToggleAdmin = async (id) => {
    await enableDisableAdminUser(id);
  };

  const handleToggleLock = async (id) => {
    await lockUnlockUser(id);
  };

  const handleDeactivate2faUser = async (id) => {
    setRefresh(!refresh);
    await deactivate2faUser(id);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const users = await getUserListAction(searchText);
        // console.log("users", users);

        setUserList(users);
      } catch (error) {
        console.error("Failed to fetch users : ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchText, refresh]);

  const handleSearch = () => {
    setSearchText(searchBoxRef.current.value);
  };

  return (
    <section className="flex flex-col gap-3 flex-wrap">
      <SearchBox ref={searchBoxRef} handleSearch={handleSearch} />

      {loading && <LoadingComponent />}
      {/* List of users */}
      {userList.map((user) => (
        <div
          key={user.id}
          className="flex justify-between gap-1 flex-wrap rounded w-full h-fit bg-white px-4 py-2 shadow-md hover:bg-gray-100"
        >
          <div className="relative w-12 h-12">
            {user?.logoFile ? (
              <Image
                src={user?.logoFile}
                alt={"profile picture"}
                className="rounded-full p-1 border-2 border-zinc-800 shadow-md object-cover"
                // layout="fill"
                fill
              />
            ) : (
              <ProfileImage name={user.firstName} />
            )}
          </div>
          <div className="flex flex-col gap-1 min-w-[300px]">
            <div className="font-semibold">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-xs">{user.email}</div>
            {/* <div className="text-xs">{user.address}</div> */}
          </div>

          {/* <div className="flex flex-col justify-center gap-1 items-start min-w-[300px] text-xs">
            <div className="text-xs">{user.email}</div>
            <div className="text-xs">{user.contact}</div>
          </div> */}

          <div className="flex justify-between gap-1 items-center min-w-[300px] text-xs">
            <div className="flex gap-2 justify-between items-center text-lg text-gray-600">
              <FaCheckCircle title="Activate / Deactivate" />
              <Switch
                currentStatus={user.isActive}
                action={() => handleToggleActive(user.id)}
              />
            </div>
            <div className="flex gap-2 justify-between items-center text-lg text-gray-600">
              <RiAdminFill title="Is Global Administrator" />
              <Switch
                currentStatus={user.isAdmin}
                action={() => handleToggleAdmin(user.id)}
              />
            </div>
            <div className="flex gap-2 justify-between items-center text-lg text-gray-600">
              <FaUnlockAlt title="Lock / Unlock" />
              <Switch
                currentStatus={user.isLocked}
                action={() => handleToggleLock(user.id)}
              />
            </div>
            <div className="flex gap-2 justify-between items-center text-lg text-gray-600">
              <TbAuth2Fa
                title="2FA Authentication"
                className={`font-black ${
                  user.isAuthenticatorEnabled
                    ? "text-green-600"
                    : "text-slate-600"
                } `}
              />
              {user?.isAuthenticatorEnabled && (
                <Switch
                  currentStatus={user?.isAuthenticatorEnabled}
                  action={() => handleDeactivate2faUser(user.id)}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between items-start min-w-[300px] text-xs">
            <div className="font-semibold">{user.tenant?.name}</div>
            <div>
              {format(new Date(user.createdAt), "yyyy/MM/dd, HH:mm:ss")}
            </div>
          </div>

          <div
            className="font-bold flex flex-col justify-start items-end cursor-pointer"
            // onClick={() => {
            //   handleEdituser(user.id);
            // }}
          >
            <Link href={`/dashboard/user/${user.id}`}>
              <FaEdit
                className="text-gray-500 hover:text-gray-900"
                title="Edit"
              />
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
};

export default UsersList;
