"use client";

import PageFooter from "@/components/PageFooter";
import Spinner from "@/components/Spinner";
import { useEffect, useState } from "react";
import { fetchMenuUrl } from "./dashboard";
import { useMessageBox } from "@/providers/MessageProvider";
import { useSession } from "@/providers/SessionProvider";

const DashboardPage = ({ params }) => {
  const [url, setUrl] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const { sessionTenant } = useSession();
  const [mobileUrl, setMobileUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("");

  const showMessage = useMessageBox();

  useEffect(() => {
    const fetchUrl = async () => {
      setFrameLoaded(false); // Set frame loading to false initially
      const result = await fetchMenuUrl(params.id);
      if (result) {
        if (result.type === "success") {
          setUrl(result.message);
        } else {
          showMessage(result.type, result.message);
        }
      }
    };

    fetchUrl();
    setMobileUrl(sessionTenant?.mobileUrl);
  }, [params, sessionTenant, showMessage]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const updateDeviceType = () => setIsMobile(mediaQuery.matches);

    updateDeviceType(); // Set initial state
    mediaQuery.addEventListener("change", updateDeviceType);

    return () => mediaQuery.removeEventListener("change", updateDeviceType);
  }, []);

  useEffect(() => {
    if (url) {
      setFrameLoaded(false); // Reset loading on URL change
      setCurrentUrl(isMobile ? mobileUrl || url.url : url.url);
    }
  }, [isMobile, url, mobileUrl]);

  const handleLoaded = () => {
    setTimeout(() => {
      setFrameLoaded(true);
    }, 3000);
  };

  return (
    <>
      {currentUrl && (
        <div className="w-full h-full flex flex-col pb-2 relative z-10 duration-300 transition-all ease-in-out bg-indigo-50">
          <iframe
            src={currentUrl}
            className="w-full h-full duration-500 transition-all ease-in-out bg-indigo-50"
            onLoad={handleLoaded}
          ></iframe>

          {!frameLoaded && <Spinner />}
          <PageFooter />
        </div>
      )}
    </>
  );
};

export default DashboardPage;
