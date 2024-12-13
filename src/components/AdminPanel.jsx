import React from "react";
import {
  FaUser,
  FaBuilding,
  FaUsersCog,
  FaAlignLeft,
  FaKey,
} from "react-icons/fa";
import AdminCard from "./AdminCard";
import { GrAnnounce } from "react-icons/gr";
import { AiOutlineAudit } from "react-icons/ai";
import { FaRegBell } from "react-icons/fa";

function AdminPanel() {
  const adminItems = [
    {
      title: "User Management",
      icon: <FaUser />,
      description: "Use this function to register users and managing users.",
      url: "/dashboard/user",
    },
    {
      title: "Tenant Management",
      icon: <FaBuilding />,
      description: "Use this function to register tenant and managing tenants.",
      url: "/dashboard/tenant",
    },
    {
      title: "User Role Management",
      icon: <FaUsersCog />,
      description:
        "Use this function to create user role and assign users to user role",
      url: "/dashboard/userRole",
    },
    {
      title: "Menu Management",
      icon: <FaAlignLeft />,
      description: "Use this function to create menu items and managing menus.",
      url: "/dashboard/menu",
    },
    {
      title: "Notification Management",
      icon: <FaRegBell />,
      description: "Use this function to send messages to the users.",
      url: "/dashboard/notification",
    },
    {
      title: "Login Audit",
      icon: <AiOutlineAudit />,
      description:
        "This function to review the login audit to the application.",
      url: "/dashboard/loginAudit",
    },
  ];

  return (
    <div className="flex flex-row flex-wrap gap-4 justify-center">
      {adminItems.map((item, index) => (
        <AdminCard item={item} key={index} />
      ))}
    </div>
  );
}

export default AdminPanel;
