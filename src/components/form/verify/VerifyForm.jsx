"use client";
import Link from "next/link";
import { validateVerifyForm } from "./verifyFormValidations";
import { useMessageBox } from "@/providers/MessageProvider";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Background from "@/components/Background";
import { useState } from "react";
import { GiConfirmed } from "react-icons/gi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const VerifyForm = () => {
  const showMessage = useMessageBox();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    const validations = await validateVerifyForm(formData);

    if (validations) {
      showMessage(validations.type, validations.message);
      if (validations.type === "success") {
        router.push(validations.redirectUrl);
      }
    }
    setLoading(false);
  };
  return (
    <>
      <Background />

      <div className="w-full h-screen flex justify-center items-center bg-gradient-to-r from-indigo-800 from-10% via-blue-700 via-35% to-indigo-800 to-90%">
        <div className="w-1/2 p-6 text-indigo-950 flex flex-col justify-center items-center gap-3">
          <form
            className="bg-white flex flex-col gap-5 py-10 px-10 rounded-sm shadow-sm z-0"
            action={handleSubmit}
          >
            <h1 className="font-normal text-2xl w-[300px] flex gap-4 items-center">
              Verification
            </h1>
            <hr className="border border-indigo-100 w-full"></hr>

            <p className="w-[300px] text-wrap font-sans text-sm">
              The verification code sent to your registered email. Check the
              email for code, else contact out support center.
            </p>

            <input
              className="border-2 border-gray-200 focus:border-gray-300 outline-none py-2 px-4"
              type="password"
              name="code"
              placeholder="Verification Code"
            />

            <div className="w-full">
              <Link
                className="text-sm w-fit text-blue-500 hover:text-blue-700"
                href={"./login"}
              >
                Back to login..?
              </Link>
            </div>

            <button
              className={`text-center flex items-center gap-3 font-bold text-lg justify-center w-full ${
                !loading
                  ? "bg-indigo-600 hover:bg-indigo-500 transition-all duration-600 ease-in-out"
                  : "bg-indigo-400"
              }   text-white p-4 rounded-sm uppercase`}
              disabled={!loading ? false : true}
            >
              <span>Verify</span>{" "}
              {loading ? (
                <AiOutlineLoading3Quarters className="text-xl animate-spin" />
              ) : (
                <GiConfirmed className="text-xl" />
              )}
            </button>

            <p className="w-[300px] text-wrap font-sans text-xs italic">
              Upon successfully verification you will be redirected to the login
              page automatically.
            </p>
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

export default VerifyForm;
