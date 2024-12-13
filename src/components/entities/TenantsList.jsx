"use client";

import ProfileImage from "../ProfileImage";
import Switch from "../Switch";
import { BsThreeDotsVertical } from "react-icons/bs";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { enableDisableTenant, getTenantListAction } from "@/dbActions/tenant";
import SearchBox from "../SearchBox";
import { format } from "date-fns";
import Image from "next/image";
import LoadingComponent from "../LoadingComponent";
import { getFile } from "@/lib/files";
import { FaEdit } from "react-icons/fa";

const TenantsList = () => {
  const [searchText, setSearchText] = useState("");
  const [tenantList, setTenantList] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchBoxRef = useRef();

  const handleToggleActive = async (id) => {
    await enableDisableTenant(id);
  };

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        const tenants = await getTenantListAction(searchText);
        // console.log("tenants: ", tenants);

        if (tenants) {
          setTenantList(tenants); // Set the state with the resolved data
        }
      } catch (error) {
        console.error("Failed to fetch tenants:", error);
        // Handle the error appropriately
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, [searchText]);

  const handleSearch = () => {
    setSearchText(searchBoxRef.current.value);
  };

  return (
    <section className="flex flex-col gap-3 flex-wrap ">
      <SearchBox ref={searchBoxRef} handleSearch={handleSearch} />

      {loading && <LoadingComponent />}
      {/* List of tenants */}
      {tenantList.map((tenant) => (
        <div
          key={tenant.id}
          className="flex justify-between gap-1 flex-wrap rounded w-full h-fit bg-white px-4 py-2 shadow-md hover:bg-gray-100"
        >
          <div className="relative w-12 h-12 mr-2">
            {tenant?.logoFile ? (
              <Image
                src={tenant?.logoFile}
                alt={"profile picture"}
                width={150}
                height={150}
                className="rounded-sm p-1 border-2 border-zinc-800 shadow-md"
                style={{ objectFit: "fill" }}
              />
            ) : (
              <ProfileImage name={tenant.name} />
            )}
          </div>
          <div className="flex flex-col gap-1 min-w-[300px]">
            <div className="font-semibold">{tenant.name}</div>
            <div className="text-xs">{tenant.address}</div>
            <div className="text-xs">{tenant.contact}</div>
          </div>

          {/* <div className="flex flex-col justify-center gap-1 items-start min-w-[300px] text-xs">
            <div
              className="py-1 px-3 rounded-sm border-2 text-sm font-bold"
              style={{
                backgroundColor: tenant.bgColor,
                color: tenant.textColor,
                borderColor: tenant.borderColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color =
                  tenant.hoverTextColor || tenant.textColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = tenant.textColor;
              }}
            >
              Main text
            </div>
            <div
              className="py-1 px-3 rounded-sm border-2 text-sm font-bold"
              style={{
                backgroundColor: tenant.bgColor,
                color: tenant.categoryTextColor,
                borderColor: tenant.borderColor,
              }}
            >
              Category
            </div>
          </div> */}

          <div className="flex flex-col justify-center gap-1 items-start min-w-[300px] text-xs">
            <div className="flex gap-2 justify-center items-center">
              Active{" "}
              <Switch
                currentStatus={tenant.isActive}
                action={() => handleToggleActive(tenant.id)}
              />
            </div>
          </div>

          <div className="flex flex-col justify-center items-start min-w-[300px] text-xs">
            {format(new Date(tenant.createdAt), "yyyy/MM/dd, HH:mm:ss")}
          </div>

          <div
            className="font-bold flex flex-col justify-start items-end cursor-pointer"
            // onClick={() => {
            //   handleEditTenant(tenant.id);
            // }}
          >
            <Link href={`/dashboard/tenant/${tenant.id}`}>
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

export default TenantsList;
