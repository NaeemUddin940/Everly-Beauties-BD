"use client";

import { CartItemComponent } from "@/components/cart/cart-item";
import { useCart } from "@/components/context/cart-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { items, total, itemCount, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  const subtotal = total;
  const shipping = subtotal > 500 ? 0 : 60;
  const tax = subtotal * 0.08;
  const couponDiscount = appliedCoupon
    ? (subtotal * appliedCoupon.discount) / 100
    : 0;
  const finalTotal = subtotal + shipping + tax - couponDiscount;

  // Function to handle applying the coupon code
  const handleApplyCoupon = () => {
    const validCoupons = {
      SAVE10: 10,
      WELCOME15: 15,
      BEAUTY20: 20,
    };

    if (validCoupons[couponCode as keyof typeof validCoupons]) {
      setAppliedCoupon({
        code: couponCode,
        discount: validCoupons[couponCode as keyof typeof validCoupons],
      });
      setCouponCode("");
    } else {
      alert("Invalid coupon code");
    }
  };

  // Function to handle removing the applied coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  if (items.length === 0) {
    return (
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven&apos;t added any items to your cart yet.
          </p>
          <Link href="/products">
            <Button className="bg-pink-500 hover:bg-pink-600 cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Your Shopping Cart
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items Section */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-pink-500 text-white px-6 py-4">
              <h2 className="text-xl font-semibold">
                {itemCount} {itemCount === 1 ? "Item" : "Items"} in Your Cart
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {items.map((item, index) => (
                <CartItemComponent
                  key={`${item.id}-${item.variation?.id || "default"}-${index}`}
                  item={item}
                />
              ))}
            </div>

            <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <Link href="/products">
                <Button
                  variant="ghost"
                  className="text-pink-500 hover:text-pink-600 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-gray-800 hover:bg-gray-100 cursor-pointer"
              >
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Coupon Code */}
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Have a coupon code?
            </h3>
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
                <div>
                  <span className="text-green-800 font-medium">
                    Coupon &quot;{appliedCoupon.code}&quot; applied!
                  </span>
                  <span className="text-green-600 ml-2">
                    ({appliedCoupon.discount}% off)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveCoupon}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="grow border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
                <Button
                  onClick={handleApplyCoupon}
                  disabled={!couponCode.trim()}
                  className="bg-pink-500 ml-4 hover:bg-pink-600 text-white px-6 py-2 rounded-r cursor-pointer"
                >
                  Apply
                </Button>
              </div>
            )}
            <div className="mt-2 text-sm text-gray-500">
              Try: SAVE10, WELCOME15, or BEAUTY20
            </div>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
            <div className="bg-pink-500 text-white px-6 py-4">
              <h2 className="text-xl font-semibold">Order Summary</h2>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">৳ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `৳ ${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">৳ {tax.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount ({appliedCoupon.discount}%)</span>
                    <span>-৳ {couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>৳ {finalTotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/checkout">
                  <button className="w-full cursor-pointer bg-pink-500 hover:bg-pink-600 text-white py-3 px-4 rounded-lg font-medium transition duration-300">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
              <div className="mt-4 text-center text-sm text-gray-500">
                <p>or</p>
                <Link href="/products">
                  <Button
                    variant="link"
                    className="mt-2 cursor-pointer text-pink-500 hover:text-pink-600 font-medium"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
