import Link from "next/link";
import React from "react";
import { IoMdBackspace } from "react-icons/io";

function BackButton({ url }) {
  return (
    <Link
      className="bg-blue-500 rounded hover:bg-blue-300 cursor-pointer flex items-center justify-between gap-2 py-2 px-4 text-white text-wrap"
      href={url}
    >
      <IoMdBackspace className="text-lg" /> <span>Back</span>
    </Link>
  );
}

export default BackButton;
