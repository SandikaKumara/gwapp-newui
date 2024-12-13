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
    <footer className="absolute -bottom-32 z-0 bg-gray-50 w-full h-52 flex gap-4 justify-center flex-wrap">
      <div className="flex justify-evenly flex-wrap w-full p-4 gap-6">
        <div className="border-zinc-200 border-b-2 w-full md:w-fit md:border-0 text-center pb-3">
          <div className="flex justify-center">
            <Image
              className=""
              src={ubFooterImage}
              alt={"untangle BI footer image"}
              width={200}
              height={40}
            />
          </div>

          <div className="text-xs p-4 text-slate-600 font-sans flex flex-col gap-1">
            <p>
              &copy; 2024{" "}
              <span>
                {" "}
                <Link
                  href={"https://untanglebi.com.au"}
                  target="_blank"
                  className="font-semibold"
                >
                  UntangleBI.com.au
                </Link>
              </span>
            </p>
            <p>All rights reserved.</p>
          </div>

          <div className="flex gap-5 justify-center text-lg text-red-700">
            {/* <FaFacebook /> */}
            <Link
              href={"https://au.linkedin.com/showcase/untanglebi/"}
              target="_blank"
            >
              <FaLinkedin />
            </Link>
            {/* <FaTwitter /> */}
            <Link href={"https://untanglebi.com.au"} target="_blank">
              <TbWorldWww />
            </Link>
          </div>
        </div>

        <div className="text-xs font-light flex flex-col gap-1 text-slate-600 pb-3 border-b-2 border-zinc-200 w-full md:w-fit">
          <div className="flex flex-col gap-1">
            <p className="flex gap-2 items-center">
              <BsFillTelephoneOutboundFill /> <span>(03) 9591-2000</span>
            </p>
            <p className="flex gap-2 items-center">
              <FaFax />
              <span>(03) 9591-2020</span>
            </p>

            <p className="flex gap-2 items-center">
              <MdEmail /> <span>info@gatewayict.com.au</span>
            </p>

            <div className="flex items-start gap-2 mt-3">
              <FaLocationDot />
              <div>
                <p>Level 1,</p>
                <p>31 Church Street, Brighton, VIC 3186,</p>
                <p>Australia.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex md:flex-col gap-6 justify-evenly items-center md:items-end w-full md:w-fit">
          <Link href={"https://www.gatewayict.com.au/"} target="_blank">
            <Image src={gwFooterImage} width={100} alt="Gateway Logo" />
          </Link>

          <Image src={msSilverFooterImage} width={100} alt="Microsoft Logo" />

          <Image src={cyberGrxFooterImage} width={80} alt="Cyber GRX Logo" />
        </div>
      </div>
    </footer>
  );
};

export default PageFooter;
