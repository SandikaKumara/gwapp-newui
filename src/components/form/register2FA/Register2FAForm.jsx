"use client";
import Background from "@/components/Background";
import LoadingComponent from "@/components/LoadingComponent";
import PageLoader from "@/components/PageLoader";
import {
  confirmToken,
  generateQRCode,
  generateToken,
} from "@/lib/authenticator";
import { login } from "@/lib/sessionActions";
import { useMessageBox } from "@/providers/MessageProvider";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoLogInOutline } from "react-icons/io5";

function Register2FAForm({
  handleVerify,
  handleRedirectToLogin,
  email,
  userId,
}) {
  const [isQREnabled, setIsQREnabled] = useState(false);
  const [showQR, setShowQR] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [qrSecret, setQrSecret] = useState();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const inputRefs = useRef([]);
  const [isComplete, setIsComplete] = useState(false);
  const [completeNumber, setCompleteNumber] = useState("");

  const showMessage = useMessageBox();
  const route = useRouter();

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleQRConfirm = async (formData) => {
    setLoading(true);
    formData.append("authenticatorSecret", qrSecret);
    formData.append("authenticatorUrl", qrCode);

    const result = await confirmToken(formData, userId);
    showMessage(result.type, result.message);

    if (result.type === "success") {
      setPageLoading(true);
      setQrCode(null);
      setQrSecret(null);

      const createSession = await login(email);
      showMessage("success", "Successfully logged-In.");
      route.push("/dashboard");
    }
    setLoading(false);
    // manualToken();
  };

  useEffect(() => {
    const handleAuthenticator = async () => {
      // setShowQR(!showQR);
      if (!email) return;

      const res = await generateQRCode(email);
      if (res.type === "success") {
        setQrCode(res.qrCodeUrl);
        setQrSecret(res.secret);
        // showMessage(res.type, res.message);
      } else {
        setQrCode(null);
        setQrSecret(null);
        // showMessage(res.type, res.message);
      }
    };

    handleAuthenticator();
  }, []);

  const handleInput = (event, index) => {
    const value = event.target.value;
    // Allow only numeric input
    if (!/^\d*$/.test(value)) {
      event.target.value = value.replace(/\D/g, ""); // Remove non-numeric characters
      return;
    }

    // Move to the next input field if a number is entered
    if (value.trim() !== "") {
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }

    // Check if all inputs are filled
    const inputs = inputRefs.current.map((input) => input?.value || "");
    if (inputs.every((val) => val.length === 1)) {
      setIsComplete(true);
      setCompleteNumber(inputs.join(""));
    } else {
      setIsComplete(false);
    }
  };

  const handleBackspace = (event, index) => {
    if (
      event.key === "Backspace" &&
      !event.target.value &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1].focus();
      setIsComplete(false);
      setCompleteNumber("");
    }
  };

  return (
    <>
      {pageLoading && <PageLoader />}

      <Background />

      <div className="w-full h-screen flex justify-center items-center bg-gradient-to-r from-indigo-800 from-10% via-blue-700 via-35% to-indigo-800 to-90%">
        <div className="w-1/2 p-6 text-indigo-950 flex flex-col justify-center items-center gap-3">
          <form
            className=" bg-white flex flex-col items-center gap-5 py-10 px-10 rounded-sm shadow-sm z-0"
            action={handleQRConfirm}
            // onClick={handleOnClick}
          >
            <h1 className="font-normal text-2xl w-[300px] flex gap-4 items-center">
              Register Two-Factor Authentication
            </h1>

            <hr className="border border-indigo-100 w-full" />

            <p className="w-[300px] text-wrap font-sans text-md">
              You are about to enable multi-factor authentication.
            </p>

            <img
              src={qrCode}
              width={250}
              alt="Scan QR code with Authenticator"
            />

            <p className="w-[300px] text-wrap font-sans text-md">
              Please use your authenticator app to scan this QR code and enter
              the 6 digit code below to complete registration.
            </p>

            {/* <input
              type="text"
              className="border-2 border-gray-200 focus:border-gray-300 outline-none py-2 px-4"
              maxLength={6}
              name="code"
            /> */}

            <div className="flex justify-evenly w-full">
              {Array.from({ length: 6 }).map((_, index) => (
                <input
                  key={index}
                  type="text"
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="border-2 border-gray-200 focus:border-gray-300 outline-none w-10 text-center py-2 rounded-md"
                  maxLength={1}
                  onChange={(event) => handleInput(event, index)}
                  onKeyDown={(event) => handleBackspace(event, index)}
                  autoComplete="off"
                />
              ))}
            </div>

            <div className="w-full">
              <button
                type="button"
                className="text-sm w-fit text-blue-500 hover:text-blue-700"
                onClick={() => handleRedirectToLogin()}
              >
                Back to login..?
              </button>
            </div>

            {isComplete && (
              <input type="hidden" name="code" defaultValue={completeNumber} />
            )}

            <button
              className={`text-center flex items-center gap-3 font-bold text-lg justify-center w-full ${
                !loading && isComplete
                  ? "bg-indigo-600 hover:bg-indigo-500 transition-all duration-600 ease-in-out"
                  : "bg-indigo-400"
              }  text-white p-4 rounded-sm uppercase`}
              disabled={!loading && isComplete ? false : true}
            >
              Register{" "}
              {loading ? (
                <AiOutlineLoading3Quarters className="text-xl animate-spin" />
              ) : (
                <IoLogInOutline className="text-xl" />
              )}
            </button>
          </form>
          <div className="bg-red-400 text-2xl">{loading}</div>

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
}

export default Register2FAForm;
