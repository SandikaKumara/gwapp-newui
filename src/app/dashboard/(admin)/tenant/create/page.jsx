import BackButton from "@/components/BackButton";
import TenantForm from "@/components/form/tenant/TenantForm";

const createTenantPage = () => {
  return (
    <div className="pl-4 flex flex-col">
      <header className="flex justify-between">
        <h1 className="font-bold text-2xl uppercase">Create Tenant</h1>
        <BackButton url={"/dashboard/tenant"} />
      </header>

      <TenantForm />
    </div>
  );
};

export default createTenantPage;
