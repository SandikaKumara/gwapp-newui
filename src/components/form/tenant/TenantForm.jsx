"use client";
import ColorPicker from "@/components/ColorPicker";
import InputBox from "@/components/InputBox";
import TextArea from "@/components/TextArea";
import {
  createTenantAction,
  editTenantAction,
  getTenantAction,
} from "@/dbActions/tenant";
import { useMessageBox } from "@/providers/MessageProvider";
import { useEffect, useState } from "react";
import { validateTenantForm } from "./tenantFormValidations";
import SaveButton from "@/components/SaveButton";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LoadingComponent from "@/components/LoadingComponent";
import { getFile } from "@/lib/files";

const TenantForm = ({ selectedTenantId }) => {
  const [errors, setErrors] = useState([]);
  const [imagePreview, setImagePreview] = useState();
  const [selectedTenant, setSelectedTenant] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const showMessage = useMessageBox();
  let result = {};

  useEffect(() => {
    try {
      setLoading(true);
      if (selectedTenantId && selectedTenantId !== undefined) {
        const fetchTenant = async (id) => {
          const item = await getTenantAction(id);
          // console.log(item);

          setSelectedTenant(item);
        };

        fetchTenant(selectedTenantId);
      }
    } catch (error) {
      console.error("Failed to fetch tenants : ", error);
    } finally {
      setLoading(false);
    }
  }, [selectedTenantId]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formdata = new FormData(e.target);
    formdata.append("imagePath", imagePreview);

    const validations = await validateTenantForm(formdata, selectedTenantId);
    setErrors(validations);

    if (validations.length === 0) {
      if (selectedTenant && selectedTenant !== "undefined") {
        result = await editTenantAction(formdata, selectedTenantId);
      } else {
        result = await createTenantAction(formdata);
      }

      showMessage(result.type, result.message);

      if (result.type === "success") {
        router.push(`/dashboard/tenant/${result.id}`);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  useEffect(() => {
    const fetchLogo = async () => {
      if (selectedTenant?.logoPath) {
        const image = await getFile(selectedTenant?.logoPath);
        setImagePreview(image?.image);
      }
    };

    selectedTenant && fetchLogo();
    // setImagePreview(selectedTenant?.logoPath);
  }, [selectedTenant]);

  return (
    <>
      {loading && <LoadingComponent />}

      <form
        className="flex flex-col gap-3 py-6 px-6 bg-white mt-4 rounded w-1/2 min-w-[300px] mb-6 shadow-md"
        encType="multipart/form-data"
        onSubmit={handleFormSubmit}
      >
        <InputBox
          label={"Name"}
          name={"name"}
          required={true}
          value={selectedTenant?.name || ""}
        />

        <InputBox
          label={"Contact"}
          name={"contact"}
          value={selectedTenant?.contact || ""}
        />

        <TextArea
          label={"Address"}
          name={"address"}
          rows="4"
          value={selectedTenant?.address || ""}
        />

        <InputBox
          label={"Client Id"}
          name={"clientId"}
          value={selectedTenant?.clientId || ""}
        />

        <InputBox
          label={"Secret Key"}
          name={"secretKey"}
          value={selectedTenant?.secretKey || ""}
        />

        <InputBox
          label={"Home URL"}
          name={"homeUrl"}
          value={selectedTenant?.homeUrl || ""}
        />

        <InputBox
          label={"Mobile URL"}
          name={"mobileUrl"}
          value={selectedTenant?.mobileUrl || ""}
        />

        <InputBox
          label={"Logo Image"}
          name={"logoPath"}
          type="file"
          required={true}
          onChange={handleImageChange}
          accept={".jpg,.jpeg,.png,.webp"}
        />

        {imagePreview && (
          <Image
            className="border p-2 rounded border-gray-400"
            src={imagePreview || "/default-company-logo.png"}
            alt="Profile Picture"
            width={200}
            height={200}
            style={{ objectFit: "cover" }}
            priority
          />
        )}

        {/* <ColorPicker
          label={"Background Color"}
          name={"bgColor"}
          value={selectedTenant?.bgColor || "#ffffff"}
        />

        <ColorPicker
          label={"Text Color"}
          name={"textColor"}
          value={selectedTenant?.textColor || "#ffffff"}
        />

        <ColorPicker
          label={"Text Hover Color"}
          name={"textHoverColor"}
          value={selectedTenant?.textHoverColor || "#ffffff"}
        />

        <ColorPicker
          label={"Border Color"}
          name={"borderColor"}
          value={selectedTenant?.borderColor || "#ffffff"}
        />

        <ColorPicker
          label={"Category Text Color"}
          name={"textCategoryColor"}
          value={selectedTenant?.categoryTextColor || "#ffffff"}
        /> */}

        {/* <Switch name={"active"} ref={activeRef} label={"Active"} /> */}

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

        {/* <button
        type="submit"
        className="flex flex-col justify-center w-[500px] p-3 mt-5 rounded-xl text-zinc-50 text-center bg-green-600 hover:bg-green-900"
      >
        {selectedTenant ? "Update" : "Register"}{" "}
      </button> */}
        <div className="flex justify-end">
          <SaveButton />
        </div>
      </form>
    </>
  );
};

export default TenantForm;
