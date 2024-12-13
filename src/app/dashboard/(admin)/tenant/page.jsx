import TenantsList from "@/components/entities/TenantsList";
import NewDialogButton from "@/components/NewDialogButton";

function TenantPage() {
  return (
    <div className="flex flex-col gap-4 px-4 py-2 bg-white rounded shadow-md">
      <header className="flex justify-between">
        <h1 className="font-bold text-2xl uppercase">Tenants</h1>

        <NewDialogButton url={"/dashboard/tenant/create"} />
      </header>

      <TenantsList />
    </div>
  );
}

export default TenantPage;
