"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import validateMenuFrom from "./menuFormValidations";
import {
  createMenuAction,
  editMenuAction,
  getMenuByIdAction,
} from "@/dbActions/menu";
import { useMessageBox } from "@/providers/MessageProvider";
import InputBox from "@/components/InputBox";
import OptionBox from "@/components/OptionBox";
import SaveButton from "@/components/SaveButton";
import { getTenantListAction } from "@/dbActions/tenant";

const MenuForm = ({ selectedMenuId, isDisabled }) => {
  const [errors, setErrors] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [selectedMenu, setMenu] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const showMessage = useMessageBox();
  let result = {};

  const handleFormSubmit = async (formdata) => {
    const validations = await validateMenuFrom(formdata, selectedMenuId);
    setErrors(validations);

    if (validations.length === 0) {
      if (selectedMenu) {
        result = await editMenuAction(formdata, selectedMenuId);
      } else {
        result = await createMenuAction(formdata);
      }

      showMessage(result.type, result.message);

      if (result.type === "success") {
        router.push(`/dashboard/menu/${result.id}`);
      }
    }
  };

  useEffect(() => {
    try {
      setLoading(true);
      const fetchMenu = async (id) => {
        // console.log("id", id);

        const menu = await getMenuByIdAction(id);
        // console.log("menu: ", menu);

        if (menu) {
          setMenu(menu);
        }
      };

      const getTenants = async () => {
        const tenants = await getTenantListAction("", true);
        setTenants(tenants);
      };

      selectedMenuId && fetchMenu(selectedMenuId);
      getTenants();
    } catch (err) {
      console.error("Failed to fetch menus : ", err);
    } finally {
      setLoading(false);
    }
  }, [selectedMenuId]);

  return (
    <form
      className="flex flex-col gap-3 py-6 px-6 bg-white mt-4 rounded w-1/2 min-w-[300px] mb-6 shadow-md"
      action={handleFormSubmit}
    >
      <InputBox
        label={"Name"}
        name={"name"}
        required={true}
        value={selectedMenu?.name || ""}
      />
      <InputBox
        label={"Category"}
        name={"category"}
        value={selectedMenu?.category || ""}
      />
      <InputBox
        label={"Order"}
        name={"order"}
        required={true}
        type="number"
        value={selectedMenu?.order || ""}
      />
      <InputBox
        label={"Embedded Url"}
        name={"url"}
        required={true}
        value={selectedMenu?.url || ""}
      />

      <OptionBox
        label={"Tenant"}
        name={"tenant"}
        required
        values={tenants}
        selectedId={selectedMenu?.tenantId || 0}
        isDisabled={isDisabled}
      />

      {errors.length > 0 && (
        <div className="text-red-500 text-sm pt-2">
          # Input data validation errors occurred as listed below.
          {errors.map((error, index) => (
            <div className="" key={index}>
              - {error}
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-end items-end">
        <SaveButton />
      </div>
    </form>
  );
};

export default MenuForm;
