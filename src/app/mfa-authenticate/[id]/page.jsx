"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import bgImage from "@/../public/background.jpg";
import Register2FAForm from "@/components/form/register2FA/Register2FAForm";
import { useRouter } from "next/navigation";
import { getUserByIdAction } from "@/dbActions/userActions";

function MFAAuthenticatePage({ params }) {
  const [email, setEmail] = useState();
  const [isAuthenticatorEnabled, setIsAuthenticatorEnabled] = useState(false);
  const router = useRouter();

  const handleVerify = () => {
    return;
  };

  const handleRedirectToLogin = () => {
    router.push("/login");
  };

  useEffect(() => {
    const fetchUser = async (id) => {
      const user = await getUserByIdAction(id);
      if (user) {
        setEmail(user?.email);
        setIsAuthenticatorEnabled(user?.isAuthenticatorEnabled);
      }
    };

    params.id && fetchUser(params.id);
  }, [params]);

  useEffect(() => {
    if (isAuthenticatorEnabled) {
      router.push("/login");
    }
  }, [isAuthenticatorEnabled, router]);

  return (
    <>
      <main className="flex flex-row justify-center items-center h-dvh gap-5 flex-wrap">
        {/* <Image
          src={bgImage}
          alt={"background-image"}
          fill={true}
          style={{ width: "100%", objectFit: "cover" }}
          priority
          className="blur-sm brightness-50 fixed"
        /> */}
        {email && (
          <Register2FAForm
            handleVerify={handleVerify}
            handleRedirectToLogin={handleRedirectToLogin}
            email={email}
            userId={params?.id}
          />
        )}
      </main>
    </>
  );
}

export default MFAAuthenticatePage;
