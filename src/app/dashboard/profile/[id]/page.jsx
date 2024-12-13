"use client";
import ProfileForm from "@/components/form/profile/ProfileForm";
import SelfResetPasswordForm from "@/components/form/selfPasswordReset/SelfResetPasswordForm";
import { useState } from "react";
import { RiLockPasswordFill } from "react-icons/ri";

const ProfilePage = ({ params }) => {
  const [showPasswordRest, setShowPasswordReset] = useState(false);

  const handleShowPasswordResetForm = () => {
    setShowPasswordReset(!showPasswordRest);
  };
  return (
    <div className="flex flex-wrap gap-4 py-4">
      {/* user profile section */}
      <div className="flex flex-col gap-4">
        <ProfileForm id={params.id} />

        {!showPasswordRest && (
          <div className="px-6">
            <button
              className="bg-red-500 hover:bg-red-300
   h-fit w-fit text-red-100 px-4 py-2 rounded flex gap-3 items-center shadow-md"
              onClick={handleShowPasswordResetForm}
            >
              <RiLockPasswordFill /> <span>Reset Password</span>
            </button>
          </div>
        )}
      </div>

      {/* self password reset section */}
      {showPasswordRest && (
        <SelfResetPasswordForm
          id={params.id}
          closeAction={handleShowPasswordResetForm}
        />
      )}
    </div>
  );
};

export default ProfilePage;
