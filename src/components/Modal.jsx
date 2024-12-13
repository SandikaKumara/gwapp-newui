// components/Modal.js
import { useEffect } from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Disable background scroll
    } else {
      document.body.style.overflow = "unset"; // Enable background scroll
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-[9999]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded p-6 shadow-lg w-1/3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* <h2 className="text-xl font-bold">Modal Title</h2>
        <p className="mt-4">This is your modal content.</p> */}
        <h2 className="text-2xl font-bold text-blue-700 text-center">
          {title}
        </h2>
        <p className="mt-4">{children}</p>
        <div className="text-right">
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-300 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
