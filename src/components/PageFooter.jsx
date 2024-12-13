import { FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { TbWorldWww } from "react-icons/tb";
import { MdEmail } from "react-icons/md";
import { FaFax } from "react-icons/fa6";
import { BsFillTelephoneOutboundFill } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";

import Image from "next/image";
import Link from "next/link";

import ubFooterImage from "@/../public/ub-logo.png";
import gwFooterImage from "@/../public/gw-footer.webp";
import msSilverFooterImage from "@/../public/ms-silver-footer.webp";
import cyberGrxFooterImage from "@/../public/cybergrx-footer.webp";

const PageFooter = () => {
  return (
    <footer className="absolute bottom-0 z-50 bg-indigo-50 w-full h-[4.8rem] flex gap-4 justify-center flex-wrap"></footer>
  );
};

export default PageFooter;
