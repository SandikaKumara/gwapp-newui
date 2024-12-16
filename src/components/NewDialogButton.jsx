"use client";

import Link from "next/link";
import { IoMdAddCircle } from "react-icons/io";

const NewDialogButton = ({ url }) => {
  return (
    <Link
      className="bg-emerald-500 rounded hover:bg-emerald-300 cursor-pointer flex items-center justify-between gap-2 py-2 px-4 text-emerald-50 text-wrap"
      href={url}
    >
      <IoMdAddCircle className="text-lg" /> <span>New</span>
    </Link>
  );
};

export default NewDialogButton;
