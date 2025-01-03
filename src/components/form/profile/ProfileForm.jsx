"use client";
import InputBox from "@/components/InputBox";
import ProfileImage from "@/components/ProfileImage";
import SaveButton from "@/components/SaveButton";
import TextArea from "@/components/TextArea";
import { updateProfileAction } from "@/dbActions/profile";
import { getUserByIdAction } from "@/dbActions/userActions";
import { useMessageBox } from "@/providers/MessageProvider";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { validateProfileForm } from "./profileFormValidations";
import DefaultProfileImage from "@/../../public/profile-image-placeholder.png";
import { getFile } from "@/lib/files";
import CheckBox from "@/components/CheckBox";
import Switch from "@/components/Switch";
import { confirmToken, generateToken, manualToken } from "@/lib/authenticator";
import LoadingComponent from "@/components/LoadingComponent";
import { useRouter } from "next/navigation";
import { GiConfirmed } from "react-icons/gi";

const ProfileForm = (params) => {
  const [user, setUser] = useState({});
  const [errors, setErrors] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [qrSecret, setQrSecret] = useState();
  const [loading, setLoading] = useState(false);
  const [isQREnabled, setIsQREnabled] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const showMessage = useMessageBox();

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      if (params) {
        const user = await getUserByIdAction(params.id);
        if (user) {
          setUser(user);
          // setImagePreview(user?.logoPath);
        }
      }
    };

    params && fetchUser();
  }, [params.id]);

  useEffect(() => {
    const fetchLogo = async () => {
      if (user?.logoPath) {
        const image = await getFile(user?.logoPath);
        setImagePreview(image?.image);
      }
    };

    user && fetchLogo();
    // user && user?.authenticatorUrl && setQrCode(user?.authenticatorUrl);
    setLoading(false);
    setIsQREnabled(user?.isAuthenticatorEnabled);
    setShowQR(user?.isAuthenticatorEnabled);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("imagePath", imagePreview);

    const validations = await validateProfileForm(formData, params.id);
    setErrors(validations);
    if (validations.length === 0) {
      const result = await updateProfileAction(formData, params.id);
      showMessage(result.type, result.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleAuthenticator = async () => {
    setShowQR(!showQR);
    const res = await generateToken();
    if (res.type === "success") {
      setQrCode(res.qrCodeUrl);
      setQrSecret(res.secret);
      showMessage(res.type, res.message);
    } else {
      setQrCode(null);
      setQrSecret(null);
      showMessage(res.type, res.message);
    }
  };

  const handleQRConfirm = async (formData) => {
    formData.append("authenticatorSecret", qrSecret);
    formData.append("authenticatorUrl", qrCode);

    const result = await confirmToken(formData);
    showMessage(result.type, result.message);
    if (result.type === "success") {
      setQrCode(null);
      setQrSecret(null);
    }
    // manualToken();
  };

  return (
    <>
      {loading && <LoadingComponent />}

      <div className="p-8 flex flex-col items-center gap-3 bg-white ml-6 rounded shadow-md">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <h1 className="font-bold text-xl uppercase mb-4">User Profile</h1>

          {imagePreview ? (
            <Image
              className="h-32 w-32 rounded-full  border border-white"
              src={imagePreview}
              alt="Profile Picture"
              width={100}
              height={100}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="h-32 w-32 rounded-full  border border-white">
              <ProfileImage name={user?.firstName} />
            </div>
          )}

          <InputBox
            label={"Profile Picture"}
            name={"profileImage"}
            onChange={handleImageChange}
            type="file"
          />

          <InputBox
            label={"First Name"}
            name={"firstName"}
            value={user?.firstName}
            required
          />

          <InputBox
            label={"Last Name"}
            name={"lastName"}
            value={user?.lastName}
          />

          <InputBox label={"Email"} value={user?.email} isDisabled={true} />

          <InputBox label={"contact"} name={"contact"} value={user?.contact} />

          <TextArea
            label={"Address"}
            rows="4"
            name={"address"}
            value={user?.address}
          />

          <InputBox label={"Tenant"} value={user.tenant?.name} isDisabled />

          {errors.length > 0 && (
            <div className="text-red-500 text-sm pt-2">
              # Input data validation errors occurred as listed below.
              {errors.map((error, index) => (
                <div className="" key={index}>
                  - {error}
                </div>
              ))}
            </div>
          )}

          <div className="text-right">
            <SaveButton label="Update" />
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfileForm;
