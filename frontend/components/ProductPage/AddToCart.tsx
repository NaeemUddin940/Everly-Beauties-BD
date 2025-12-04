"use client";

import toast from "react-hot-toast";
import { useCart } from "../context/cart-context";

const AddToCart = ({ product }: { product: any }) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product?.id,
      slug: product?.slug,
      image: product?.productImage,
      title: product?.name,
      brand: product?.brand,
      price: Number(product?.salePrice),
      regularPrice: Number(product?.regularPrice),
      variation: product?.variation || null,
    });
    toast.success("Product added to cart successfully");
  };

  return (
    <div className="mb-8">
      <button
        onClick={handleAddToCart}
        className="cursor-pointer w-full bg-primary text-white py-4 px-6 rounded-lg hover:bg-opacity-90 transition duration-200 font-bold mb-3 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        Add to Cart
      </button>
    </div>
  );
};

export default AddToCart;
