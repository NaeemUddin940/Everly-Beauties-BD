"use client";
import ProductListSkeleton from "@/components/Skeleton/ProductListSkeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/lib/axios";
import { exportProducts } from "@/lib/exportProducts";
import { useBrandStore } from "@/ZustandStore/useBrandStore";
import { useCategoryStore } from "@/ZustandStore/useCategoryStore";
import { useSimpleProductStore } from "@/ZustandStore/useSimpleProductStore";
import { useVariableProduct } from "@/ZustandStore/useVariableProduct";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react"; // 👈 useState and useMemo imported

export default function ShowAllProducts() {
  const {
    getAllSimpleProduct,
    isLoading,
    allSimpleProduct,
    deleteSimpleProduct,
  } = useSimpleProductStore();

  const { getAllCategory, getCategory } = useCategoryStore();
  const { getVariableProduct, variableProducts } = useVariableProduct();
  const { allBrands, getAllBrands } = useBrandStore();
  console.log("variableProducts", variableProducts);
  // --- 1. 🔍 FILTER STATE ---
  const [filterOptions, setFilterOptions] = useState({
    category: "All Categories",
    brand: "All Brands",
    type: "All Types",
    status: "All Status",
    stock: "All Stock",
    search: "",
  });

  // --- 2. 📝 HANDLER FUNCTION ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- 3. 🧠 FILTERING LOGIC (useMemo for efficiency) ---
  const filteredProducts = useMemo(() => {
    if (!allSimpleProduct?.simpleProducts) return [];

    const products = allSimpleProduct.simpleProducts;
    const { category, brand, type, status, stock, search } = filterOptions;

    // Convert all products to simple, consistent structure before filtering
    return products.filter((product) => {
      // 3.1. Category Filter
      if (category !== "All Categories" && product.category !== category) {
        return false;
      }

      // 3.2. Brand Filter
      if (brand !== "All Brands" && product.brand !== brand) {
        return false;
      }

      // 3.3. Type Filter (Assuming all are 'Simple' for now, modify if variable/combo are added)
      if (type !== "All Types" && type !== "Simple") {
        return false; // Since this page only loads simple products
      }

      // 3.4. Status Filter
      if (status !== "All Status") {
        const isActive = product.isActive ? "Active" : "Inactive";
        if (isActive !== status) {
          return false;
        }
      }

      // 3.5. Stock Filter
      if (stock !== "All Stock") {
        let stockStatus;
        if (product.stockQuantity > 10) {
          stockStatus = "In Stock";
        } else if (product.stockQuantity > 0) {
          stockStatus = "Low Stock";
        } else {
          stockStatus = "Out of Stock";
        }

        if (
          stockStatus.toLowerCase().replace(/\s/g, "") !==
          stock.toLowerCase().replace(/\s/g, "")
        ) {
          return false;
        }
      }

      // 3.6. Search Filter (by name or SKU)
      if (search) {
        const lowerSearch = search.toLowerCase();
        if (
          !product.name.toLowerCase().includes(lowerSearch) &&
          !product.sku.toLowerCase().includes(lowerSearch)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [allSimpleProduct, filterOptions]); // Re-run only when products or filters change

  useEffect(() => {
    // ⚠️ Note: Fetching 1000 products to enable client-side filtering.
    // For large databases, this should be converted to server-side filtering/pagination.
    getAllSimpleProduct(1000);
    getAllCategory();
    getAllBrands();
    getVariableProduct();
  }, [getAllSimpleProduct, getAllCategory, getAllBrands, getVariableProduct]);

  return (
    <div>
      <div className=" flex-1 p-2">
        {/* */}
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
                // 📝 Search Handler added
                name="search"
                value={filterOptions.search}
                onChange={handleFilterChange}
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

        {/* */}
        {/* ... (Your existing 'Add New Product' section) ... */}

        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Add New Product</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glassmorphism product-type-card p-6 rounded-2xl shadow-md border border-gray-700 cursor-pointer">
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

            <div className="glassmorphism product-type-card p-6 rounded-2xl shadow-md border border-gray-700 cursor-pointer">
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

            <div className="glassmorphism product-type-card p-6 rounded-2xl shadow-md border border-gray-700 cursor-pointer">
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

        {/* --- Filters (Updated with Handler and State) --- */}
        <div className="glassmorphism p-6 rounded-2xl shadow-md mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Category
              </label>
              <select
                name="category"
                value={filterOptions.category}
                onChange={handleFilterChange}
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
              >
                <option value="All Categories">All Categories</option>
                {getCategory?.categories?.length > 0 &&
                  getCategory.categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Brand
              </label>
              <select
                name="brand"
                value={filterOptions.brand}
                onChange={handleFilterChange}
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
              >
                <option value="All Brands">All Brands</option>
                {allBrands?.brands?.length > 0 &&
                  allBrands.brands.map((brand) => (
                    <option key={brand._id} value={brand.name}>
                      {brand.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Type
              </label>
              <select
                name="type"
                value={filterOptions.type}
                onChange={handleFilterChange}
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
              >
                <option value="All Types">All Types</option>
                <option value="Simple">Simple</option>
                <option value="Variable">Variable</option>
                <option value="Combo">Combo</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Status
              </label>
              <select
                name="status"
                value={filterOptions.status}
                onChange={handleFilterChange}
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
              >
                <option value="All Status">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Stock Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Stock
              </label>
              <select
                name="stock"
                value={filterOptions.stock}
                onChange={handleFilterChange}
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
              >
                <option value="All Stock">All Stock</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* */}
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
                {isLoading ? (
                  [...Array(5)].map((_, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-800 animate-pulse"
                    >
                      {/* Using 10 here to cover all columns */}
                      <ProductListSkeleton count={10} />
                    </tr>
                  ))
                ) : (
                  <>
                    {/* 🚀 Simple Products (Data Rows) - Now using filteredProducts */}
                    {filteredProducts.length > 0
                      ? filteredProducts.map((product) => (
                          <tr
                            key={product._id}
                            className="border-b border-gray-800 hover:bg-gray-800/50 transition-all duration-300"
                          >
                            <td className="py-4 px-2">
                              <input
                                type="checkbox"
                                className="custom-checkbox"
                              />
                            </td>
                            <td className="py-4 px-2 text-left">
                              <Image
                                src={api + product.productImage}
                                alt={product.name}
                                width={100}
                                height={100}
                                className="object-cover h-full w-full rounded-md"
                                unoptimized
                              />
                            </td>
                            <td className="py-4 px-2 text-left">
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
                                <Link
                                  href={`/admin/products/edit-simple-product/${product._id}`}
                                  className="bg-gray-700 cursor-pointer hover:bg-gray-600 px-2 py-1 rounded-lg transition-all duration-300"
                                >
                                  <i className="fas fa-edit text-rose-gold hover:text-pink-500"></i>
                                </Link>
                                <button
                                  onClick={() =>
                                    deleteSimpleProduct(product._id)
                                  }
                                  className="bg-gray-700 cursor-pointer hover:bg-gray-600 px-2 py-1 pb-2 rounded-lg transition-all duration-300"
                                >
                                  <Trash2 className="fas fa-trash text-red-400 hover:text-red-500" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      : !isLoading && (
                          <tr>
                            <td
                              colSpan="10"
                              className="text-center text-gray-400 py-10"
                            >
                              No Products Found matching the filters!
                            </td>
                          </tr>
                        )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
