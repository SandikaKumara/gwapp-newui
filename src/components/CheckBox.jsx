"use client";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaArrowRightToBracket } from "react-icons/fa6";

const CheckBox = ({ label, addDelete, onClickEvent }) => {
  return (
    <div className="flex gap-3 font-mono items-center justify-between pr-4 py-1">
      <span className="">{label}</span>
      {addDelete === "delete" && (
        <RiDeleteBin6Fill
          className="text-lg text-red-500 border-2 border-red-500 hover:text-red-50 hover:bg-red-500 transition-colors ease-in duration-100 p-1 w-fit h-fit rounded-full cursor-pointer"
          onClick={onClickEvent}
        />
      )}
      {addDelete === "add" && (
        <FaArrowRightToBracket
          className="text-lg text-blue-500 border-2 border-blue-500  hover:text-blue-50 hover:bg-blue-500 transition-colors ease-in duration-100 p-1 w-fit h-fit rounded-full cursor-pointer"
          onClick={onClickEvent}
        />
      )}
    </div>
  );
};

export default CheckBox;
