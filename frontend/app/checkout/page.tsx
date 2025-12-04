/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import type React from "react";

import { useCart } from "@/components/context/cart-context";
import { Button } from "@/components/product/custom-button";
import { api } from "@/lib/axios";
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Loader2,
  Minus,
  Plus,
  Truck,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface BillingDetails {
  fullName: string;
  email: string;
  country: string;
  streetAddress: string;
  district: string;
  phone: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface OrderData {
  id: string;
  key: string;
  items: any[];
  billingDetails: BillingDetails;
  paymentMethod: string;
  orderNotes: string;
  subtotal: number;
  shipping: number;
  couponDiscount: number;
  total: number;
  appliedCoupon: { code: string; discount: number } | null;
  createdAt: string;
  status: string;
  woocommerceOrderId?: number;
}

interface WooCommerceOrderItem {
  product_id: number;
  quantity: number;
  variation_id?: number;
}

interface WooCommerceOrderData {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  billing: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  line_items: WooCommerceOrderItem[];
  shipping_lines: Array<{
    method_id: string;
    method_title: string;
    total: string;
  }>;
  coupon_lines?: Array<{
    code: string;
    discount: string;
  }>;
  customer_note: string;
}

export default function CheckoutPage() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const router = useRouter();

  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    fullName: "",
    email: "",
    country: "Bangladesh",
    streetAddress: "",
    district: "",
    phone: "",
  });

  const [orderNotes, setOrderNotes] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<OrderData | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  // 64 Districts of Bangladesh
  const bangladeshDistricts = [
    // Dhaka Division
    "Dhaka",
    "Faridpur",
    "Gazipur",
    "Gopalganj",
    "Kishoreganj",
    "Madaripur",
    "Manikganj",
    "Munshiganj",
    "Narayanganj",
    "Narsingdi",
    "Rajbari",
    "Shariatpur",
    "Tangail",

    // Chittagong Division
    "Bandarban",
    "Brahmanbaria",
    "Chandpur",
    "Chittagong",
    "Comilla",
    "Cox's Bazar",
    "Feni",
    "Khagrachhari",
    "Lakshmipur",
    "Noakhali",
    "Rangamati",

    // Rajshahi Division
    "Bogura",
    "Joypurhat",
    "Naogaon",
    "Natore",
    "Nawabganj",
    "Pabna",
    "Rajshahi",
    "Sirajganj",

    // Rangpur Division
    "Dinajpur",
    "Gaibandha",
    "Kurigram",
    "Lalmonirhat",
    "Nilphamari",
    "Panchagarh",
    "Rangpur",
    "Thakurgaon",

    // Khulna Division
    "Bagerhat",
    "Chuadanga",
    "Jessore",
    "Jhenaidah",
    "Khulna",
    "Kushtia",
    "Magura",
    "Meherpur",
    "Narail",
    "Satkhira",

    // Barisal Division
    "Barguna",
    "Barisal",
    "Bhola",
    "Jhalokati",
    "Patuakhali",
    "Pirojpur",

    // Sylhet Division
    "Habiganj",
    "Moulvibazar",
    "Sunamganj",
    "Sylhet",

    // Mymensingh Division
    "Jamalpur",
    "Mymensingh",
    "Netrokona",
    "Sherpur",
  ].sort();

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0 && !orderSuccess) {
      router.push("/cart");
    }
  }, [items.length, router, orderSuccess]);

  // Calculate totals
  const subtotal = total;
  const couponDiscount = appliedCoupon
    ? (subtotal * appliedCoupon.discount) / 100
    : 0;
  const discountedSubtotal = subtotal - couponDiscount;
  const shipping = discountedSubtotal > 500 ? 0 : 70;
  const finalTotal = discountedSubtotal + shipping;

  const paymentMethods: PaymentMethod[] = [
    {
      id: "cod",
      name: "Cash on Delivery",
      description:
        "Pay with cash when your order is delivered to your doorstep.",
      icon: <Truck className="w-5 h-5 text-green-600" />,
    },
    {
      id: "sslcommerz",
      name: "SSLCommerz",
      description:
        "Pay securely online with Credit/Debit Card, Mobile Banking, or Net Banking.",
      icon: <CreditCard className="w-5 h-5 text-blue-600" />,
    },
  ];

  // Generate order ID and key
  const generateOrderId = () => {
    return `EB${Date.now()}`;
  };

  const generateOrderKey = () => {
    return `wc_order_${Math.random()
      .toString(36)
      .substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  };

  // Create WooCommerce order
  const createWooCommerceOrder = async (
    orderData: OrderData
  ): Promise<{
    id: number | null;
    orderKey?: string;
    error?: string;
    errorType?: string;
  }> => {
    try {
      // Split full name into first and last name
      const nameParts = orderData.billingDetails.fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Prepare line items for WooCommerce - simplified structure
      const lineItems: WooCommerceOrderItem[] = orderData.items.map((item) => {
        const lineItem: WooCommerceOrderItem = {
          product_id: item.id,
          quantity: item.quantity,
        };

        // Only add variation_id if it exists and is a valid number
        if (item.variation?.id) {
          const variationId = Number.parseInt(item.variation.id);
          if (!isNaN(variationId) && variationId > 0) {
            lineItem.variation_id = variationId;
          }
        }

        return lineItem;
      });

      // Prepare shipping lines - only if shipping cost > 0
      const shippingLines =
        orderData.shipping > 0
          ? [
              {
                method_id: "flat_rate",
                method_title: "Flat Rate",
                total: orderData.shipping.toFixed(2),
              },
            ]
          : [];

      // Prepare coupon lines - only if coupon is applied
      const couponLines = orderData.appliedCoupon
        ? [
            {
              code: orderData.appliedCoupon.code,
              discount: orderData.couponDiscount.toFixed(2),
            },
          ]
        : [];

      // Prepare WooCommerce order data with exact structure
      const wooOrderData: WooCommerceOrderData = {
        payment_method:
          orderData.paymentMethod === "cod" ? "cod" : "sslcommerz",
        payment_method_title:
          orderData.paymentMethod === "cod" ? "Cash on Delivery" : "SSLCommerz",
        set_paid: false,
        billing: {
          first_name: firstName,
          last_name: lastName,
          address_1: orderData.billingDetails.streetAddress,
          address_2: "",
          city: orderData.billingDetails.district,
          state: orderData.billingDetails.district,
          postcode: "1000",
          country: "BD",
          email: orderData.billingDetails.email || "customer@example.com",
          phone: orderData.billingDetails.phone,
        },
        shipping: {
          first_name: firstName,
          last_name: lastName,
          address_1: orderData.billingDetails.streetAddress,
          address_2: "",
          city: orderData.billingDetails.district,
          state: orderData.billingDetails.district,
          postcode: "1000",
          country: "BD",
        },
        line_items: lineItems,
        shipping_lines: shippingLines,
        customer_note: orderData.orderNotes || "",
      };

      // Only add coupon_lines if there are coupons
      if (couponLines.length > 0) {
        wooOrderData.coupon_lines = couponLines;
      }

      console.log(
        "Creating WooCommerce order with data:",
        JSON.stringify(wooOrderData, null, 2)
      );

      // Make API call to our Next.js API route
      const response = await fetch("/api/woocommerce/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wooOrderData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        console.error("WooCommerce API Error:", result);
        return {
          id: null,
          error: result.message || "Failed to create WooCommerce order",
          errorType: result.error_type || "api_error",
        };
      }

      console.log("WooCommerce order created:", result);
      return {
        id: result.id || null,
        orderKey: result.order_key || null,
      };
    } catch (error) {
      console.error("Error creating WooCommerce order:", error);
      return {
        id: null,
        error:
          error instanceof Error ? error.message : "Network error occurred",
        errorType: "network_error",
      };
    }
  };

  // Handle input changes for billing details
  const handleInputChange = (field: keyof BillingDetails, value: string) => {
    setBillingDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleQuantityChange = (
    itemId: number,
    variationId: string | undefined,
    newQuantity: number
  ) => {
    updateQuantity(itemId, newQuantity, variationId);
  };

  const handleRemoveItem = (
    itemId: number,
    variationId: string | undefined
  ) => {
    removeItem(itemId, variationId);
  };

  // Handle coupon application
  const handleApplyCoupon = () => {
    const validCoupons = {
      SAVE10: 10,
      WELCOME15: 15,
      BEAUTY20: 20,
      CHECKOUT5: 5,
    };

    if (validCoupons[couponCode as keyof typeof validCoupons]) {
      setAppliedCoupon({
        code: couponCode,
        discount: validCoupons[couponCode as keyof typeof validCoupons],
      });
      setCouponCode("");
      setShowCouponForm(false);
    } else {
      alert("Invalid coupon code");
    }
  };

  // Handle removing applied coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  // Validate form before placing order
  const validateForm = () => {
    const required = [
      "fullName",
      "email",
      "streetAddress",
      "district",
      "phone",
    ] as const;

    for (const field of required) {
      if (!billingDetails[field].trim()) {
        alert(
          `Please fill in the ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`
        );
        return false;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(billingDetails.email)) {
      alert("Please enter a valid email address");
      return false;
    }

    if (!agreeToTerms) {
      alert("Please agree to the terms and conditions");
      return false;
    }

    return true;
  };

  // Handle placing the order
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    setOrderError(null);

    try {
      // Generate order details
      const orderId = generateOrderId();
      const orderKey = generateOrderKey();

      // Create order object
      const order: OrderData = {
        id: orderId,
        key: orderKey,
        items: items,
        billingDetails,
        paymentMethod: selectedPayment,
        orderNotes,
        subtotal,
        shipping,
        couponDiscount,
        total: finalTotal,
        appliedCoupon,
        createdAt: new Date().toISOString(),
        status: selectedPayment === "cod" ? "processing" : "pending-payment",
      };

      let woocommerceOrderId: number | null = null;
      let woocommerceError: string | null = null;
      let woocommerceErrorType: string | null = null;

      // Try to create WooCommerce order
      try {
        const wooResult = await createWooCommerceOrder(order);
        woocommerceOrderId = wooResult.id;
        const woocommerceOrderKey = wooResult.orderKey;
        woocommerceError = wooResult.error || null;
        woocommerceErrorType = wooResult.errorType || null;

        if (woocommerceOrderId) {
          order.woocommerceOrderId = woocommerceOrderId;
          // Use the actual WooCommerce order key if available
          if (woocommerceOrderKey) {
            order.key = woocommerceOrderKey;
          }
          console.log(
            `WooCommerce order created with ID: ${woocommerceOrderId}, Key: ${order.key}`
          );
        }
      } catch (wooError) {
        console.error("WooCommerce order creation failed:", wooError);
        woocommerceError =
          wooError instanceof Error ? wooError.message : "Unknown error";
        woocommerceErrorType = "network_error";
      }

      // Handle different scenarios based on payment method and WooCommerce result
      if (selectedPayment === "cod") {
        if (woocommerceError) {
          console.warn(
            "WooCommerce integration failed for COD order:",
            woocommerceError
          );
          order.orderNotes =
            `${order.orderNotes}\n\n[System Note: WooCommerce integration temporarily unavailable - ${woocommerceError}]`.trim();
        }

        // Save order to localStorage
        const existingOrders = JSON.parse(
          localStorage.getItem("orders") || "[]"
        );
        existingOrders.push(order);
        localStorage.setItem("orders", JSON.stringify(existingOrders));

        setPlacedOrder(order);
        setOrderSuccess(true);
        clearCart();

        // If WooCommerce failed, show additional message
        if (woocommerceError && woocommerceErrorType === "permissions") {
          setOrderError(
            "Order placed successfully, but there was an issue with our system integration. Your order will be processed manually. We'll contact you shortly."
          );
        }
      } else if (selectedPayment === "sslcommerz") {
        if (woocommerceError || !woocommerceOrderId) {
          throw new Error(
            `Payment processing unavailable: ${
              woocommerceError || "Failed to create WooCommerce order"
            }. Please try Cash on Delivery or contact support.`
          );
        }

        // Save order to localStorage
        const existingOrders = JSON.parse(
          localStorage.getItem("orders") || "[]"
        );
        existingOrders.push(order);
        localStorage.setItem("orders", JSON.stringify(existingOrders));

        setPlacedOrder(order);
        clearCart();

        setOrderSuccess(true);

        setTimeout(() => {
          window.location.href = `https://everlybeautiesbd.com/checkout/order-pay/${woocommerceOrderId}/?key=${order.key}`;
        }, 2000);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setOrderError(
        error instanceof Error
          ? error.message
          : "Failed to place order. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Success page
  if (orderSuccess && placedOrder) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600">
              Thank you for your order. We'll process it shortly.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Order ID:</span>
                <p className="text-gray-800">
                  {placedOrder.woocommerceOrderId || placedOrder.id}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Total Amount:</span>
                <p className="text-gray-800">
                  ৳ {placedOrder.total.toFixed(2)}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Payment Method:
                </span>
                <p className="text-gray-800">
                  {placedOrder.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : "SSLCommerz"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <p className="text-gray-800 capitalize">
                  {placedOrder.status.replace("-", " ")}
                </p>
              </div>
            </div>
            {placedOrder.woocommerceOrderId ? (
              <div className="mt-4 p-3 bg-green-100 rounded-lg">
                <p className="text-sm text-green-800">
                  ✓ Order successfully created in WooCommerce (ID:{" "}
                  {placedOrder.woocommerceOrderId})
                </p>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Order saved locally. Our team will process it manually and
                  contact you shortly.
                </p>
              </div>
            )}
          </div>

          {/* Show error message if there was a WooCommerce integration issue */}
          {orderError && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">{orderError}</p>
            </div>
          )}

          {placedOrder.paymentMethod === "cod" ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                Your order will be delivered to your address. Please keep the
                exact amount ready for payment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/shop">
                  <Button className="bg-pink-500 hover:bg-pink-600">
                    Continue Shopping
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline">Go to Home</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-blue-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Redirecting to payment gateway...</span>
              </div>
              <p className="text-gray-600">
                You will be redirected to SSLCommerz to complete your payment
                securely.
              </p>
              <p className="text-sm text-gray-500">
                If you're not redirected automatically,{" "}
                <a
                  href={`https://everlybeautiesbd.com/checkout/order-pay/${placedOrder.woocommerceOrderId}/?key=${placedOrder.key}`}
                  className="text-blue-600 hover:underline"
                >
                  click here
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Error Message */}
      {orderError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{orderError}</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Billing Details */}
        <div className="lg:w-7/12">
          {/* Coupon Code */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <p className="text-gray-700">
              Have a coupon?{" "}
              <button
                onClick={() => setShowCouponForm(!showCouponForm)}
                className="text-pink-600 hover:underline"
              >
                Click here to enter your code
              </button>
            </p>

            {showCouponForm && (
              <div className="mt-4">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
                    <div>
                      <span className="text-green-800 font-medium">
                        Coupon "{appliedCoupon.code}" applied!
                      </span>
                      <span className="text-green-600 ml-2">
                        ({appliedCoupon.discount}% off)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveCoupon}
                      className="text-red-500 hover:text-red-700"
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
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      className="grow border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim()}
                      className="bg-pink-500 ml-4 hover:bg-pink-600 text-white px-6 py-2 rounded-r"
                    >
                      Apply
                    </Button>
                  </div>
                )}
                <div className="mt-2 text-sm text-gray-500">
                  Try: SAVE10, WELCOME15, BEAUTY20, or CHECKOUT5
                </div>
              </div>
            )}
          </div>

          {/* Billing Details */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              BILLING DETAILS
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={billingDetails.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={billingDetails.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Country / Region <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value="Bangladesh"
                  readOnly
                  className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Street address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={billingDetails.streetAddress}
                  onChange={(e) =>
                    handleInputChange("streetAddress", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  value={billingDetails.district}
                  onChange={(e) =>
                    handleInputChange("district", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  required
                >
                  <option value="">Select District</option>
                  {bangladeshDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={billingDetails.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="e.g., +8801XXXXXXXXX"
                  required
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              ADDITIONAL INFORMATION
            </h2>

            <div>
              <label className="block text-gray-700 mb-1">
                Order notes (optional)
              </label>
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 h-24"
                placeholder="Notes about your order, e.g. special notes for delivery."
              />
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:w-5/12">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-800 mb-6">YOUR ORDER</h2>

            {/* Product List */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="flex justify-between font-medium text-gray-700 mb-4 text-sm">
                <span>PRODUCT</span>
                <span>SUBTOTAL</span>
              </div>

              {items.map((item, index) => (
                <div
                  key={`${item.id}-${item.variation?.id || "default"}-${index}`}
                  className="flex items-start gap-3 py-4 border-b border-gray-100 last:border-b-0"
                >
                  {/* Product Image */}
                  <div className="shrink-0">
                    <Image
                      src={api + item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={60}
                      height={60}
                      unoptimized
                      className="w-15 h-15 object-cover rounded border border-gray-200"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="grow min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="grow pr-2">
                        <h4 className="text-sm font-medium text-gray-800 leading-tight">
                          {item.title}
                        </h4>
                        {item.brand && (
                          <p className="text-xs text-gray-500 mt-1">
                            {item.brand}
                          </p>
                        )}
                        {item.variation && (
                          <p className="text-xs text-gray-500 mt-1">
                            {item.variation.name}: {item.variation.value}
                          </p>
                        )}

                        {/* Quantity Controls */}
                        <div className="flex items-center mt-2 gap-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.variation?.id,
                                item.quantity - 1
                              )
                            }
                            className="text-gray-500 hover:text-pink-500 w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-sm"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm text-gray-700 min-w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.variation?.id,
                                item.quantity + 1
                              )
                            }
                            className="text-gray-500 hover:text-pink-500 w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-sm"
                          >
                            <Plus className="w-3 h-3" />
                          </button>

                          {/* Remove Button */}
                          <button
                            onClick={() =>
                              handleRemoveItem(item.id, item.variation?.id)
                            }
                            className="text-red-500 hover:text-red-700 w-6 h-6 flex items-center justify-center ml-2"
                            title="Remove item"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right shrink-0">
                        <span className="text-sm font-medium text-gray-800">
                          ৳ {(item.price * item.quantity).toFixed(2)}
                        </span>
                        {item.regularPrice &&
                          item.regularPrice > item.price && (
                            <div className="text-xs text-gray-500 line-through">
                              ৳ {(item.regularPrice * item.quantity).toFixed(2)}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Subtotal</span>
                <span className="text-gray-800 font-medium">
                  ৳ {subtotal.toFixed(2)}
                </span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Coupon Discount ({appliedCoupon.discount}%)</span>
                  <span>-৳ {couponDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Shipping Charge</span>
                <span className="text-gray-800 font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `৳ ${shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                <span>Total</span>
                <span>৳ {finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3 mb-6">
              <h3 className="font-medium text-gray-800">Payment Method</h3>
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedPayment === method.id
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={selectedPayment === method.id}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="mt-1 text-pink-500 focus:ring-pink-500"
                  />
                  <div className="ml-3 grow">
                    <div className="flex items-center gap-2">
                      {method.icon}
                      <span className="font-medium text-sm">{method.name}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {method.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            {/* Privacy Policy */}
            <div className="text-xs text-gray-600 mb-4">
              <p>
                Your personal data will be used to process your order, support
                your experience throughout this website, and for other purposes
                described in our privacy policy.
              </p>
            </div>

            {/* Terms Checkbox */}
            <div className="mb-6">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 rounded text-pink-500 focus:ring-pink-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  I have read and agree to the website terms and conditions.
                </span>
              </label>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing || !agreeToTerms}
              className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition duration-300 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  PROCESSING ORDER...
                </>
              ) : (
                "PLACE ORDER"
              )}
            </button>

            {/* Back to Cart Link */}
            <div className="mt-4 text-center">
              <Link href="/cart">
                <Button
                  variant="link"
                  className="text-pink-500 hover:text-pink-600"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
