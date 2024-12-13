import { useSession } from "@/providers/SessionProvider";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import defaultImage from "@/../public/default-company-logo.png";
import { getFile } from "@/lib/files";
import { MdSubdirectoryArrowRight } from "react-icons/md";
import { HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";

function SideBar({ showSidebar }) {
  const { sessionTenant, refresh } = useSession();
  const [menus, setMenus] = useState([]);
  const [previewImage, setPreviewImage] = useState();
  const [loaded, setLoaded] = useState(false);

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
  }, [sessionTenant?.tenantName]);

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
      className={`transition-all duration-300 ease-in-out m-3 fixed overflow-y-scroll top-14 bottom-0 z-50 ${
        showSidebar
          ? "w-80 p-2 lg:relative lg:top-0 lg:z-0"
          : "w-0 p-0 lg:relative lg:top-0 lg:z-0"
      } hidden md:flex md:flex-col md:justify-between gap-2 rounded-lg `}
      style={{ backgroundColor: sessionTenant?.bgColor }}
    >
      {loaded && (
        <div className="flex flex-col overflow-hidden">
          <Link href={"/dashboard"} className="mb-2 mt-2 pb-6">
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
              {/* <div
                className="text-center text-lg hidden lg:block font-extrabold font-sans tracking-widest"
                style={{ color: sessionTenant?.textColor }}
              >
                {sessionTenant?.tenantName}
              </div> */}
            </div>
          </Link>
          <div className="overflow-y-auto">
            <ul className="font-sans pl-3 pr-0 ">
              {Object.keys(groupedMenu).map((category) => (
                <li key={category} className="pb-4 mb-2">
                  <span
                    className="font-bold"
                    style={{ color: sessionTenant?.categoryTextColor }}
                  >
                    {category}
                  </span>
                  <ul>
                    {groupedMenu[category].map((menu) => (
                      <li key={menu.id}>
                        <Link
                          className="font-sans pt-1 pl-1 border-b-[0.2px] pb-1 pr-6 box-border  hover:cursor-pointer flex justify-between items-center transition-all duration-300 ease-in-out text-md"
                          style={{
                            color: sessionTenant?.textColor,
                            borderColor: sessionTenant?.borderColor,
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color =
                              sessionTenant?.textHoverColor)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color =
                              sessionTenant?.textColor)
                          }
                          href={`/dashboard/${menu.id}`}
                        >
                          {category && (
                            <IoMdArrowDropright
                              style={{
                                color: sessionTenant?.categoryTextColor,
                              }}
                              className="mr-1"
                            />
                          )}
                          <span className="w-full h-fit p-1">{menu.name}</span>{" "}
                          {/* <IoMdArrowDropright /> */}
                          <HiOutlineArrowTopRightOnSquare />
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

      <div className="text-[.6rem] flex justify-center px-3">
        <span
          className="w-fit"
          style={{ color: sessionTenant?.categoryTextColor }}
        >
          &copy; 2024 - Untanglebi.com.au
        </span>
      </div>
      {/* <p>{sessionTenant.menus}</p> */}
    </aside>
  );
}

export default SideBar;
