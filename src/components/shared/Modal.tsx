import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener(
        'keydown',
        handleEsc
      );
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClass = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  }[size];
  return (
  <div
    ref={overlayRef}
    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 backdrop-blur-sm sm:p-5"
    onClick={(e) =>
      e.target === overlayRef.current && onClose()
    }
  >
    <div
      className={`flex max-h-[90dvh] w-full ${widthClass} flex-col overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
        <h2 className="min-w-0 wrap-break-word text-lg font-semibold text-gray-900">
          {title}
        </h2>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="shrink-0 rounded-lg p-2 transition-colors hover:bg-gray-100"
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {/* Body */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="shrink-0 rounded-b-xl border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6 sm:py-4">
          {footer}
        </div>
      )}
    </div>
  </div>
);

  // return (
  //   <div
  //     ref={overlayRef}
  //     className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
  //     onClick={(e) =>
  //       e.target === overlayRef.current && onClose()
  //     }
  //   >
  //     <div
  //       className={`bg-white rounded-xl shadow-2xl w-full ${widthClass} mx-4 animate-in fade-in zoom-in-95`}
  //     >
  //       {/* Header */}
  //       <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
  //         <h2 className="text-lg font-semibold text-gray-900">
  //           {title}
  //         </h2>
  //         <button
  //           onClick={onClose}
  //           className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
  //         >
  //           <X className="w-5 h-5 text-gray-400" />
  //         </button>
  //       </div>
  //       {/* Body */}
  //       <div className="px-6 py-4">
  //         {children}
  //       </div>
  //       {/* Footer */}
  //       {footer && (
  //         <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
  //           {footer}
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
}
