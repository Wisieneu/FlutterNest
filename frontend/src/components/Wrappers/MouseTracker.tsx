import { RefObject, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export interface MouseTrackerProps {
  children: React.ReactNode;
  offset?: { x: number; y: number };
  visible?: boolean;
}

export default function MouseTracker({
  children,
  offset = { x: 0, y: 0 },
  visible,
}: MouseTrackerProps) {
  const element: RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    function handler(event: MouseEvent) {
      if (element.current) {
        const x = event.clientX + offset.x,
          y = event.clientY + offset.y;
        element.current.style.transform = `translate(${x}px, ${y}px)`;
        element.current.style.visibility = "visible";
      }
    }
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  }, [offset.x, offset.y]);

  return createPortal(
    <div
      className={`mouse-tracker pointer-events-none fixed ${visible ? "" : "invisible"}`}
      ref={element}
    >
      {children}
    </div>,
    document.body,
  );
}
