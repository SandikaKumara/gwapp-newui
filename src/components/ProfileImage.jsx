import React from "react";

function ProfileImage({ name = "User" }) {
  const firstLetter = name.charAt(0).toUpperCase();

  const generateColorFromName = (name) => {
    const hash = Array.from(name).reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0
    );
    const r = (hash % 56) + 200;
    const g = ((hash >> 2) % 56) + 200;
    const b = ((hash >> 4) % 56) + 200;
    return `rgb(${r}, ${g}, ${b})`;
  };

  const bgColor = generateColorFromName(name);
  return (
    <div
      className="w-full h-full rounded-full flex justify-center items-center border-2 border-zinc-900"
      style={{ backgroundColor: bgColor }}
    >
      <span className="font-extrabold text-3xl text-gray-600">
        {firstLetter}
      </span>
    </div>
  );
}

export default ProfileImage;
