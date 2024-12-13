import Link from "next/link";
import React from "react";

function AdminCard({ item }) {
  return (
    <Link
      href={item.url}
      className="rounded bg-white shadow-md p-12 w-full md:w-[350px] flex flex-col justify-center items-center gap-2 hover:opacity-75"
    >
      <div className="text-3xl text-blue-800">{item.icon}</div>
      <div className="font-bold text-gray-600 text-center">{item.title}</div>
      <div className="text-gray-500 text-center">{item.description}</div>
    </Link>
  );
}

export default AdminCard;
