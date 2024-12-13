"use client";

import MandatorySpan from "./MandatorySpan";

const InputBox = ({
  label,
  type = "text",
  name,
  required = false,
  value,
  isDisabled = false,
  onChange = null,
  accept = null,
  inputRef = null,
}) => {
  return (
    <div className="flex flex-col ">
      <label className="mb-1 text-gray-600" htmlFor="name">
        {label} {required && <MandatorySpan />} :{" "}
      </label>
      <input
        className="border border-gray-400 rounded outline-none min-w-[300px] py-2 px-4 mb-4 text-zinc-900  focus:border-red-500"
        type={type}
        name={name}
        ref={inputRef}
        defaultValue={value}
        disabled={isDisabled}
        onChange={onChange}
        accept={accept}
        style={{ backgroundColor: isDisabled && "lightgray" }}
      />

      {/* Hidden input to capture the value */}
      {isDisabled && <input type="hidden" name={name} defaultValue={value} />}
    </div>
  );
};

export default InputBox;
