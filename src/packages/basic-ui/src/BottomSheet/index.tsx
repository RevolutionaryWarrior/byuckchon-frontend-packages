import { Drawer } from "vaul";
import React, { useState } from "react";

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onExit: () => void;
  children: React.ReactNode;
  className?: string;
  handleIcon?: React.ReactNode;
  snapPoints?: Array<number | string>;
  defaultSnapPoint?: number | string;
};

export default function BottomSheet({
  isOpen,
  onClose,
  onExit,
  children,
  className = "",
  handleIcon,
  snapPoints = [0.3, 0.9],
  defaultSnapPoint = 0.3,
}: BottomSheetProps) {
  const [snap, setSnap] = useState<number | string | null>(defaultSnapPoint);

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      snapPoints={snapPoints}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      modal
    >
      <Drawer.Portal>
        <Drawer.Content
          className={`
            fixed bottom-0 left-0 right-0 z-[10000]
            bg-white border border-gray-200 rounded-t-[10px]
            flex flex-col 
            h-full   
            ${className}
          `}
          onAnimationEnd={() => {
            if (!isOpen) onExit();
          }}
        >
          {/* 핸들 바 */}
          {handleIcon === null ? null : (
            <div
              className="flex justify-center my-2 cursor-grab active:cursor-grabbing"
              data-vaul-drag-handle
            >
              {handleIcon === undefined ? (
                <div className="h-1 w-9 rounded-full bg-[#C4C4C7]" />
              ) : (
                handleIcon
              )}
            </div>
          )}

          <div
            className="px-4 pb-4 flex flex-col w-full mx-auto overflow-y-auto"
            data-vaul-no-drag
          >
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
