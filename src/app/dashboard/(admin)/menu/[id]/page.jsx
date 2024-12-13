"use client";
import BackButton from "@/components/BackButton";
import MenuForm from "@/components/form/menu/MenuForm";
import UserMenuForm from "@/components/form/menu/userMenu/UserMenuForm";
import { useSearchParams } from "next/navigation";

const EditMenuPage = ({ params }) => {
  const searchParams = useSearchParams();
  const tenant = searchParams.get("tenant");
  // const [menu, setMenu] = useState([]);
  // useEffect(() => {
  //   const fetchMenu = async () => {
  //     const item = await fetchMenu(params.id);
  //     setMenu(item);
  //   };
  // }, [params]);
  return (
    <div className="pl-4 flex flex-col">
      <header className="flex justify-between">
        <h1 className="font-bold text-2xl text-zinc-950">Edit Menu</h1>
        <BackButton url={`/dashboard/menu?tenant=${tenant}`} />
      </header>
      <MenuForm selectedMenuId={params.id} isDisabled={true} />
      <UserMenuForm selectedMenuId={params.id} />
    </div>
  );
};

export default EditMenuPage;
