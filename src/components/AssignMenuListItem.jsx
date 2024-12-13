import React from "react";

function AssignMenuListItem({ menu }) {
  return (
    <li
      key={menu.id}
      className="p-1 border-b-zinc-200 rounded-md border-b-[1px] hover:border-[1px] hover:border-zinc-800 flex gap-3 justify-between items-center"
    >
      {menu.name}
      <span className="text-[0.7rem] font-semibold bg-orange-200 text-orange-800 pl-2 pr-2 pt-[0.3px] pb-[0.5px] rounded-xl text-center">
        {menu.category}
      </span>
      <span className="text-xs font-semibold bg-purple-200 text-purple-800 pl-2 pr-2 pt-1 pb-1 rounded-full w-6 h-6 text-center">
        {menu.order}
      </span>
    </li>
  );
}

export default AssignMenuListItem;
