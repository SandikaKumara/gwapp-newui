"use client";
import { useMessageBox } from "@/providers/MessageProvider";
import { useRouter } from "next/navigation";

import InputBox from "@/components/InputBox";
import { useRef, useState } from "react";
import SaveButton from "@/components/SaveButton";
import { validateSelfResetPasswordForm } from "./selfResetPasswordFormValidations";

const SelfResetPasswordForm = ({ id, closeAction }) => {
  const [errors, setErrors] = useState([]);
  const showMessage = useMessageBox();

  const currentPasswordRef = useRef();
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();

  const handleFormSubmit = async (formData) => {
    const validations = await validateSelfResetPasswordForm(formData, id);

    setErrors(validations);

    if (validations.length === 0) {
      showMessage("success", "Successfully updated user password.");
      currentPasswordRef.current.value = "";
      newPasswordRef.current.value = "";
      confirmPasswordRef.current.value = "";
      closeAction();
    }
  };

  return (
    <form
      action={handleFormSubmit}
      className="p-8 h-fit flex flex-col gap-3 bg-white rounded shadow-md"
    >
      <div className="flex justify-between">
        <h1 className="font-bold text-xl">Password Reset</h1>
        <h1
          className="font-bold text-red-500 cursor-pointer hover:font-extrabold"
          onClick={closeAction}
        >
          X
        </h1>
      </div>

      <InputBox
        label={"Current Password"}
        name={"currentPassword"}
        type={"password"}
        inputRef={currentPasswordRef}
        required
      />

      <InputBox
        label={"New Password"}
        name={"newPassword"}
        type={"password"}
        inputRef={newPasswordRef}
        required
      />

      <InputBox
        label={"Confirm Password"}
        name={"confirmPassword"}
        type={"password"}
        inputRef={confirmPasswordRef}
        required
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
        <SaveButton label="Update" />
      </div>
    </form>
  );
};

export default SelfResetPasswordForm;
