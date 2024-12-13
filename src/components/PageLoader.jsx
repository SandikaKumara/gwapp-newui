import { AiOutlineLoading3Quarters } from "react-icons/ai";
const PageLoader = () => {
  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-slate-950 opacity-50 translate-x-1 z-[9999] flex justify-center items-center">
      <div className="font-extrabold text-red-50 text-3xl animate-spin">
        <AiOutlineLoading3Quarters />
      </div>
    </div>
  );
};

export default PageLoader;
