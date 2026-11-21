import { useEffect, useRef, useState } from "react";

interface AutoScrollModalProps {
  photo: string;
  children: React.ReactNode;
  scrollSpeed?: number;
  width?: string;
  height?: string;
}


export default function AutoScrollModal({
  photo,
  children,
  scrollSpeed = 0.4,
  width = "lg:w-[650px]",
  height = "lg:h-[420px]"
} : AutoScrollModalProps    ) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto-scroll loop
  useEffect(() => {
    let frame: number;

    const step = () => {
      const modal = contentRef.current;

      if (autoScroll && modal) {
      const maxScrollTop = modal.scrollHeight - modal.clientHeight;

    

      if (modal.scrollTop >= maxScrollTop - 1) {
        modal.scrollTop = 0;
      } else {
        modal.scrollTop += scrollSpeed;
      }
    }

      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [autoScroll, scrollSpeed]);

 

return (
  <div className="relative h-full min-h-0 w-full overflow-hidden">

    {/* PHOTO */}
    <img
      src={photo}
      alt=""
      className="absolute inset-0 h-full w-full rounded-xl object-cover"
      onMouseEnter={() => setAutoScroll(false)}
      onMouseLeave={() => setAutoScroll(true)}
    />

    {/* OVERLAY */}
    <div className="absolute inset-0 z-10 flex items-center justify-center overflow-y-auto bg-black/30 p-3 sm:p-4">

      {/* MODAL */}
      <div
        ref={contentRef}
        className={`${width} ${height} my-auto max-h-[90dvh] max-w-full min-w-0 overflow-x-hidden overflow-y-auto rounded-xl p-4 backdrop-blur-md sm:p-6 no-scrollbar`}
        onMouseEnter={() => setAutoScroll(false)}
        onMouseLeave={() => setAutoScroll(true)}
      >
        {children}
      </div>

    </div>
  </div>
);
}
