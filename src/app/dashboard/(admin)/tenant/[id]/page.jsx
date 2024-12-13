"use client";
import BackButton from "@/components/BackButton";
import TenantForm from "@/components/form/tenant/TenantForm";
import { getTenantAction } from "@/dbActions/tenant";
import React, { useEffect, useState } from "react";

function EditTenantPage({ params }) {
  // const [tenant, setTenant] = useState({});
  // useEffect(() => {
  //   const fetchTenant = async () => {
  //     const item = await getTenantAction(params.id);
  //     setTenant(item);
  //   };

  //   fetchTenant();
  // }, [params]);

  return (
    <div className="pl-4 flex flex-col">
      <header className="flex justify-between">
        <h1 className="font-bold text-2xl text-zinc-950">Edit Tenant</h1>
        <BackButton url={"/dashboard/tenant"} />
      </header>
      <TenantForm selectedTenantId={params.id} />
    </div>
  );
}

export default EditTenantPage;
