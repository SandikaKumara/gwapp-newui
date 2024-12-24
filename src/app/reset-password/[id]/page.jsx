import ResetPasswordForm from "@/components/form/resetPassword/ResetPasswordForm";
import Image from "next/image";
import bgImage from "@/../public/background.jpg";
import React from "react";

function ResetPasswordPage({ params }) {
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

      <ResetPasswordForm id={params.id} />
    </main>
  );
}

export default ResetPasswordPage;
