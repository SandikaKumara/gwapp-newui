"use client";
import InputBox from "@/components/InputBox";
import SaveButton from "@/components/SaveButton";
import TextArea from "@/components/TextArea";
import { createTicketAction, editTicketAction } from "@/dbActions/ticket";
import { useMessageBox } from "@/providers/MessageProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { validateTicketForm } from "./ticketFormValidations";
import OptionBox from "@/components/OptionBox";
import { useSession } from "@/providers/SessionProvider";
import { getUserTenantListAction } from "@/dbActions/userTenant";
import { getUserAction } from "@/dbActions/userActions";

const TicketForm = ({ selectedTicket }) => {
  const [errors, setErrors] = useState([]);
  const [attachment, setAttachment] = useState();
  const [userTenants, setUserTenants] = useState([]);
  const [showTenantSelection, setShowTenantSelection] = useState(false);

  const router = useRouter();

  const { sessionTenant, setRefresh } = useSession();

  const showMessage = useMessageBox();
  let result = {};

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);
    formdata.append("attachment", attachment);

    const validations = await validateTicketForm(formdata, selectedTicket?.id);
    setErrors(validations);

    if (validations.length === 0) {
      if (selectedTicket) {
        result = await editTicketAction(formdata, selectedTicket?.id);
      } else {
        result = await createTicketAction(formdata);
      }

      showMessage(result.type, result.message);

      if (result.type === "success") {
        router.push("/dashboard/ticket");
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      //   const imageUrl = URL.createObjectURL(file);
      setAttachment(file);
    }
  };

  useEffect(() => {
    setAttachment(selectedTicket?.attachment);
  }, [selectedTicket?.attachment]);

  useEffect(() => {
    const fetchUserTenants = async () => {
      let tenantList = [];
      const list = await getUserTenantListAction(sessionTenant?.userId);

      list.map(
        (item) =>
          item.tenant.isActive &&
          tenantList.push({ id: item.tenant.id, name: item.tenant.name })
      );

      const user = await getUserAction(sessionTenant?.email);
      if (user && user.tenantId) {
        tenantList.push({ id: user.tenant.id, name: user.tenant.name });
      }

      setUserTenants(tenantList);

      if (tenantList.length > 1) {
        setShowTenantSelection(true);
      }
    };

    fetchUserTenants();
  }, [sessionTenant]);

  return (
    <form
      className="flex flex-col gap-3 py-6 px-6 bg-white mt-4 rounded w-1/2 min-w-[300px] mb-6 shadow-md"
      encType="multipart/form-data"
      onSubmit={handleFormSubmit}
    >
      <InputBox
        label={"Title"}
        name={"title"}
        type={"text"}
        required
        value={selectedTicket?.title || ""}
      />

      <TextArea
        label={"Content"}
        rows={"10"}
        name={"content"}
        required
        value={selectedTicket?.content || ""}
      />

      {showTenantSelection && (
        <OptionBox
          label={"Tenant"}
          name={"tenant"}
          values={userTenants}
          required
        />
      )}

      <InputBox
        label={"Attachment"}
        name={"file"}
        type={"file"}
        onChange={handleFileChange}
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

      <div className="flex justify-end">
        <SaveButton label="Create" />
      </div>
      {/* <SaveButton label="Create" /> */}
    </form>
  );
};

export default TicketForm;
