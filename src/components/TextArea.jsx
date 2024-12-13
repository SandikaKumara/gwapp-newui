"use client";

import MandatorySpan from "./MandatorySpan";

const TextArea = ({ label, rows = "3", name, value, required = false }) => {
  return (
    <div className="flex flex-col mb-4">
      <label className="mb-1 text-gray-600" htmlFor="name">
        {label} {required && <MandatorySpan />} :{" "}
      </label>
      <textarea
        className="border border-gray-400 rounded outline-none w-[500px] p-1 pl-4 focus:border-red-500"
        rows={rows}
        name={name}
        defaultValue={value}
      />
    </div>
  );
};

export default TextArea;
