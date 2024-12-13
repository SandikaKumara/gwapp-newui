import LoginForm from "@/components/form/login/LoginForm";
import Image from "next/image";
import bgImage from "@/../public/background.jpg";

// import Link from "next/link";

const Login = () => {
  return (
    <main className="flex flex-row justify-center items-center h-dvh gap-5 flex-wrap relative">
      {/* background image */}
      {/* <Image
        src={bgImage}
        alt={"background-image"}
        fill={true}
        style={{ width: "100%", objectFit: "cover" }}
        priority
        className="blur-sm brightness-50 fixed"
      /> */}
      <LoginForm />
    </main>
  );
};

export default Login;
