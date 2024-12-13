"use client";

import { enableDisableMenu, getMenuListAction } from "@/dbActions/menu";
import { useEffect, useRef, useState } from "react";
import SearchBox from "../SearchBox";
import { BsThreeDotsVertical } from "react-icons/bs";
import Link from "next/link";
import { format } from "date-fns";
import Switch from "../Switch";
import { FaCheckCircle } from "react-icons/fa";
import { GoSortAsc } from "react-icons/go";
import LoadingComponent from "../LoadingComponent";
import OptionBox from "../OptionBox";
import { getTenantListAction } from "@/dbActions/tenant";
import { MdCheckCircleOutline } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const MenuList = ({ tenantId }) => {
  const [searchText, setSearchText] = useState("");
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState();
  const [initTenants, setInitTenants] = useState(false);

  const searchBoxRef = useRef();

  const handleToggleActive = async (id) => {
    await enableDisableMenu(id);
  };

  useEffect(() => {
    const getTenants = async () => {
      try {
        setLoading(true);
        const tenants = await getTenantListAction("", true);
        setTenants(tenants);
        setInitTenants(true);

        // Set default tenant from prop if not already set
        if (tenantId && !selectedTenant) {
          setSelectedTenant(tenantId);
        } else if (tenants.length > 0 && !selectedTenant) {
          setSelectedTenant(tenants[0].id); // Default to the first tenant if none is selected
        }
      } catch (err) {
        console.error("Failed to fetch tenants : ", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchMenus = async (tenantId) => {
      try {
        setLoading(true);
        const menus = await getMenuListAction(searchText, null, tenantId);
        setMenuList(menus);
      } catch (err) {
        console.error("Failed to fetch menus : ", err);
      } finally {
        setLoading(false);
      }
    };

    !initTenants && getTenants();
    // tenantId && setSelectedTenant(tenantId);
    selectedTenant && fetchMenus(selectedTenant);
  }, [searchText, selectedTenant, tenantId, initTenants]);

  const handleSearch = () => {
    setSearchText(searchBoxRef.current.value);
  };

  const handleOnTenantChange = (e) => {
    setSelectedTenant(e);
  };

  return (
    <section className="flex flex-col gap-3 flex-wrap">
      <OptionBox
        label={"Tenant"}
        name={"tenant"}
        required
        values={tenants}
        onChange={handleOnTenantChange}
        selectedId={selectedTenant || 0}
        // isDisabled={isDisabled}
      />

      <SearchBox ref={searchBoxRef} handleSearch={handleSearch} />

      {loading && <LoadingComponent />}
      {/* List of users */}
      {menuList.map((menu) => (
        <div
          key={menu.id}
          className="flex justify-between gap-1 flex-wrap rounded w-full h-fit bg-white px-4 py-2 shadow-md hover:bg-gray-100"
        >
          <div className="relative w-[350px] h-fit">
            <div className="font-semibold flex items-center justify-between">
              <span className="text-[0.8rem]">{menu.name}</span>
              {menu.category && (
                <span className="font-semibold bg-orange-100 border-2 border-orange-600 w-fit px-4 py-[0.15rem] rounded-sm text-xs text-orange-800">
                  {menu.category}
                </span>
              )}
            </div>
            <div className="text-xs flex justify-start items-center gap-3 border-2 border-green-800 w-fit py-[0.15rem] px-2 rounded-full">
              <GoSortAsc className="text-lg" />
              <span className="font-bold text-xs bg-green-700 text-green-100 py-[0.15rem] px-2 rounded-full">
                {menu.order}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-2 items-start min-w-[300px] text-xs">
            <div className="flex gap-2 justify-between items-center text-lg text-gray-600">
              <FaCheckCircle title="Activate / Deactivate" />
              <Switch
                currentStatus={menu.isActive}
                action={() => handleToggleActive(menu.id)}
              />
            </div>

            <div
              className="text-xs font-bold break-all flex gap-2 items-center"
              title={menu.url}
            >
              Embedded Url{" "}
              <span className="text-lg">
                {menu.url ? (
                  <MdCheckCircleOutline className="text-green-600" />
                ) : (
                  <MdOutlineCancel className="text-red-600" />
                )}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between items-start min-w-[300px] text-xs">
            <div className="font-semibold">{menu.tenant?.name}</div>
            <div>
              {format(new Date(menu.createdAt), "yyyy/MM/dd, HH:mm:ss")}
            </div>
          </div>

          <div className="flex justify-start gap-1 w-[300px] text-xs items-start">
            {menu?.UserRoleMenu &&
              menu?.UserRoleMenu.map((row) => (
                <div
                  key={row?.userRole.name}
                  className="bg-indigo-400 text-indigo-50 py-1 px-3 rounded-sm"
                >
                  {row?.userRole.name}
                </div>
              ))}
          </div>

          <div
            className="font-bold flex flex-col justify-start items-end cursor-pointer"
            // onClick={() => {
            //   handleEditmenu(menu.id);
            // }}
          >
            <Link href={`/dashboard/menu/${menu.id}?tenant=${selectedTenant}`}>
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

export default MenuList;
