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
  width = "w-[500px]",
  height = "h-[350px]"
} : AutoScrollModalProps    ) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  // const [scrollSpeed, setScrollSpeed] = useState(0.25);

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
    <div className="relative w-full h-full">

      {/* PHOTO — now receives mouse events */}
      <img
        src={photo}
        className="w-full h-full object-cover rounded-xl relative "
        onMouseEnter={() => setAutoScroll(false)}
        onMouseLeave={() => setAutoScroll(true)}
      />

      {/* OVERLAY — lower z-index so photo is interactive */}
      <div className="absolute inset-0 bg-black/30 flex justify-center items-center p-4 z-10">

        {/* MODAL — also stops scroll on hover */}
        <div
          ref={contentRef}
          className={`${width} ${height}  backdrop-blur-md p-4 rounded-xl overflow-y-auto no-scrollbar`}
          onMouseEnter={() => setAutoScroll(false)}
          onMouseLeave={() => setAutoScroll(true)}
        >
          {children}
        </div>

      </div>
    </div>
  );
}
