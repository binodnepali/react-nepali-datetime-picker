import { useEffect } from "react";

import { useDevice } from "@/hooks/useDevice";
import { useModalPosition } from "@/hooks/useModalPosition";
import { cn } from "@/plugins/twMerge";

export interface ModalProps {
  children?: React.ReactNode;
  className?: string;
  modalClassName?: string;
  desktopOverlayClassName?: string;
  mobileOverlayClassName?: string;
  modalContentClassName?: string;
  onClose?: () => void;
  style?: React.CSSProperties;
  inputRef?: React.RefObject<HTMLDivElement | null>;
  showModal?: boolean;
  dataAutoId?: string;
}

export const Modal = ({
  children,
  onClose,
  className,
  modalClassName = "",
  desktopOverlayClassName = "",
  mobileOverlayClassName = "",
  modalContentClassName = "",
  style = {},
  inputRef,
  showModal = false,
  dataAutoId,
}: ModalProps) => {
  const { y: modalPositionY, x: modalPositionX } = useModalPosition({
    ref: inputRef,
    showModal,
  });

  const { isMobile } = useDevice();

  const handleOnClose = () => {
    if (isMobile) {
      document.body.style.overflow = "auto";
    }
    onClose?.();
  };

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      if (!isMobile) {
        return;
      }

      document.body.style.overflow = "auto";
    };
  }, [isMobile, showModal]);

  return (
    <div className={className} data-auto-id={dataAutoId}>
      <div
        className={cn(
          "nedt:hidden nedt:md:block nedt:w-full nedt:h-full nedt:fixed nedt:inset-0 nedt:opactiy-0 ",
          desktopOverlayClassName,
        )}
        onClick={handleOnClose}
      />

      <div
        className={cn(
          "nedt:fixed nedt:md:absolute nedt:h-full nedt:w-full nedt:md:h-fit nedt:md:w-fit nedt:inset-0 nedt:bg-black nedt:bg-opacity-50 nedt:md:bg-opacity-0 nedt:flex nedt:md:block nedt:items-center nedt:justify-center nedt:z-[1000] nedt:transition-transform nedt:duration-300",
          !showModal && "nedt:transform-none",
          modalClassName,
        )}
        style={{
          transform: `translate3d(${modalPositionX}px, ${modalPositionY}px, 0)`,
          ...style,
        }}
      >
        <div
          className={cn(
            "nedt:fixed nedt:md:hidden nedt:top-0 nedt:left-0 nedt:w-full nedt:h-full nedt:opactiy-0 nedt:z-[999]",
            mobileOverlayClassName,
          )}
          onClick={handleOnClose}
        />

        <div className={cn("nedt:z-[1000]", modalContentClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
};
