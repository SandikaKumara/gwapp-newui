"use client";

import MenuList from "@/components/entities/MenuList";
import NewDialogButton from "@/components/NewDialogButton";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function MenuPage() {
  const searchParams = useSearchParams();

  const [selectedTenant, setSelsectedTenant] = useState("");

  useEffect(() => {
    const tenantFromQuery = searchParams.get("tenant");

    if (tenantFromQuery) {
      setSelsectedTenant(tenantFromQuery);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col gap-4 px-4 py-2 bg-white rounded shadow-md">
      <header className="flex justify-between">
        <h1 className="font-bold text-2xl uppercase">Menus</h1>

        <NewDialogButton url={"/dashboard/menu/create"} />
      </header>

      <MenuList tenantId={selectedTenant} />
    </div>
  );
}

export default MenuPage;
