import Image from "next/image";
import Link from "next/link";
import bgImage from "@/../public/background.jpg";
import Background from "@/components/Background";

export default function Home() {
  return (
    <main className="flex flex-row justify-center items-center h-fit gap-5 flex-wrap">
      {/* background image */}
      {/* 
      <Image
        src={bgImage}
        alt={"background-image"}
        fill={true}
        style={{ width: "100%", objectFit: "cover" }}
        priority
        className="blur-sm brightness-50"
      /> */}

      <Background />

      <div className="w-full h-screen flex justify-center items-center bg-gradient-to-r from-indigo-800 from-10% via-blue-700 via-35% to-indigo-800 to-90%">
        <div className="w-1/2 text-blue-50 font-sans text-2xl flex flex-col gap-10">
          <h1 className="text-3xl font-bold">Untangle BI - Who we are?</h1>

          <p className="text-justify">
            UntangleBI is an Australian-based company and a subsidiary of
            GatewayICT. We specialize in developing customized dashboards using
            Power BI, transforming data into actionable insights through
            advanced data visualizations and business intelligence (BI)
            solutions. With a deep understanding of data analytics, UntangleBI
            enables businesses to unlock the full potential of their data,
            streamline reporting, and make informed, data-driven decisions.
          </p>

          <p className="text-justify">
            As part of GatewayICT, a leading IT solutions provider (more at
            gatewayict.com.au), we bring a wealth of expertise in technology and
            innovation to every project. For more information about our services
            and solutions, visit{" "}
            <a href="" target="_blank">
              untanglebi.com
            </a>
            .
          </p>

          <p className="text-justify">
            Welcome to UntangleBI! We are excited to have you onboard and look
            forward to helping you harness the power of your data. Whether you
            are new to business intelligence or looking to optimize your current
            analytics, our team is here to support you every step of the way.
          </p>

          <div className="flex justify-end items-end">
            <Link
              className="pr-6 pl-6 pt-2 pb-2 bg-red-500 w-1/4 border border-red-500 rounded-md text-center hover:bg-red-200 hover:text-red-950 font-bold hover:animate-pulse"
              href={"./login"}
            >
              Login
            </Link>
          </div>
        </div>
        {/* left section */}
        {/* <section className="rounded-md border border-slate-200 w-1/4 max-h-fit p-5 min-w-[300px] shadow-md relative text-cyan-50 animate-pulse flex justify-center items-center flex-wrap text-pretty h-fit">
          <p>
            UntangleBI is an Australian-based company and a subsidiary of
            GatewayICT. We specialize in developing customized dashboards using
            Power BI, transforming data into actionable insights through
            advanced data visualizations and business intelligence (BI)
            solutions. With a deep understanding of data analytics, UntangleBI
            enables businesses to unlock the full potential of their data,
            streamline reporting, and make informed, data-driven decisions.
          </p>

          <p>
            As part of GatewayICT, a leading IT solutions provider (more at
            gatewayict.com.au), we bring a wealth of expertise in technology and
            innovation to every project. For more information about our services
            and solutions, visit{" "}
            <a href="" target="_blank">
              untanglebi.com
            </a>
            .
          </p>
        </section> */}

        {/* right section */}
        {/* <section className="rounded-md border border-slate-200 w-1/4 max-h-fit p-5 min-w-[300px] shadow-md relative text-cyan-50 flex flex-col justify-center items-center gap-5 flex-wrap h-fit">
          <p>
            Welcome to UntangleBI! We are excited to have you onboard and look
            forward to helping you harness the power of your data. Whether you
            are new to business intelligence or looking to optimize your current
            analytics, our team is here to support you every step of the way.
          </p>

          <div>
            <Link
              className="pr-6 pl-6 pt-2 pb-2 bg-red-500 w-1/4 border border-red-500 rounded-md text-center hover:bg-red-200 hover:text-red-950 font-bold hover:animate-pulse"
              href={"./login"}
            >
              Login
            </Link>
          </div>
        </section> */}
      </div>
    </main>
  );
}
