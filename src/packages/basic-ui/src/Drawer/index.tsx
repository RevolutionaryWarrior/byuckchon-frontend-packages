import React, { useEffect, useRef, useState } from "react";

type DrawerProps = {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
  onExit: () => void;
  radiusClassName?: string;
  variant?: "left" | "right";
  width?: string;
  enableDragClose?: boolean;
  transitionDuration?: number;
};
export default function Drawer({
  isOpen,
  onClose,
  onExit,
  children,
  radiusClassName = "",
  variant = "left",
  width = "80vw",
  enableDragClose = true,
  transitionDuration = 0.5,
}: DrawerProps) {
  const [transitionEnabled, setTransitionEnabled] = useState<boolean>(false);

  const drawerRef = useRef<HTMLDivElement>(null);

  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragDelta, setDragDelta] = useState<number>(0);

  const [gesture, setGesture] = useState<"none" | "horizontal" | "vertical">(
    "none"
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setTransitionEnabled(true));
    } else {
      setTransitionEnabled(true);
    }
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enableDragClose) return;

    const touch = e.touches[0];
    setDragStartX(touch.clientX);
    setDragStartY(touch.clientY);
    setDragDelta(0);
    setGesture("none");
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!enableDragClose || dragStartX === null || dragStartY === null) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStartX;
    const deltaY = touch.clientY - dragStartY;

    if (gesture === "none") {
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
        setGesture("vertical");
      } else if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        setGesture("horizontal");
      } else {
        return;
      }
    }

    if (gesture === "vertical") return;

    e.preventDefault();

    if (variant === "left") {
      setDragDelta(Math.min(deltaX, 0));
    } else {
      setDragDelta(Math.max(deltaX, 0));
    }
  };

  const handleTouchEnd = () => {
    if (gesture !== "horizontal") {
      setGesture("none");
      return;
    }

    const threshold = 60;

    if (
      (variant === "left" && dragDelta < -threshold) ||
      (variant === "right" && dragDelta > threshold)
    ) {
      onClose();
    }

    setGesture("none");
    setDragStartX(null);
    setDragStartY(null);
    setDragDelta(0);
  };

  const getTransform = () => {
    if (gesture === "horizontal") {
      return `translateX(${dragDelta}px)`;
    }

    if (!transitionEnabled || !isOpen) {
      return variant === "left" ? "translateX(-100%)" : "translateX(100%)";
    }

    return "translateX(0)";
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (!drawerRef.current) return;
    if (!drawerRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999]"
      onClick={handleBackdropClick}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={drawerRef}
        className={`
          pointer-events-auto fixed top-0 bottom-0 bg-white shadow-xl
          flex flex-col
          ${radiusClassName}
        `}
        style={{
          width,
          left: variant === "left" ? 0 : undefined,
          right: variant === "right" ? 0 : undefined,
          transform: getTransform(),
          transition:
            transitionEnabled && gesture !== "horizontal"
              ? `transform ${transitionDuration}s cubic-bezier(0.25, 0.8, 0.25, 1)`
              : "none",
        }}
        onTransitionEnd={() => {
          if (!isOpen) {
            onExit();
            setTransitionEnabled(false);
          }
        }}
        onTouchStart={handleTouchStart}
      >
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}
