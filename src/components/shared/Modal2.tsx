// src/components/ui/Modal.tsx
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
  <div
    ref={overlayRef}
    onClick={(e) =>
      e.target === overlayRef.current && onClose()
    }
    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-3 backdrop-blur-sm sm:p-5"
  >
    <div
      className="flex max-h-[90dvh] w-full max-w-md flex-col overflow-hidden rounded-lg bg-white text-gray-900 shadow-xl animate-fadeIn"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
        <h2 className="min-w-0 wrap-break-word text-lg font-semibold">
          {title}
        </h2>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="shrink-0 rounded-lg p-2 transition-colors hover:bg-gray-100"
        >
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        {children}
      </div>
    </div>
  </div>
);

  // return (
  //   <div
  //     ref={overlayRef}
  //     onClick={(e) => e.target === overlayRef.current && onClose()}
  //     className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
  //   >
  //     // ✅ After — forces dark text inside all modals
  //       <div className="bg-white text-gray-900 rounded-lg shadow-xl w-full max-w-md mx-4 animate-fadeIn">

  //       {/* Header */}
  //       <div className="flex items-center justify-between px-6 py-4 border-b">
  //         <h2 className="text-lg font-semibold">{title}</h2>
  //         <button
  //           onClick={onClose}
  //           className="p-1 rounded hover:bg-gray-100"
  //         >
  //           <X size={18} />
  //         </button>
  //       </div>

  //       {/* Body */}
  //       <div className="px-6 py-4">{children}</div>
  //     </div>
  //   </div>
  // );
}
