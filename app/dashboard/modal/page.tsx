"use client";

import { BsCartPlus } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { IoBagAddOutline } from "react-icons/io5";
import { LiaHandScissors } from "react-icons/lia";

export default function Modal() {
  return (
    <div className="fixed bottom-14 left-0 w-full flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50 p-4">
      <div className="flex justify-between bg-luminiBrandBlue rounded-lg shadow-lg p-3 w-full text-pink-600">
        <button className="flex flex-col items-center justify-center w-16 h-16 rounded-md bg-darkBrandBlue">
          <IoBagAddOutline className="w-8 h-8" />
          <p className="text-xs">producto</p>
        </button>

        <button className="flex flex-col items-center justify-center w-16 h-16 rounded-md bg-darkBrandBlue">
          <BsCartPlus className="w-8 h-8" />
          <p className="text-xs">tienda</p>
        </button>

        <button className="flex flex-col items-center justify-center w-16 h-16 rounded-md bg-darkBrandBlue">
          <LiaHandScissors className="w-8 h-8" />
          <p className="text-xs">servicio</p>
        </button>

        <button className="flex flex-col items-center justify-center w-16 h-16 rounded-md bg-darkBrandBlue">
          <IoMdClose className="w-8 h-8" />{" "}
          <p className="text-xs">cerrar</p>
          {/* 👈 uso IoMdClose que se ve más balanceado */}
        </button>
      </div>
    </div>
  );
}
