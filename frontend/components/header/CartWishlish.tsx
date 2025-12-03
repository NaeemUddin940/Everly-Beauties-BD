"use client";

import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { BiShoppingBag } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { MdFavoriteBorder } from "react-icons/md";

import { api } from "@/lib/axios";
import { useCart } from "../context/cart-context";
import { Button } from "../product/custom-button";

const CartWishlist = () => {
  const { itemCount, items, updateQuantity, removeItem } = useCart();
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  console.log(items);
  const openCartModal = () => setIsCartModalOpen(true);
  const closeCartModal = () => setIsCartModalOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeCartModal();
      }
    };

    if (isCartModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartModalOpen]);

  const handleQuantityChange = (
    itemId: number,
    newQuantity: number,
    variationId?: string
  ) => {
    if (newQuantity <= 0) {
      removeItem(itemId, variationId);
      toast.success("Item removed from cart");
    } else {
      updateQuantity(itemId, newQuantity, variationId);
      toast.success("Cart updated");
    }
  };

  // Calculate total price
  const totalPrice = items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  return (
    <div className="text-black">
      <div className="flex gap-5 items-center justify-between">
        <Link href="/wishlist" className="text-2xl relative">
          <MdFavoriteBorder />
          <span className="absolute -top-1 -right-1 text-[10px] font-medium w-4 h-4 bg-pink-500 text-white rounded-full flex items-center justify-center">
            0
          </span>
        </Link>

        <button
          onClick={openCartModal}
          className="text-2xl relative cursor-pointer"
        >
          <BiShoppingBag />
          <span className="absolute -top-1 -right-1 text-[10px] font-medium w-4 h-4 bg-pink-500 text-white rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        </button>
      </div>

      {isCartModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div
            ref={modalRef}
            className="w-full sm:w-[400px] h-full bg-white shadow-lg flex flex-col"
          >
            <div className="flex justify-between items-center mb-2 px-4 pt-4">
              <h2 className="text-lg font-medium">My Cart ({itemCount})</h2>
              <button
                onClick={closeCartModal}
                className="text-[#696969] cursor-pointer"
              >
                <IoMdClose size={25} />
              </button>
            </div>
            <div className="divider my-0.5"></div>

            <div className="px-4 overflow-y-auto flex-1">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60%]">
                  <BiShoppingBag size={60} />
                  <p className="mt-2 font-medium text-base">
                    Your cart is empty
                  </p>
                  <Link
                    href="/"
                    onClick={closeCartModal}
                    className="bg-pink-600 mt-5 hover:bg-pink-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    Explore
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id + (item.variation?.id || "")}>
                    <div className="flex gap-4 items-center">
                      <Image
                        src={api + item.image}
                        alt={item.title}
                        width={50}
                        height={50}
                        className="object-cover rounded"
                        unoptimized
                      />
                      <div className="flex-1 text-sm">
                        {item.brand && (
                          <p className="text-[#D49E72]">{item.brand}</p>
                        )}
                        <p className="text-sm font-medium">{item.title}</p>
                        <div className="flex items-center justify-between flex-wrap gap-y-1">
                          <div className="flex gap-2 items-center">
                            <p className="text-pink-500 font-bold text-sm">
                              ৳ {item.price}
                            </p>
                            {item.regularPrice &&
                              item.regularPrice > item.price && (
                                <div className="text-sm text-gray-500 line-through">
                                  ৳ {item.regularPrice.toFixed(2)}
                                </div>
                              )}
                          </div>
                          {item.variation && (
                            <p className="text-gray-600 text-xs">
                              {item.variation.name}: {item.variation.value}
                            </p>
                          )}
                          <div className="flex items-center mt-1 rounded-md">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  item.quantity - 1,
                                  item.variation?.id
                                )
                              }
                              className="text-gray-500 hover:text-pink-500 p-1 cursor-pointer"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="mx-2 text-gray-700 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  item.quantity + 1,
                                  item.variation?.id
                                )
                              }
                              className="text-gray-500 hover:text-pink-500 p-1 cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="divider my-0.5"></div>
                  </div>
                ))
              )}
              {items.length > 0 && (
                <div className="p-4 bg-white mt-10">
                  <div className="mt-3 absolute bottom-0 right-3 md:right-0 p-3 bg-white flex items-center justify-between shadow-lg w-[400px]">
                    <div>
                      <p className="text-gray-500 text-sm">Total</p>
                      <p className="text-black font-bold text-lg">
                        ৳ {totalPrice.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        closeCartModal();
                        router.push("/cart");
                      }}
                      className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      View Cart
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartWishlist;
