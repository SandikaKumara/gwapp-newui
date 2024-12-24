import VerifyForm from "@/components/form/verify/VerifyForm";
import Image from "next/image";
import React from "react";
import bgImage from "@/../public/background.jpg";

function Verify() {
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
      <div>Authenticator</div>
      <VerifyForm />
    </main>
  );
}

export default Verify;
