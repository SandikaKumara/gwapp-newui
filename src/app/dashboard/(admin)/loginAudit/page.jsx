import LoginAuditList from "@/components/entities/LoginAuditList";
import React from "react";

function loginAuditPage() {
  return (
    <div className="flex flex-col gap-4 px-4 py-2 bg-white rounded shadow-md">
      <header className="flex justify-between">
        <h1 className="font-bold text-2xl uppercase">Login Audit</h1>
      </header>

      <LoginAuditList />
    </div>
  );
}

export default loginAuditPage;
