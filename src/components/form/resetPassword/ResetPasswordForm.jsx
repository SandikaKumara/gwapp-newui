"use client";
import Link from "next/link";
import { validateResetPasswordForm } from "./resetPasswordFormValidations";
import { useMessageBox } from "@/providers/MessageProvider";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

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
      <form
        className="rounded-md border border-slate-200 w-fit h-fit py-10 px-16 min-w-[300px] shadow-md relative text-cyan-50 flex flex-col justify-center items-center gap-6 bg-slate-500 bg-opacity-50"
        action={handleFormSubmit}
      >
        <h1 className="font-bold text-2xl w-[300px] text-center text-yellow-400">
          Password Reset
        </h1>
        <hr className="border border-red-200 w-[300px]"></hr>

        <input
          className="pl-3 pt-1 pb-1 rounded-sm text-zinc-900 w-[300px] outline-none border-l-8 border-red-50 hover:border-red-500 focus:border-red-500 "
          type="password"
          name="currentPassword"
          placeholder="Current Password"
        />

        <input
          className="pl-3 pt-1 pb-1 rounded-sm text-zinc-900 w-[300px] outline-none border-l-8 border-red-50 hover:border-red-500 focus:border-red-500 "
          type="password"
          name="newPassword"
          placeholder="New Password"
        />

        <input
          className="pl-3 pt-1 pb-1 rounded-sm text-zinc-900 w-[300px] outline-none border-l-8 border-red-50 hover:border-red-500 focus:border-red-500 "
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
        />
        <div className="w-full">
          {" "}
          <Link
            className="text-sm font-thin w-fit hover:text-teal-300"
            href={"/login"}
          >
            Back to login..?
          </Link>
        </div>

        <button className="pl-8 pr-8 pt-2 pb-2 w-[300px] bg-red-500 border border-red-500 rounded-md font-bold hover:bg-red-200 hover:text-red-950">
          Reset
        </button>
      </form>
      <Footer />
    </>
  );
};

export default ResetPasswordForm;
