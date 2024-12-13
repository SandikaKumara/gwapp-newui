import ForgotPasswordForm from "@/components/form/forgotPassword/ForgotPasswordForm";
import Image from "next/image";
import React from "react";
import bgImage from "@/../public/background.jpg";

function passwordResetPage() {
  return (
    <main className="flex flex-row justify-center items-center h-dvh gap-5 flex-wrap">
      {/* background image */}
      {/* <Image
        src={bgImage}
        alt={"background-image"}
        fill={true}
        style={{ width: "100%", objectFit: "cover" }}
        priority
        className="blur-sm brightness-50"
      /> */}

      <ForgotPasswordForm />
    </main>
  );
}

export default passwordResetPage;
