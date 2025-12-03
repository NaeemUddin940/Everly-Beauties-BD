"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useCart, type CartItem } from "../context/cart-context";
import { Button } from "../product/custom-button";
import { api } from "@/lib/axios";

// Define the props for the CartItem component
interface CartItemProps {
  item: CartItem;
}

export function CartItemComponent({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(item.id, item.variation?.id);
      toast.success("Cart updated");
    } else {
      updateQuantity(item.id, newQuantity, item.variation?.id);
      toast.success("Cart updated");
    }
  };

  // Handle remove confirmation
  const handleRemove = () => {
    removeItem(item.id, item.variation?.id);
    toast.success(`Removed from cart`);
  };

  return (
    <div className="p-6 flex flex-col sm:flex-row gap-4">
      {/* Product Image and Link */}
      <Link href={`/products/${item.slug}`}>
        <Image
          src={api +  item?.image}
          alt={item?.title}
          width={100}
          height={100}
          unoptimized
          className="w-24 h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
        />
      </Link>

      <div className="grow">
        {/* Product Title and Brand */}
        <Link
          href={`/products/${item.slug}`}
          className="hover:text-pink-600 transition-colors"
        >
          <h3 className="text-lg font-medium text-gray-800">{item.title}</h3>
        </Link>
        {item.brand && <p className="text-gray-600">{item.brand}</p>}
        {item.variation && (
          <p className="text-gray-600">
            {item.variation.name}: {item.variation.value}
          </p>
        )}

        <div className="mt-2 flex items-center">
          {/* Quantity Controls */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="text-gray-500 cursor-pointer hover:text-pink-500 p-1"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="mx-2 text-gray-700 min-w-8 text-center">
            {item.quantity}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="text-gray-500 cursor-pointer hover:text-pink-500 p-1"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <div className="text-right">
          <span className="text-lg font-semibold text-gray-800">
            ৳ {(item.price * item.quantity).toFixed(2)}
          </span>
          {item.regularPrice && item.regularPrice > item.price && (
            <div className="text-sm text-gray-500 line-through">
              ৳ {(item.regularPrice * item.quantity).toFixed(2)}
            </div>
          )}
        </div>
        {/* Remove Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          className="mt-2 text-red-500 cursor-pointer hover:text-red-700 text-sm"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Remove
        </Button>
      </div>
    </div>
  );
}
