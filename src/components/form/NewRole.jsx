import React, { useEffect, useState } from "react";
import Switch from "../Switch";

function NewRole({ selectedRole, roleDialogRef, closeModal }) {
  const tenants = [
    {
      id: 1,
      name: "ABC Company",
    },
    {
      id: 2,
      name: "XYZ Company",
    },
  ];

  const [active, setActive] = useState(true);


  useEffect(() => {
    if (selectedRole) {
      setActive(selectedRole.isActive);

    }
  }, [selectedRole]);

  return (
    <dialog
      ref={roleDialogRef}
      className="backdrop:bg-zinc-950/85 rounded-md border-2 border-zinc-900"
    >
      <div className="w-fit h-fit p-10 ">
        <div className="flex justify-end">
          <div
            className="w-fit h-fit text-zinc-400 hover:text-red-600 cursor-pointer absolute top-5 text-lg font-bold
            "
            onClick={closeModal}
          >
            <span className="sr-only">Close</span>X
          </div>
        </div>

        <form className="flex flex-col gap-3 p-4">
          <div className="flex flex-col">
            <label className="text-sm mb-1 text-zinc-600" htmlFor="name">
              Name :{" "}
            </label>
            <input
              className="border-2 border-zinc-500 rounded-md outline-none w-[300px] p-1 pl-4 font-mono text-zinc-900 text-sm focus:border-red-500"
              type="text"
              name="name"
              value={selectedRole ? selectedRole.name : ""}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1 text-zinc-600" htmlFor="tenant">
              Tenant :{" "}
            </label>

            <select name="tenant" className="border-2 border-zinc-500 rounded-md outline-none w-[300px] p-1 pl-4 font-mono text-zinc-900 text-sm focus:border-red-500" value={selectedRole ? selectedRole.id : 0}>
                <option value="0"></option>
                {tenants.map(tenant=>(
                   <option key={tenant.id} value={tenant.id}>{tenant.name}</option> 
                ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1 text-zinc-600" htmlFor="isactive">
              Is Active :{" "}
            </label>
            <Switch
              status={active}
              onChange={() => {
                setActive(!active);
              }}
            />
          </div>

          <div className="flex flex-col justify-center w-full p-3 mt-5 rounded-xl text-zinc-50 text-center bg-green-600">
            <button>{selectedRole ? "Update" : "Register"} </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default NewRole;
