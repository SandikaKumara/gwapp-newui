"use client";
import Link from "next/link";
import { validateResetPasswordForm } from "./resetPasswordFormValidations";
import { useMessageBox } from "@/providers/MessageProvider";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Background from "@/components/Background";

const ResetPasswordForm = ({ id }) => {
  const showMessage = useMessageBox();
  const router = useRouter();

  const handleFormSubmit = async (formData) => {
    const validations = await validateResetPasswordForm(formData, id);
    showMessage(validations.type, validations.message);

    if (validations.redirectUrl) {
      router.push(validations.redirectUrl);
    }
  };
  return (
    <>
      <Background />
      <div className="w-full h-screen flex justify-center items-center bg-gradient-to-r from-indigo-800 from-10% via-blue-700 via-35% to-indigo-800 to-90%">
        <div className="w-1/2 p-6 text-indigo-950 flex flex-col justify-center items-center gap-3">
          <form
            className="bg-white flex flex-col gap-5 py-10 px-10 rounded-sm shadow-sm z-0"
            action={handleFormSubmit}
          >
            <h1 className="font-normal text-2xl w-[300px] flex gap-4 items-center">
              Password Reset
            </h1>
            <hr className="border border-red-200 w-[300px]"></hr>

            <input
              className="border-2 border-gray-200 focus:border-gray-300 outline-none py-2 px-4"
              type="password"
              name="currentPassword"
              placeholder="Current Password"
            />

            <input
              className="border-2 border-gray-200 focus:border-gray-300 outline-none py-2 px-4"
              type="password"
              name="newPassword"
              placeholder="New Password"
            />

            <input
              className="border-2 border-gray-200 focus:border-gray-300 outline-none py-2 px-4"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
            />
            <div className="w-full">
              {" "}
              <Link
                className="text-sm w-fit text-blue-500 hover:text-blue-700"
                href={"/login"}
              >
                Back to login..?
              </Link>
            </div>

            <button className="text-center flex items-center gap-3 font-bold text-lg justify-center w-full bg-indigo-600 hover:bg-indigo-500 transition-all duration-600 ease-in-out text-white p-4 rounded-sm uppercase">
              Reset
            </button>
          </form>
          {/* 
          <Footer /> */}
          {/* <div className="bg-red-400 text-2xl">{loading}</div> */}

          <Link
            className="text-white text-sm cursor-pointer"
            href={"https://untanglebi.com.au"}
            target="_blank"
          >
            &copy; Untanglebi.com.au 2024
          </Link>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordForm;
