import React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const AuthModal = ({ isOpen, onClose, children }: Props) => {
  if (!isOpen) return null;

 return (
  <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-5">
    <div
      className="relative my-auto max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-4 shadow-xl sm:p-6"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close authentication modal"
        className="absolute right-3 top-3 rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
      >
        ✕
      </button>

      {/* Authentication Content */}
      <div className="min-w-0 pt-5">
        {children}
      </div>
    </div>
  </div>
);
};

export default AuthModal;