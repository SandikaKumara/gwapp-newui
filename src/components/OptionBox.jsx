"use client";

import { useEffect, useState } from "react";
import MandatorySpan from "./MandatorySpan";

const OptionBox = ({
  label,
  name,
  required = false,
  values = [],
  selectedId,
  isDisabled = false,
  onChange = null,
  refresh = null,
}) => {
  // const [items, setItems] = useState([]);
  const [changedId, setChangedId] = useState("0");

  const handleChange = (e) => {
    setChangedId(e.target.value);
    if (onChange && onChange !== null) {
      onChange(e.target.value);
    }
    // onChange(changedId);
  };

  useEffect(() => {
    // setItems(values);
    setChangedId(selectedId);
  }, [values]);

  return (
    <div className="flex flex-col">
      <label className="mb-1 text-zinc-600" htmlFor="name">
        {label} {required && <MandatorySpan />} :{" "}
      </label>
      <select
        className="w-[500px] py-2 px-4 text-zinc-900 border border-gray-400 rounded-md outline-none focus:border-red-500 bg-white"
        name={name}
        value={changedId || "0"}
        onChange={handleChange}
        disabled={isDisabled}
        style={{ backgroundColor: isDisabled && "lightgray" }}
      >
        <option value="0"></option>
        {values.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>

      {/* Hidden input to capture the value */}
      {isDisabled && <input type="hidden" name={name} value={changedId} />}
    </div>
  );
};

export default OptionBox;
