"use client";
import { useSession } from "@/providers/SessionProvider";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import defaultImage from "@/../public/default-company-logo.png";
import { getFile } from "@/lib/files";
import { MdSubdirectoryArrowRight } from "react-icons/md";
import { HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RiDashboardHorizontalLine } from "react-icons/ri";
import { HiOutlineChartPie } from "react-icons/hi";
import { TfiArrowCircleRight } from "react-icons/tfi";
import { RiArrowRightFill } from "react-icons/ri";

function SideBar({ showSidebar, handleShowSidebar }) {
  const { sessionTenant, refresh } = useSession();
  const [menus, setMenus] = useState([]);
  const [previewImage, setPreviewImage] = useState();
  const [loaded, setLoaded] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("");
  const [fullUrl, setFullUrl] = useState("");
  const pathname = usePathname(); // Gets the current pathname (e.g., '/dashboard')
  const [hideMenu, setHideMenu] = useState(false);

  useEffect(() => {
    const submenu = pathname.split("/")[2];
    const notAllowed = [
      "admin",
      "user",
      "tenant",
      "userRole",
      "menu",
      "notification",
      "loginAudit",
    ];
    setHideMenu(!notAllowed.includes(submenu));
  }, [pathname]);

  useEffect(() => {
    setLoaded(false);

    const pageRefresh = async () => {
      if (sessionTenant) {
        setMenus(sessionTenant.menus);

        if (sessionTenant?.logoPath) {
          const image = await getFile(sessionTenant?.logoPath);
          setPreviewImage(image?.image || defaultImage);
        }
        // setPreviewImage(sessionTenant?.logoPath || defaultImage);
      }
    };
    setLoaded(true);
    pageRefresh();
  }, [sessionTenant]);

  const groupedMenu = menus.reduce((acc, menu) => {
    const { category, id, name, url, order } = menu;

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push({ id, name, order, url });

    return acc;
  }, {});

  return (
    <aside
      className={`transition-all duration-500 ease-in top-14 bottom-0 ${
        showSidebar ? "w-80 p-2 lg:top-0" : "w-10 p-0 lg:top-0"
      } hidden md:flex md:flex-col md:justify-between gap-2 relative overflow-visible z-20 shadow-md`}
    >
      <RiArrowRightFill
        className={`absolute top-4 -right-1 translate-x-1/2 bg-gray-600 hover:bg-blue-500 text-white rounded-md w-8 h-8 p-1 flex justify-center items-center duration-200 transition-all z-30 ${
          showSidebar && "rotate-180"
        }`}
        onClick={handleShowSidebar}
      />
      {loaded && hideMenu && (
        <div className="flex flex-col relative">
          {/* <Link href={"/dashboard"} className="mb-2 mt-2 pb-6">
            <div className="flex flex-col flex-shrink justify-center items-center gap-2 w-full h-full p-3">
              <div className="w-full flex justify-center items-center">
                {previewImage && (
                  <Image
                    alt="Company Logo"
                    src={previewImage}
                    width={200}
                    height={200}
                    style={{ objectFit: "cover" }}
                    className="flex-shrink bg-transparent p-1"
                    // priority
                  />
                )}
              </div>
              <div
                className="text-center text-lg hidden lg:block font-extrabold font-sans tracking-widest"
                style={{ color: sessionTenant?.textColor }}
              >
                {sessionTenant?.tenantName}
              </div>
            </div>
          </Link> */}
          <div
            className={`overflow-visible ${!showSidebar && "overflow-hidden"} `}
          >
            <ul className="p-1 ">
              {Object.keys(groupedMenu).map((category) => (
                <li key={category} className={`pb-4 mb-2`}>
                  <div
                    className={`font-bold  uppercase  ${
                      !showSidebar &&
                      "border-r-4 border-blue-500 inline-block w-10 h-10"
                    }`}
                    // style={{ color: sessionTenant?.categoryTextColor }}
                  >
                    {showSidebar && category}
                  </div>

                  <ul>
                    {groupedMenu[category].map((menu) => (
                      <li key={menu.id}>
                        <Link
                          className={` group pt-1 pl-1 border-b-[0.2px] pb-1 ${
                            showSidebar && "pr-6"
                          } box-border  hover:cursor-pointer flex justify-between items-center transition-all duration-500 ease-in-out text-md hover:bg-indigo-100 text-indigo-950 relative ${
                            pathname.split("/")[2] == menu.id &&
                            "bg-indigo-200 border-l-4 border-l-indigo-500"
                          }`}
                          // onMouseEnter={() => {
                          //   !showSidebar && handleShowSidebar();
                          // }}
                          // onMouseLeave={(e) =>
                          //   (e.currentTarget.style.color =
                          //     sessionTenant?.textColor)
                          // }
                          // style={{
                          //   color: sessionTenant?.textColor,
                          //   borderColor: sessionTenant?.borderColor,
                          // }}
                          // onMouseEnter={(e) =>
                          //   (e.currentTarget.style.color =
                          //     sessionTenant?.textHoverColor)
                          // }
                          // onMouseLeave={(e) =>
                          //   (e.currentTarget.style.color =
                          //     sessionTenant?.textColor)
                          // }
                          href={`/dashboard/${menu.id}`}
                        >
                          {category ? (
                            <IoMdArrowDropright
                              // style={{
                              //   color: sessionTenant?.categoryTextColor,
                              // }}
                              className="mr-2"
                            />
                          ) : (
                            <HiOutlineChartPie className="mr-2" />
                          )}

                          <div
                            className={`w-full h-fit p-1 text-nowrap transform transition-transform duration-300 ease-out text-indigo-950 ${
                              showSidebar ? "scale-100" : "scale-0 hidden"
                            } overflow-hidden`}
                          >
                            {menu.name}
                          </div>

                          {!showSidebar && (
                            <div className="absolute top-0 left-0 text-nowrap translate-x-10 z-40 w-fit bg-gray-600 text-white py-1 px-5 rounded-sm shadow-md scale-x-0 origin-top-left group-hover:scale-x-100 transition-all duration-300 ease-in-out">
                              {menu.name}
                            </div>
                          )}

                          {/* <IoMdArrowDropright /> */}
                          {/* <HiOutlineArrowTopRightOnSquare /> */}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div
        className={`text-[.6rem] flex justify-center px-3 origin-top-left duration-500 ease-out transition-all transform text-gray-500 ${
          !showSidebar ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <span
          className="w-fit text-xs italic"
          // style={{ color: sessionTenant?.categoryTextColor }}
        >
          &copy; UntangleBI - 2024
        </span>
      </div>
      {/* <p>{sessionTenant.menus}</p> */}
    </aside>
  );
}

export default SideBar;
