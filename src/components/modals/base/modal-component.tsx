import { X } from "lucide-react";
import { ModalComponentProps } from "../../../../types";

export default function ModalComponent({
  open,
  onClose,
  children,
  className,
}: ModalComponentProps) {
  return (
    <div
      // onClick={onClose}
      className={`fixed inset-0 z-50 flex min-h-screen items-center justify-center transition-colors ${
        open ? `backdrop-blur-none ${className || "bg-background/60"}` : "invisible"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`h-auto w-full rounded-xl transition-all sm:max-w-md ${
          open ? "mx-4 scale-100 opacity-100" : "scale-125 opacity-0"
        }`}
      >
        <div className="relative flex justify-center">
          {children}
          <span
            onClick={onClose}
            className="absolute top-6 right-4 cursor-pointer rounded ring-red-600 hover:shadow-md hover:ring-1 hover:ring-inset"
            // className="absolute left-1/2 transform -translate-x-1/2 -top-5 hover:shadow-md cursor-pointer hover:ring-1 ring-primary"
          >
            <X className="hover:text-red-600" />
          </span>
        </div>
      </div>
    </div>
  );
}
