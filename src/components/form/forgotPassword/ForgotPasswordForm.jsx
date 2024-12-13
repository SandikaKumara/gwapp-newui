"use client";
import Link from "next/link";
import { validateForgotPasswordForm } from "./forgotPasswordValidations";
import { useState } from "react";
import { useMessageBox } from "@/providers/MessageProvider";
import { generatePasswordResetCode } from "@/dbActions/userActions";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Background from "@/components/Background";
import { RiMailSendLine } from "react-icons/ri";

const ForgotPasswordForm = () => {
  const router = useRouter();

  const showMessage = useMessageBox();

  const handleFormSubmit = async (formData) => {
    const validations = await validateForgotPasswordForm(formData);
    if (validations) {
      if (validations.type !== "success") {
        showMessage(validations.type, validations.message);
      }

      if (validations.type === "success") {
        const result = await generatePasswordResetCode(validations.message);
        if (result) {
          showMessage(result.type, result.message);
          if (result.type === "success") {
            router.push("/login");
          }
        }
      }
    }
  };
  return (
    <>
      <Background />

      <div className="w-full h-screen flex justify-center items-center bg-gradient-to-r from-indigo-800 from-10% via-blue-700 via-35% to-indigo-800 to-90%">
        <div className="w-1/2 p-6 text-indigo-950 flex flex-col justify-center items-center gap-3">
          <form
            className=" bg-white flex flex-col gap-5 py-10 px-10 rounded-sm shadow-sm z-0"
            action={handleFormSubmit}
          >
            <h1 className="font-normal text-2xl w-[300px] flex gap-4 items-center">
              Forgot Password
            </h1>

            <hr className="border border-indigo-100"></hr>

            <p className="w-[300px] text-wrap font-sans text-md">
              A password reset link will be sent to your email address. Please
              check your inbox and follow the link to verify and reset your
              password.
            </p>

            <input
              className="border-2 border-gray-200 focus:border-gray-300 outline-none py-2 px-4"
              type="text"
              name="email"
              placeholder="Email"
            />
            <div className="w-full">
              <Link
                className="text-sm w-fit text-blue-500 hover:text-blue-700"
                href={"./login"}
              >
                Back to login..?
              </Link>
            </div>

            <button className="text-center flex items-center gap-3 font-bold text-lg justify-center w-full bg-indigo-600 hover:bg-indigo-500 transition-all duration-600 ease-in-out text-white p-4 rounded-sm uppercase">
              <span>Send</span> <RiMailSendLine className="text-xl" />
            </button>
          </form>

          <Link
            className="text-white text-sm cursor-pointer"
            href={"https://untanglebi.com.au"}
            target="_blank"
          >
            &copy; Untanglebi.com.au 2024
          </Link>
        </div>
      </div>

      {/* <Footer /> */}
    </>
  );
};

export default ForgotPasswordForm;
