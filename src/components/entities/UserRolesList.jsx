"use client";

import {
  enableDisableUserRole,
  getUserRoleListAction,
} from "@/dbActions/userRole";
import { Suspense, useEffect, useRef, useState } from "react";
import SearchBox from "../SearchBox";
import Switch from "../Switch";
import { format } from "date-fns";
import Link from "next/link";
import { BsThreeDotsVertical } from "react-icons/bs";
import LoadingComponent from "../LoadingComponent";
import { FaEdit } from "react-icons/fa";

const UserRolesList = () => {
  const [searchText, setSearchText] = useState("");
  const [userRoleList, setUserRoleList] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchBoxRef = useRef();

  const handleToggleActive = async (id) => {
    await enableDisableUserRole(id);
  };

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        setLoading(true);
        const userRoles = await getUserRoleListAction(searchText);
        setUserRoleList(userRoles); // Set the state with the resolved data
      } catch (error) {
        console.error("Failed to fetch User Roles:", error);
        // Handle the error appropriately
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoles();
  }, [searchText]);

  const handleSearch = () => {
    setSearchText(searchBoxRef.current.value);
  };

  return (
    <section className="flex flex-col gap-3 flex-wrap ">
      <SearchBox ref={searchBoxRef} handleSearch={handleSearch} />
      {loading && <LoadingComponent />}

      <Suspense fallback={<LoadingComponent />}>
        {/* List of userRoles */}
        {userRoleList.map((userRole) => (
          <div
            key={userRole.id}
            className="flex justify-between gap-1 flex-wrap rounded w-full h-fit bg-white px-4 py-2 shadow-md hover:bg-gray-100"
          >
            <div className="flex flex-col gap-1 min-w-[300px]">
              <div className="font-semibold">{userRole.name}</div>
            </div>

            <div className="flex flex-col justify-center gap-1 items-start min-w-[300px] text-xs">
              <div className="text-xs">{userRole.tenant?.name}</div>
            </div>

            <div className="flex flex-col justify-center gap-1 items-start min-w-[300px] text-xs">
              <div className="flex gap-2 justify-center items-center">
                Active{" "}
                <Switch
                  currentStatus={userRole.isActive}
                  action={() => handleToggleActive(userRole.id)}
                />
              </div>
            </div>

            <div className="flex flex-col justify-center items-start min-w-[300px] text-xs">
              {format(new Date(userRole.createdAt), "yyyy/MM/dd, HH:mm:ss")}
            </div>

            <div
              className="font-bold flex flex-col justify-start items-end cursor-pointer"
              // onClick={() => {
              //   handleEdituserRole(userRole.id);
              // }}
            >
              <Link href={`/dashboard/userRole/${userRole.id}`}>
                <FaEdit
                  className="text-gray-500 hover:text-gray-900"
                  title="Edit"
                />
              </Link>
            </div>
          </div>
        ))}
      </Suspense>
    </section>
  );
};

export default UserRolesList;
