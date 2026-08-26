"use client";

import { BsCartPlus } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { IoBagAddOutline } from "react-icons/io5";
import { LiaHandScissors } from "react-icons/lia";
import { useRouter } from "next/navigation";

export default function AddOptionsModal({
  onClose,
  setSidebarOpen,
}: {
  onClose: () => void;
  setSidebarOpen: (open: boolean) => void;
}) {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
    setSidebarOpen(false); // cerrar sidebar
    onClose();             // cerrar modal
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-opacity-70 z-50"
      onClick={onClose} // 👈 click fuera cierra modal
    >
      <div
        className="absolute bottom-14 left-0 w-full flex items-center justify-center backdrop-blur-sm p-4"
        onClick={(e) => e.stopPropagation()} // 👈 evita que el click dentro cierre
      >
        <div className="flex justify-between bg-luminiBrandBlue rounded-lg shadow-lg p-3 w-full max-w-md text-pink-600">
          <button
            onClick={() => handleNavigate("/workspace/product-sale")}
            className="flex flex-col items-center justify-center w-16 h-16 rounded-md bg-darkBrandBlue"
          >
            <IoBagAddOutline className="w-8 h-8" />
            <p className="text-xs">producto</p>
          </button>

          <button
            onClick={() => handleNavigate("/workspace/commercial/market")}
            className="flex flex-col items-center justify-center w-16 h-16 rounded-md bg-darkBrandBlue"
          >
            <BsCartPlus className="w-8 h-8" />
            <p className="text-xs">tienda</p>
          </button>

          <button
            onClick={() => handleNavigate("/workspace/commercial/offerings/add")}
            className="flex flex-col items-center justify-center w-16 h-16 rounded-md bg-darkBrandBlue"
          >
            <LiaHandScissors className="w-8 h-8" />
            <p className="text-xs">servicio</p>
          </button>

          <button
            onClick={onClose}
            className="flex flex-col items-center justify-center w-16 h-16 rounded-md bg-darkBrandBlue"
          >
            <IoMdClose className="w-8 h-8" />
            <p className="text-xs">cerrar</p>
          </button>
        </div>
      </div>
    </div>
  );
}
