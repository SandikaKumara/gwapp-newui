import Image from "next/image";
import loadingGif from "@/../public/bar.gif";
import ubiLogo from "@/../public/ub-logo.png";

const Spinner = () => {
  return (
    <div className="absolute top-0 left-0 z-0 bg-indigo-50 w-full h-full flex justify-center gap-4 items-center">
      {/* <div
        className="w-4 h-4 rounded-full bg-red-600 animate-ping"
        style={{ animationDelay: "0s" }}
      ></div>
      <div
        className="w-4 h-4 rounded-full bg-green-600 animate-ping"
        style={{ animationDelay: "0.15s" }}
      ></div>
      <div
        className="w-4 h-4 rounded-full bg-blue-600 animate-ping"
        style={{ animationDelay: "0.3s" }}
      ></div>
      <div
        className="w-4 h-4 rounded-full bg-cyan-600 animate-ping"
        style={{ animationDelay: "0.45s" }}
      ></div>
      <div
        className="w-4 h-4 rounded-full bg-orange-600 animate-ping"
        style={{ animationDelay: "0.6s" }}
      ></div> */}
      <div className="flex gap-3 justify-center items-center">
        <Image className="opacity-50" src={ubiLogo} width={150} />
        <Image src={loadingGif} width={80} className="opacity-70" />
      </div>

      {/* <Image src={loadingGif} width={150} height={150} className="opacity-70" /> */}
    </div>
  );
};

export default Spinner;
