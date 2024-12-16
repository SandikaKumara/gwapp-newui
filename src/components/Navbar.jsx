import React, { useEffect, useRef, useState } from "react";
import { TiArrowSortedDown } from "react-icons/ti";
import { HiMiniBars3 } from "react-icons/hi2";
import { CgProfile } from "react-icons/cg";
import { RiLogoutCircleLine } from "react-icons/ri";
import ProfileImage from "./ProfileImage";
import Notification from "./Notification";
import { logOut, updateSessionTenant } from "@/lib/sessionActions";
import { useMessageBox } from "@/providers/MessageProvider";
import { useRouter } from "next/navigation";
import { TbSwitch3 } from "react-icons/tb";
import { getUserTenantListAction } from "@/dbActions/userTenant";
import { useSession } from "@/providers/SessionProvider";
import { getUserAction } from "@/dbActions/userActions";
import Link from "next/link";
import Image from "next/image";
import DefaultProfileImage from "@/../../public/profile-image-placeholder.png";
import { getFile } from "@/lib/files";
import { BiSupport } from "react-icons/bi";
import { RiNotification3Line } from "react-icons/ri";
import { AiOutlineNotification } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { FaUserCog } from "react-icons/fa";
import ubilogo from "@/../public/logo-untanglebi-white.png";
import { FaHeadset } from "react-icons/fa";
import { LiaUserCogSolid } from "react-icons/lia";
import { PiUserCircleFill } from "react-icons/pi";
import { BsBuilding } from "react-icons/bs";
import { BsEnvelopeAt } from "react-icons/bs";
import { BsPerson } from "react-icons/bs";
import Modal from "./Modal";

function Navbar({ handleShowSidebar, showSidebar }) {
  const [showTenantSelection, setShowTenantSelection] = useState(false);
  const [showTenantSelectionOptions, setShowTenantSelectionOptions] =
    useState(false);
  const [userTenants, setUserTenants] = useState([]);
  const [message, setMessage] = useState();
  const [previewImage, setPreviewImage] = useState();
  const [noticeCount, setNoticeCount] = useState(1);
  const [loaded, setLoaded] = useState(false);

  const showMessage = useMessageBox();

  const { sessionTenant, setRefresh } = useSession();
  const router = useRouter();

  const dialogRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openDialog = () => {
    dialogRef.current.showModal();
    document.body.style.overflow = "hidden"; // Disable scrolling
  };

  const closeDialog = () => {
    dialogRef.current.close();
    document.body.style.overflow = ""; // Re-enable scrolling
  };

  const handleLogOut = async () => {
    const result = await logOut();
    if (result) {
      showMessage(result.type, result.message);
      setMessage(result);
      if (result.redirectUrl) {
        router.push(result.redirectUrl);
      }
    }
  };

  useEffect(() => {
    const fetchUserTenants = async () => {
      let tenantList = [];
      const list = await getUserTenantListAction(sessionTenant?.userId);
      if (list) {
        list.map(
          (item) =>
            item.tenant.isActive &&
            tenantList.push({ id: item.tenant.id, name: item.tenant.name })
        );
      }

      const user = await getUserAction(sessionTenant?.email);
      if (user && user.tenantId) {
        tenantList.push({ id: user.tenant.id, name: user.tenant.name });
      }

      if (user) {
        const image = await getFile(user?.logoPath);
        setPreviewImage(image?.image);
      }
      const uniqueTenants = Array.from(
        new Map(tenantList.map((item) => [item.id, item])).values()
      );
      setUserTenants(uniqueTenants);
    };

    fetchUserTenants();
    setLoaded(true);
  }, [sessionTenant]);

  // useEffect(() => {
  //   if (userTenants.length > 1) {
  //     setShowTenantSelection(true);
  //   }
  // }, [userTenants]);

  const handleOnTenantChange = async (e) => {
    closeModal();
    const result = await updateSessionTenant(e);
    if (result) {
      showMessage(result.type, result.message);
    }
    if (result.type === "success") {
      setRefresh(true);
    }
    router.push("/dashboard");
  };

  return (
    <nav className="flex justify-between px-10 z-50 sticky top-0 bg-gradient-to-r from-indigo-800 from-10% via-blue-700 via-35% to-indigo-800 to-90%">
      <Link className="hidden md:flex gap-4 items-center" href={"/dashboard"}>
        <Image src={ubilogo} width={160} alt={"Logo"} />
        {/* 
        <div
          className="relative  w-[40px] h-[40px] flex items-center justify-center border hover:border-zinc-400 cursor-pointer p-2 flex-col gap-[0.15rem]"
          onClick={handleShowSidebar}
        >
          {!showSidebar ? (
            <HiMiniBars3 className="absolute text-lg" />
          ) : (
            <IoMdClose className="absolute text-lg" />
          )}
        </div> */}

        {/* {loaded && (
          <div className="text-gray-500 font-medium italic text-sm font-sans uppercase hidden lg:block">
            {sessionTenant?.firstName}, Welcome to {sessionTenant?.tenantName}{" "}
            insights
          </div>
        )} */}
      </Link>

      <div className="flex flex-col-reverse md:flex-row md:items-center items-end justify-between gap-3 w-full md:w-fit ">
        {/* {userTenants.length > 1 && (
          <div className="flex w-fit gap-2">
            <p className="flex items-center gap-3 text-gray-500 font-medium italic text-sm font-sans mr-1">
              <span>Switch Tenant</span>
              <TbSwitch3 className="text-lg" />
            </p>

            <select
              className="text-sm text-gray-700 outline-none px-3 py-1 font-sans font-bold bg-transparent
              border-b-[1px] border-gray-300 w-fit pl-8 pr-8"
              onChange={handleOnTenantChange}
            >
              <option value="0" className="bg-gray-50"></option>
              {userTenants.map((item) => (
                <option key={item.id} value={item.id} className="bg-gray-50">
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        )} */}

        <div className="flex gap-1 w-full md:w-fit justify-between">
          {sessionTenant?.isAdmin && (
            <Link
              className=" flex justify-center items-center hover:bg-white hover:bg-opacity-5 px-5"
              title="Admin Panel"
              href={"/dashboard/admin"}
            >
              <LiaUserCogSolid className="text-2xl text-white" />
            </Link>
          )}

          <Link
            href={"/dashboard/ticket"}
            className="flex justify-center items-center hover:bg-white hover:bg-opacity-5 px-5"
            title="Support Ticket"
          >
            <FaHeadset className="text-xl text-white" />
          </Link>

          {/* <Announcement /> */}
          {loaded && (
            <Notification
              isAdmin={sessionTenant?.isAdmin}
              userId={sessionTenant?.userId}
            />
          )}

          {/* <Link
          href={`/dashboard/notification`}
          className="w-[40px] h-[40px] flex justify-center items-center relative"
          title="Notifications"
        >
          <AiOutlineNotification className="text-2xl text-slate-600" />

          {noticeCount > 0 && (
            <div className="absolute -bottom-2 -left-1 bg-rose-600 w-6 h-6 rounded-full p-1 flex justify-center items-center">
              <span className="text-xs text-pink-50">{noticeCount}</span>
            </div>
          )}
        </Link> */}

          {loaded && (
            <div className="relative group inline-block cursor-pointer">
              <div className="flex gap-3 justify-center items-center hover:bg-white hover:bg-opacity-5 px-5 py-2">
                <div className="w-[45px] h-[45px] flex justify-center items-center">
                  {previewImage ? (
                    <Image
                      src={previewImage || DefaultProfileImage}
                      className="rounded-full border-2 border-white bg-white pointer-events-none"
                      // layout="fill"
                      // fill
                      width={40}
                      height={40}
                      // style={{ objectFit: "cover" }}
                      // priority
                      unoptimized
                      alt="profile picture"
                    />
                  ) : (
                    // <ProfileImage
                    //   name={sessionTenant?.firstName}
                    //   className="rounded-full p-1 border-2 border-zinc-900 pointer-events-none"
                    // />
                    <div className="flex justify-center items-center ">
                      <PiUserCircleFill className="text-3xl text-white " />
                    </div>
                  )}
                </div>

                <div className="text-white font-sans">
                  {sessionTenant?.firstName}
                </div>
                <TiArrowSortedDown className="text-white pointer-events-none" />
              </div>

              <ul
                className="flex flex-col justify-center items-start w-fit h-fit p-4 pr-4 pl-4 absolute bottom-0 right-0 translate-y-full  font-medium text-nowrap rounded-sm scale-0  opacity-0 group-hover:opacity-100 group-hover:scale-100 transform-origin transition-all duration-500 pointer-events-auto z-[30] bg-white origin-top border-2 border-indigo-100 shadow-lg"
                // style={{
                //   backgroundColor: sessionTenant?.bgColor,
                //   color: sessionTenant?.textColor,
                // }}
              >
                <li
                  className="rounded-sm p-3 pr-6 gap-2 w-full border-b-[0.5px] flex flex-col items-start cursor-default "
                  // style={{
                  //   color: sessionTenant?.textHoverColor,
                  //   backgroundColor: sessionTenant?.bgColor,
                  // }}
                >
                  <p className="flex gap-2 items-center ">
                    <BsPerson />
                    {sessionTenant?.firstName} {sessionTenant?.lastName}
                  </p>
                  <p className="flex gap-2 items-center ">
                    <BsEnvelopeAt />
                    {sessionTenant?.email}
                  </p>
                  <p className="flex items-center justify-between gap-2  my-2">
                    <span className="flex gap-2 items-center">
                      <BsBuilding />
                      <span className="mr-5 text-gray-500">
                        {sessionTenant?.tenantName}
                      </span>
                    </span>
                    {userTenants.length > 1 && (
                      // <button
                      //   onClick={() =>
                      //     setShowTenantSelection(!showTenantSelection)
                      //   }
                      // >
                      <button onClick={openModal}>
                        <TbSwitch3 className="text-lg text-blue-600 hover:text-blue-300" />
                      </button>
                    )}
                  </p>
                </li>

                <hr />

                {userTenants.length > 1 && showTenantSelection && (
                  <div className="flex w-fit gap-2">
                    <select
                      className="text-sm text-gray-700 outline-none px-3 py-1 font-sans font-bold bg-transparent
              border-b-[1px] border-gray-300 w-fit pl-8 pr-8"
                      onChange={handleOnTenantChange}
                    >
                      <option value="0" className="bg-gray-50"></option>
                      {userTenants.map((item) => (
                        <option
                          key={item.id}
                          value={item.id}
                          className="bg-gray-50"
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <li
                  className="rounded-sm flex gap-2 items-center w-full border-b-[0.5px] "
                  // style={{
                  //   color: sessionTenant?.textColor,
                  //   borderColor: sessionTenant?.borderColor,
                  // }}
                  // onMouseEnter={(e) =>
                  //   (e.currentTarget.style.color =
                  //     sessionTenant?.textHoverColor)
                  // }
                  // onMouseLeave={(e) =>
                  //   (e.currentTarget.style.color = sessionTenant?.textColor)
                  // }
                >
                  <Link
                    className="flex gap-2 p-3 pr-6 items-center w-full  hover:bg-indigo-100 text-indigo-950 duration-500"
                    href={`/dashboard/profile/${sessionTenant?.userId}`}
                  >
                    <span>
                      <CgProfile />
                    </span>{" "}
                    Profile
                  </Link>
                </li>

                <li
                  className="rounded-sm p-3 pr-6 flex gap-2 items-center w-full  hover:bg-indigo-100  text-rose-800 duration-500"
                  // style={{ color: sessionTenant?.textColor }}
                  // onMouseEnter={(e) =>
                  //   (e.currentTarget.style.color =
                  //     sessionTenant?.textHoverColor)
                  // }
                  // onMouseLeave={(e) =>
                  //   (e.currentTarget.style.color = sessionTenant?.textColor)
                  // }
                  onClick={handleLogOut}
                >
                  <span>
                    <RiLogoutCircleLine />
                  </span>{" "}
                  Log Out
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={"Select Tenant"}>
        {/* <div className="flex w-fit gap-2">
          <select
            className="text-sm text-gray-700 outline-none px-3 py-1 font-sans font-bold bg-transparent
              border-b-[1px] border-gray-300 w-fit pl-8 pr-8"
            onChange={handleOnTenantChange}
          >
            <option value="0" className="bg-gray-50"></option>
            {userTenants.map((item) => (
              <option key={item.id} value={item.id} className="bg-gray-50">
                {item.name}
              </option>
            ))}
          </select>
        </div> */}

        <div className="w-full p-2 ">
          {userTenants.map((item) => (
            <div
              key={item.id}
              className="w-full hover:bg-gray-200 text-indigo-950 p-2 border-b border-gray-400 rounded-sm cursor-pointer text-center"
              onClick={() => {
                handleOnTenantChange(item.id);
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      </Modal>
    </nav>
  );
}

export default Navbar;
