"use client";
import React, { useEffect, useRef, useState } from "react";
import Switch from "../Switch";
import NewDialogButton from "../NewDialogButton";
import MandatorySpan from "../MandatorySpan";

function NewUser({ selectedUser, closeModal }) {
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

  const roles = [
    {
      id: 1,
      name: "Administrator",
    },
    {
      id: 2,
      name: "Manager",
    },
  ];

  const [active, setActive] = useState(true);
  const [admin, setAdmin] = useState(false);

  const newDialogRef = useRef();
  const inputFirstNameRef = useRef();
  const inputLastNameRef = useRef();
  const inputEmailRef = useRef();
  const inputContactRef = useRef();
  const inputAddressRef = useRef();
  const inputActiveRef = useRef();
  const inputAdminRef = useRef();

  const handleNewButtonClick = () => {
    newDialogRef.current?.showModal();
  };

  const handleCloseModel = () => {
    newDialogRef.current?.close();

    if (inputFirstNameRef.current) {
      inputFirstNameRef.current.value = "";
    }
    if (inputLastNameRef.current) {
      inputLastNameRef.current.value = "";
    }
    if (inputEmailRef.current) {
      inputEmailRef.current.value = "";
    }
  };

  useEffect(() => {
    if (selectedUser) {
      setActive(selectedUser.isActive);
      setAdmin(selectedUser.isAdmin);
    }
  }, [selectedUser]);

  return (
    <>
      <NewDialogButton handleClickFunction={handleNewButtonClick} />

      <dialog
        ref={newDialogRef}
        className="backdrop:bg-zinc-950/85 rounded-md border-2 border-zinc-900"
      >
        <div className="w-fit h-fit p-10 ">
          <div className="flex justify-end">
            <div
              className="w-fit h-fit text-zinc-400 hover:text-red-600 cursor-pointer absolute top-5 text-lg font-bold
            "
              onClick={handleCloseModel}
            >
              <span className="sr-only">Close</span>X
            </div>
          </div>

          <form className="flex flex-col gap-3 p-4">
            <div className="flex flex-col">
              <label className="text-sm mb-1 text-zinc-600" htmlFor="name">
                First Name <MandatorySpan /> :{" "}
              </label>
              <input
                className="border-2 border-zinc-500 rounded-md outline-none w-[400px] p-1 pl-4 font-mono text-zinc-900 text-sm focus:border-red-500"
                type="text"
                name="name"
                ref={inputFirstNameRef}

                // value={selectedUser ? selectedUser.name : ""}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm mb-1 text-zinc-600" htmlFor="name">
                Last Name <MandatorySpan /> :{" "}
              </label>
              <input
                className="border-2 border-zinc-500 rounded-md outline-none w-[400px] p-1 pl-4 font-mono text-zinc-900 text-sm focus:border-red-500"
                type="text"
                name="name"
                ref={inputLastNameRef}

                // value={selectedUser ? selectedUser.name : ""}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm mb-1 text-zinc-600" htmlFor="email">
                Email <MandatorySpan /> :{" "}
              </label>
              <input
                className="border-2 border-zinc-500 rounded-md outline-none w-[400px] p-1 pl-4 font-mono text-zinc-900 text-sm focus:border-red-500"
                type="text"
                name="email"
                ref={inputEmailRef}
                // value={selectedUser ? selectedUser.email : ""}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm mb-1 text-zinc-600" htmlFor="name">
                Contact :{" "}
              </label>
              <input
                className="border-2 border-zinc-500 rounded-md outline-none w-[400px] p-1 pl-4 font-mono text-zinc-900 text-sm focus:border-red-500"
                type="text"
                name="name"
                ref={inputContactRef}

                // value={selectedUser ? selectedUser.name : ""}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm mb-1 text-zinc-600" htmlFor="name">
                Address :{" "}
              </label>
              <textarea
                className="border-2 border-zinc-500 rounded-md outline-none w-[400px] p-1 pl-4 font-mono text-zinc-900 text-sm focus:border-red-500"
                type="text"
                name="name"
                rows={3}
                ref={inputAddressRef}

                // value={selectedUser ? selectedUser.name : ""}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm mb-1 text-zinc-600" htmlFor="isactive">
                Active :{" "}
              </label>
              <Switch
              // ref={inputActiveRef}
              // currentStatus={active}
              // onChange={() => {
              //   setActive(!active);
              // }}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm mb-1 text-zinc-600" htmlFor="isadmin">
                Admin :{" "}
              </label>
              <Switch
              // ref={inputAdminRef}
              // currentStatus={admin}
              // onChange={() => {
              //   setAdmin(!admin);
              // }}
              />
            </div>

            <div className="flex flex-col justify-center w-full p-3 mt-5 rounded-xl text-zinc-50 text-center bg-green-600">
              <button>{selectedUser ? "Update" : "Register"} </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}

export default NewUser;
