import ChangePasswordForm from "@/components/form/changePassword/ChangePasswordForm";
import Image from "next/image";
import bgImage from "@/../public/background.jpg";

const changePasswordPage = ({ params }) => {
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

      <ChangePasswordForm code={params.code} />
    </main>
  );
};

export default changePasswordPage;
