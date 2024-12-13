import React, { useEffect, useState } from "react";

const ColorPicker = ({ label, name, value }) => {
  const [color, setColor] = useState();

  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  useEffect(() => {
    if (value) {
      setColor(value);
    }
  }, [value]);

  return (
    <div className="flex flex-col">
      <label className="text-sm mb-1 text-zinc-600" htmlFor={name}>
        {label} :{" "}
      </label>
      <div className="flex items-center gap-2">
        <input
          className="border-2 border-zinc-500 rounded-md outline-none w-14 h-10 p-1 cursor-pointer"
          type="color"
          name={name}
          defaultValue={color}
          onChange={handleColorChange}
        />
        <input
          className="border-2 border-zinc-500 rounded-md outline-none w-[200px] p-1 pl-4 font-mono text-zinc-900 text-sm focus:border-red-500"
          type="text"
          name={name + "-hexColor"}
          defaultValue={color}
          onChange={handleColorChange}
        />
      </div>
    </div>
  );
};

export default ColorPicker;
