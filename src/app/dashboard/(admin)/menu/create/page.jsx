import BackButton from "@/components/BackButton";
import MenuForm from "@/components/form/menu/MenuForm";

const createMenuPage = () => {
  return (
    <div className="pl-4 flex flex-col">
      <header className="flex justify-between">
        <h1 className="font-bold text-2xl uppercase">Create Menu</h1>
        <BackButton url={"/dashboard/menu"} />
      </header>

      <MenuForm />
    </div>
  );
};

export default createMenuPage;
