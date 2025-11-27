"use client";
import ProductListSkeleton from "@/components/Skeleton/ProductListSkeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/lib/axios";
import { exportProducts } from "@/lib/exportProducts";
import { useSimpleProductStore } from "@/ZustandStore/useSimpleProductStore";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function ShowAllProducts() {
  const {
    getAllSimpleProduct,
    isLoading,
    allSimpleProduct,
    deleteSimpleProduct,
  } = useSimpleProductStore();

  useEffect(() => {
    getAllSimpleProduct();
  }, [getAllSimpleProduct]);

  return (
    <div>
      <div className=" flex-1 p-2">
        {/* <!-- Top Bar --> */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Product Management
            </h1>
            <p className="text-gray-400">
              Manage your cosmetics products inventory
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
              />
              <i className="fas fa-search absolute bg-red-300 left-3 top-3 text-gray-400"></i>
            </div>
            <div className="relative">
              <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-xl transition-all duration-300">
                <i className="fas fa-bell text-gray-300"></i>
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* <!-- Product Type Selection --> */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Add New Product</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* <!-- Simple Product Card --> */}
            <div
              className="glassmorphism product-type-card p-6 rounded-2xl shadow-md border border-gray-700 cursor-pointer"
              // onclick="window.location.href='simple-product.html'"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-500/20 p-3 rounded-xl">
                  <i className="fas fa-cube text-blue-400 text-xl"></i>
                </div>
                <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full">
                  Simple
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Simple Product
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Single SKU item like a lipstick or foundation with no
                variations.
              </p>
              <Link
                href={"/admin/products/create-simple-product"}
                className="flex items-center text-rose-gold font-medium"
              >
                <span>Create Product</span>
                <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>

            {/* <!-- Variable Product Card --> */}
            <div
              className="glassmorphism product-type-card p-6 rounded-2xl shadow-md border border-gray-700 cursor-pointer"
              // onclick="window.location.href='variable-product.html'"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-purple-500/20 p-3 rounded-xl">
                  <i className="fas fa-palette text-purple-400 text-xl"></i>
                </div>
                <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">
                  Variable
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Variable Product
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Product with options like shades, sizes, or finishes.
              </p>
              <Link
                href={"/admin/products/create-variable-product"}
                className="flex items-center text-rose-gold font-medium"
              >
                <span>Create Product</span>
                <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>

            {/* <!-- Combo Product Card --> */}
            <div
              className="glassmorphism product-type-card p-6 rounded-2xl shadow-md border border-gray-700 cursor-pointer"
              // onclick="window.location.href='combo-product.html'"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-green-500/20 p-3 rounded-xl">
                  <i className="fas fa-gift text-green-400 text-xl"></i>
                </div>
                <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">
                  Combo
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Combo Product
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Bundle of multiple items sold together as a set.
              </p>
              <Link
                href={"/admin/products/create-combo-product"}
                className="flex items-center text-rose-gold font-medium"
              >
                <span>Create Product</span>
                <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* <!-- Filters --> */}
        <div className="glassmorphism p-6 rounded-2xl shadow-md mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Category
              </label>
              <select className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent">
                <option>All Categories</option>
                <option>Lipstick</option>
                <option>Foundation</option>
                <option>Skincare</option>
                <option>Eyeshadow</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Brand
              </label>
              <select className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent">
                <option>All Brands</option>
                <option>Luxe Beauty</option>
                <option>Glamour Cosmetics</option>
                <option>Pure Skin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Type
              </label>
              <select className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent">
                <option>All Types</option>
                <option>Simple</option>
                <option>Variable</option>
                <option>Combo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Status
              </label>
              <select className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Stock
              </label>
              <select className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent">
                <option>All Stock</option>
                <option>In Stock</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* <!-- Products Table --> */}
        <div className="glassmorphism p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">All Products</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => exportProducts(allSimpleProduct)}
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl text-sm transition-all duration-300 flex items-center"
              >
                <i className="fas fa-download mr-2"></i> Export
              </button>
              <button
                onClick={() => getAllSimpleProduct(1000)}
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl text-sm transition-all duration-300 flex items-center"
              >
                <i className="fas fa-sync-alt mr-2"></i> Refresh
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 px-2 text-left w-[50px]">
                    <input type="checkbox" className="custom-checkbox" />
                  </th>
                  <th className="py-3 px-2 text-left w-[75px]">Image</th>
                  <th className="py-3 px-2 text-left w-[220px]">Product</th>
                  <th className="py-3 px-2 text-left w-24">Type</th>
                  <th className="py-3 px-2 text-left w-32">Category</th>
                  <th className="py-3 px-2 text-left w-28">Brand</th>
                  <th className="py-3 px-2 text-left w-28">Price</th>
                  <th className="py-3 px-2 text-left w-24">Stock</th>
                  <th className="py-3 px-2 text-left w-24">Status</th>
                  <th className="py-3 px-2 text-left w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="w-full">
                {/* Skeleton while loading */}
                {isLoading &&
                  allSimpleProduct?.simpleProducts?.map((_, index) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td colSpan="10" className="p-0">
                        <ProductListSkeleton />
                      </td>
                    </tr>
                  ))}

                {/* Simple Products */}
                {!isLoading && allSimpleProduct?.simpleProducts?.length > 0
                  ? allSimpleProduct?.simpleProducts?.map((product) => (
                      <tr
                        key={product._id}
                        className="border-b border-gray-800 hover:bg-gray-800/50 transition-all duration-300"
                      >
                        <td className="py-4 px-2">
                          <input type="checkbox" className="custom-checkbox" />
                        </td>
                        <td className="text-left pr-2">
                          {/* <div className="w-10 h-10 bg-gradient-pink rounded-lg flex items-center justify-center text-white mr-3"> */}
                          <Image
                            src={api + product.productImage}
                            alt={product.name}
                            width={100}
                            height={100}
                            className="object-cover h-full w-full rounded-md"
                            unoptimized
                          />
                          {/* </div> */}
                        </td>
                        <td className="py-4 text-left">
                          <Tooltip>
                            <div className="flex items-center">
                              <div>
                                <TooltipTrigger>
                                  <p className="font-medium line-clamp-1 text-white">
                                    {product.name}
                                  </p>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p> {product.name}</p>
                                </TooltipContent>
                                <p className="text-sm ml-2 text-gray-400">
                                  {product.sku}
                                </p>
                              </div>
                            </div>
                          </Tooltip>
                        </td>
                        <td className="py-4 px-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300">
                            <i className="fas fa-cube mr-1"></i> Simple
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          {product.category || "No Category Found!"}
                        </td>
                        <td className="py-4 px-2">
                          {product.brand || "No Brand Found!"}
                        </td>
                        <td className="py-4 px-2">
                          <p className="font-medium text-white">
                            {product.regularPrice} <span>tk</span>
                          </p>
                          <p className="text-sm text-gray-400 line-through">
                            {product.salePrice}
                            <span> tk</span>
                          </p>
                        </td>
                        <td className="py-4 px-2">
                          <p className="font-medium text-white">
                            {product.stockQuantity}
                          </p>
                          <p
                            className={`text-sm ${
                              product.stockQuantity > 10
                                ? "text-green-400"
                                : product.stockQuantity > 0
                                ? "text-yellow-400"
                                : "text-red-400"
                            }`}
                          >
                            {product.stockQuantity > 10
                              ? "In Stock"
                              : product.stockQuantity > 0
                              ? "Low Stock"
                              : "Out Of Stock"}
                          </p>
                        </td>
                        <td className="py-4 px-2">
                          <span
                            className={`${
                              product.isActive
                                ? "bg-green-500/20 text-green-300"
                                : "bg-red-500/30 text-red-300"
                            } text-xs px-2 py-1 rounded-full`}
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex space-x-2">
                            <button className="bg-gray-700 cursor-pointer hover:bg-gray-600 px-2 py-1 rounded-lg transition-all duration-300">
                              <i className="fas fa-edit text-rose-gold hover:text-pink-500"></i>
                            </button>
                            <button className="bg-gray-700 cursor-pointer hover:bg-gray-600 px-2 py-1 rounded-lg transition-all duration-300">
                              <i className="fas fa-copy text-blue-400 hover:text-blue-500"></i>
                            </button>
                            <button
                              onClick={() => deleteSimpleProduct(product._id)}
                              className="bg-gray-700 cursor-pointer hover:bg-gray-600 px-2 py-1 pb-2 rounded-lg transition-all duration-300"
                            >
                              <Trash2 className="fas fa-trash text-red-400 hover:text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  : !isLoading &&
                    allSimpleProduct.length === 0 && (
                      <tr>
                        <td
                          colSpan="9"
                          className="text-center text-gray-400 py-10"
                        >
                          No Products Found!
                        </td>
                      </tr>
                    )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
