"use client";
import { useMessageBox } from "@/providers/MessageProvider";
import Link from "next/link";
import { IoLogInOutline } from "react-icons/io5";
import { MdLockPerson } from "react-icons/md";
import { validateLoginForm } from "./loginFormValidations";
import { useRouter } from "next/navigation";
import { login } from "@/lib/sessionActions";
import Footer from "@/components/Footer";
import ubiLogo from "@/../public/ub-logo.png";
import ubilogo_white from "@/../public/ub-logo-white.png";
import Image from "next/image";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Login2FAForm from "./Login2FAForm";
import { verifyToken } from "@/lib/authenticator";
import Background from "@/components/Background";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [show2FARegister, setShow2FARegister] = useState(false);
  const showMessage = useMessageBox();
  const [email, setEmail] = useState();
  const router = useRouter();

  const handleFormSubmit = async (formData) => {
    const validation = await validateLoginForm(formData);

    if (validation) {
      if (validation.type) {
        showMessage(validation.type, validation.message);
      }

      if (validation.redirectUrl) {
        router.push(validation.redirectUrl);
      }

      if (validation.show2fa) {
        setShow2FA(true);
        setEmail(formData.get("email"));
      }

      if (validation.register2fa) {
        setShow2FARegister(true);
        setEmail(formData.get("email"));
      }

      setLoading(false);
    } else {
      const createSession = await login(formData.get("email"));
      showMessage("success", "Successfully logged-In.");
      router.push("/dashboard");
    }
  };

  const handleOnClick = () => {
    setLoading(true);
  };

  const handleVerify = async (formData) => {
    const token = formData.get("token");
    const verified = await verifyToken(token, null, email);

    if (verified) {
      if (verified.type === "success") {
        const createSession = await login(email);
        showMessage("success", "Successfully logged-In.");
        router.push("/dashboard");
      } else {
        showMessage(verified.type, verified.message);
      }
    }
  };

  const handleRedirectToLogin = () => {
    setShow2FA(false);
  };

  return (
    <>
      <Background />

      {/* <div className="fixed top-0 left-60 w-[100px] bg-blue-300 h-[100px] rounded-full animate-moving-bubble opacity-0 animation-duration: 7s; animation-delay: 1s;"></div> */}

      {show2FA ? (
        <Login2FAForm
          handleVerify={handleVerify}
          handleRedirectToLogin={handleRedirectToLogin}
        />
      ) : (
        <div className="w-full h-screen flex justify-center items-center bg-gradient-to-r from-indigo-800 from-10% via-blue-700 via-35% to-indigo-800 to-90%">
          <div className="flex flex-wrap w-fit">
            <div className="flex w-1/2 flex-col py-4 px-10 gap-8 items">
              <Image
                src={ubilogo_white}
                alt="UBI Logo"
                width={230}
                className=" "
              />

              <h1 className="text-white text-3xl font-bold font-sans">
                Better Meaning For Your Data
              </h1>

              <hr className="text-white" />

              <h2 className="text-white text-xl font-sans">
                To visualize your data and provide more insights to grow your
                business using our expertise.
              </h2>
            </div>

            <div className="w-1/2 p-6 text-indigo-950 flex flex-col justify-center items-center gap-3">
              <form
                className=" bg-white flex flex-col gap-5 py-10 px-10 rounded-sm shadow-sm z-0"
                action={handleFormSubmit}
                onSubmit={handleOnClick}
              >
                {/* <Image
                  src={ubiLogo}
                  alt="UBI Logo"
                  width={200}
                  className="py-1 px-3 rounded-sm shadow-md"
                /> */}
                <h1 className="font-normal text-2xl w-[300px] flex gap-4 items-center">
                  Sign In
                </h1>

                <p className="font-sans text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    href={"https://www.untanglebi.com.au/contact-10"}
                    target="_blank"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Contact Us
                  </Link>
                </p>
                <hr className="border border-indigo-100 w-full"></hr>

                <input
                  className="border-2 border-gray-200 focus:border-gray-300 outline-none py-2 px-4"
                  type="email"
                  name="email"
                  placeholder="Email"
                  autoComplete="user-email"
                />
                <input
                  className="border-2 border-gray-200 focus:border-gray-300 outline-none py-2 px-4"
                  type="password"
                  name="password"
                  placeholder="Password"
                  maxLength={32}
                />
                <div className="w-full">
                  <Link
                    className="text-sm w-fit text-blue-500 hover:text-blue-700"
                    href={"/forgot-password"}
                  >
                    Forgot Password..?
                  </Link>
                </div>

                {loading ? (
                  <div className="text-center flex items-center gap-3 justify-center font-bold text-lg w-full bg-indigo-500 text-white p-4 rounded-sm uppercase">
                    <span>Login</span>
                    <AiOutlineLoading3Quarters className="text-xl animate-spin" />
                  </div>
                ) : (
                  <button className="text-center flex items-center gap-3 font-bold text-lg justify-center w-full bg-indigo-600 hover:bg-indigo-500 transition-all duration-600 ease-in-out text-white p-4 rounded-sm uppercase">
                    <span>Sign In</span>
                    <IoLogInOutline className="text-xl" />
                  </button>
                )}
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
        </div>
      )}
    </>
  );
};

export default LoginForm;
