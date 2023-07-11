interface ModalProps {
  children: React.ReactNode;
  onClose?: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  onClose,
}: ModalProps) => {
  return (
    <>
      <div
        className='hidden md:block fixed top-0 left-0 w-full h-full opactiy-0 border'
        onClick={onClose}
      />

      <div
        className={`fixed md:absolute h-full w-full inset-0 md:top-9 bg-black bg-opacity-50 flex md:block items-center justify-center z-[1000]`}
      >
        <div className='md:hidden'>
          <div
            className='fixed top-0 left-0 w-full h-full opactiy-0 z-[999]'
            onClick={onClose}
          />
        </div>

        <div className='z-[1000]'>{children}</div>
      </div>
    </>
  );
};
