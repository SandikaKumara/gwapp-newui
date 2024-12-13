"use client";

import Link from "next/link";
import { IoMdAddCircle } from "react-icons/io";

const NewDialogButton = ({ url }) => {
  return (
    <Link
      className="bg-green-500 rounded hover:bg-green-300 cursor-pointer flex items-center justify-between gap-2 py-2 px-4 text-white text-wrap"
      href={url}
    >
      <IoMdAddCircle className="text-lg" /> <span>New</span>
    </Link>
  );
};

export default NewDialogButton;
