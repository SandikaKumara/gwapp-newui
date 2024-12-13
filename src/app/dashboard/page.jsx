"use client";
import AdminPanel from "@/components/AdminPanel";
import PageFooter from "@/components/PageFooter";
import Spinner from "@/components/Spinner";
import { useMessageBox } from "@/providers/MessageProvider";
import { useSession } from "@/providers/SessionProvider";

import React, { useEffect, useState } from "react";
import { getMessage } from "./homePageActions";
import Dashboard from "@/components/Dashboard";

export default function HomePage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [homeUrl, setHomeUrl] = useState(null);
  const { sessionTenant, refresh } = useSession();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileUrl, setMobileUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("");

  const [frameLoaded, setFrameLoaded] = useState(false);

  const showMessage = useMessageBox();

  // useEffect(() => {
  //   if (sessionTenant) {
  //     if (sessionTenant.isAdmin !== isAdmin) {
  //       setIsAdmin(sessionTenant.isAdmin);
  //     }
  //     if (sessionTenant.homeUrl !== homeUrl) {
  //       setHomeUrl(sessionTenant.homeUrl);
  //       setFrameLoaded(false);
  //     }
  //   }
  // }, [refresh]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const updateDeviceType = () => setIsMobile(mediaQuery.matches);

    updateDeviceType(); // Set initial state
    mediaQuery.addEventListener("change", updateDeviceType);

    return () => mediaQuery.removeEventListener("change", updateDeviceType);
  }, []);

  useEffect(() => {
    if (homeUrl || mobileUrl) {
      setFrameLoaded(false); // Reset loading on URL change
      setCurrentUrl(isMobile ? mobileUrl || homeUrl : homeUrl);
    } else {
      setFrameLoaded(true); // Reset loading on URL change
      setCurrentUrl(null);
    }
  }, [isMobile, homeUrl, mobileUrl]);

  const handleLoaded = () => {
    setTimeout(() => {
      setFrameLoaded(true);
    }, 4000);
  };

  useEffect(() => {
    setFrameLoaded(false);

    const fetchUrl = () => {
      setHomeUrl(sessionTenant?.homeUrl);
    };

    fetchUrl();
    setMobileUrl(sessionTenant?.mobileUrl);
    setIsAdmin(sessionTenant?.isAdmin);
  }, [sessionTenant?.homeUrl, refresh]);

  return (
    <>
      {currentUrl ? (
        <div className="bg-indigo-500 w-full h-fit flex flex-col relative">
          <iframe
            src={currentUrl}
            className="w-full h-screen bg-indigo-50"
            onLoad={handleLoaded}
          ></iframe>

          {!frameLoaded && <Spinner />}
          <PageFooter />
        </div>
      ) : (
        isAdmin && <Dashboard />
      )}
    </>
  );
}
