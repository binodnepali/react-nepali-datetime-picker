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
          "ne-dt-hidden md:ne-dt-block ne-dt-w-full ne-dt-h-full ne-dt-fixed ne-dt-inset-0 ne-dt-opactiy-0 ",
          desktopOverlayClassName,
        )}
        onClick={handleOnClose}
      />

      <div
        className={cn(
          "ne-dt-fixed md:ne-dt-absolute ne-dt-h-full ne-dt-w-full md:ne-dt-h-fit md:ne-dt-w-fit ne-dt-inset-0 ne-dt-bg-black ne-dt-bg-opacity-50 md:ne-dt-bg-opacity-0 ne-dt-flex md:ne-dt-block ne-dt-items-center ne-dt-justify-center ne-dt-z-[1000] ne-dt-transition-transform ne-dt-duration-300",
          !showModal && "ne-dt-transform-none",
          modalClassName,
        )}
        style={{
          transform: `translate3d(${modalPositionX}px, ${modalPositionY}px, 0)`,
          ...style,
        }}
      >
        <div
          className={cn(
            "ne-dt-fixed md:ne-dt-hidden ne-dt-top-0 ne-dt-left-0 ne-dt-w-full ne-dt-h-full ne-dt-opactiy-0 ne-dt-z-[999]",
            mobileOverlayClassName,
          )}
          onClick={handleOnClose}
        />

        <div className={cn("ne-dt-z-[1000]", modalContentClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
};
