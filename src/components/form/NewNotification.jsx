import React, { useEffect, useState } from "react";
import Switch from "../Switch";

function NewNotification({ selectedNotification, notificationDialogRef, closeModal }) {
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
    
      const users = [
        {
            id: 1,
            name: "John"
        },{
            id: 2,
            name: "Andrew"
        }
      ]
    
      const [active, setActive] = useState(true);
      const [sendEmail, setSendEmail] = useState(true);
    
      useEffect(() => {
        if (selectedNotification) {
          setActive(selectedNotification.isActive);
        }
      }, [selectedNotification]);
    
      return (
        <dialog
          ref={notificationDialogRef}
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
                <label className="text-sm mb-1 text-zinc-600" htmlFor="subject">
                  Subject :{" "}
                </label>
                <input
                  className="border-2 border-zinc-500 rounded-md outline-none w-[300px] p-1 pl-4 font-mono text-zinc-900 text-sm focus:border-red-500"
                  type="text"
                  name="subject"
                  value={selectedNotification ? selectedNotification.title : ""}
                />
              </div>
    
              <div className="flex flex-col">
                <label className="text-sm mb-1 text-zinc-600" htmlFor="message">
                  Message :{" "}
                </label>
                <textarea
                  className="border-2 border-zinc-500 rounded-md outline-none w-[300px] p-1 pl-4 font-mono text-zinc-900 text-sm focus:border-red-500"
                  type="input"
                  name="message"
                  defaultValue={selectedNotification ? selectedNotification.message : ""}
                  rows={4}
                />
              </div>
    
              <div className="flex flex-col">
                <label className="text-sm mb-1 text-zinc-600" htmlFor="tenant">
                  Tenant :{" "}
                </label>
    
                <select name="tenant" className="border-2 border-zinc-500 rounded-md outline-none w-[300px] p-1 pl-4 font-mono text-zinc-900 text-sm focus:border-red-500">
                    <option value="0"></option>
                    {tenants.map(tenant=>(
                       <option key={tenant.id} value={tenant.id}>{tenant.name}</option> 
                    ))}
                </select>
              </div>
    
              <div className="flex flex-col">
                <label className="text-sm mb-1 text-zinc-600" htmlFor="role">
                  User Role :{" "}
                </label>
                <select name="role" className="border-2 border-zinc-500 rounded-md outline-none w-[300px] p-1 pl-4 font-mono text-zinc-900 text-sm focus:border-red-500">
                    <option value="0"></option>
                    {users.map(user=>(
                       <option key={user.id} value={user.id}>{user.name}</option> 
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
    
              <div className="flex flex-col">
                <label className="text-sm mb-1 text-zinc-600" htmlFor="sendemail">
                  Send Email :{" "}
                </label>
                <Switch
                  status={sendEmail}
                  onChange={() => {
                    setSendEmail(!sendEmail);
                  }}
                />
              </div>

    
              <div className="flex flex-col justify-center w-full p-3 mt-5 rounded-xl text-zinc-50 text-center bg-green-600">
                <button>{selectedNotification ? "Update" : "Register"} </button>
              </div>
            </form>
          </div>
        </dialog>
      );
}

export default NewNotification;