import { type ReactNode, useEffect, useRef } from "react";

type DialogProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  onClose: () => void;
  className?: string;
};

export function Dialog({ open, title, children, actions, onClose, className = "" }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [open]);

  // Fecha ao clicar no backdrop (nativo)
  // O evento de click no dialog dispara se clicar no ::backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (dialog && e.target === dialog) {
      onClose();
    }
  };

  return (
    <dialog 
      ref={dialogRef}
      className={`modal ${className}`}
      onClick={handleBackdropClick}
      onClose={onClose} // Captura ESC key nativo
    >
      <h5>{title}</h5>
      <div>{children}</div>
      {actions && (
        <nav className="right-align mt-4">
          {actions}
        </nav>
      )}
    </dialog>
  );
}
