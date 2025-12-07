"use client";
import ProductListSkeleton from "@/components/Skeleton/ProductListSkeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api, axiosInstance } from "@/lib/axios";
import { exportProducts } from "@/lib/exportProducts";
import { useBrandStore } from "@/ZustandStore/useBrandStore";
import { useCategoryStore } from "@/ZustandStore/useCategoryStore";
import { useSimpleProductStore } from "@/ZustandStore/useSimpleProductStore";
import { useVariableProduct } from "@/ZustandStore/useVariableProduct";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// --- 1. ⚙️ Data Normalization Helper Function ---
// This function standardizes the properties for both product types.
const normalizeProduct = (product) => {
  // Common properties
  const common = {
    _id: product._id,
    name: product.name,
    productImage: product.productImage,
    category: product.category,
    brand: product.brand,
    isActive: product.isActive,
    // Add Link for editing based on type
    editLink:
      product.type === "simple"
        ? `/admin/products/edit-simple-product/${product._id}`
        : `/admin/products/edit-variable-product/${product._id}`,
    // Add delete function name (assuming you'll add deleteVariableProduct)
    deleteAction:
      product.type === "simple"
        ? "deleteSimpleProduct"
        : "deleteVariableProduct",
  };

  if (product.type === "simple") {
    return {
      ...common,
      type: "simple",
      sku: product.sku,
      regularPrice: product.regularPrice,
      salePrice: product.salePrice,
      stockQuantity: product.stockQuantity,
    };
  } else if (product.type === "variable") {
    // Variable Products don't have a single price/stock like Simple ones.
    // We calculate a summary (min/max price, total stock)
    const skus = product.sku || [];
    const minPrice = skus.reduce(
      (min, sku) => Math.min(min, sku.regularPrice),
      Infinity
    );
    const maxPrice = skus.reduce(
      (max, sku) => Math.max(max, sku.regularPrice),
      -Infinity
    );
    const totalStock = skus.reduce(
      (total, sku) => total + sku.stockQuantity,
      0
    );

    return {
      ...common,
      productImage: product.mainImage,
      category: product.categories[0],
      type: "variable",
      // Variable Product uses a summary for the main list view
      sku: product?.skus?.length > 0 ? product.skus[0].sku : "N/A", // Use first SKU for display
      regularPrice: minPrice !== Infinity ? `${minPrice}-${maxPrice}` : "N/A", // Price range
      salePrice: "N/A", // No sale price summary needed for list view
      stockQuantity: totalStock,
    };
  }

  // Fallback for other types like Combo (if implemented later)
  return {
    ...common,
    type: "Unknown",
    sku: "N/A",
    regularPrice: "N/A",
    salePrice: "N/A",
    stockQuantity: 0,
  };
};

export default function ShowAllProducts() {
  const {
    getAllSimpleProduct,
    isLoading: isLoadingSimple, // Renamed to avoid collision
    allSimpleProduct,
    deleteSimpleProduct,
  } = useSimpleProductStore();

  const { getAllCategory, getCategory } = useCategoryStore();
  const [showAllProducts, setShowAllProducts] = useState([]);
  const {
    getVariableProduct,
    variableProducts,
    isLoading: isLoadingVariable, // Renamed to avoid collision
    deleteVariableProduct, // ⚠️ ASSUMING YOU HAVE THIS ACTION IN useVariableProduct
  } = useVariableProduct();

  const { allBrands, getAllBrands } = useBrandStore();

  const isLoading = isLoadingSimple || isLoadingVariable; // Combine loading states

  // --- 1. 🔍 FILTER STATE ---
  const [filterOptions, setFilterOptions] = useState({
    category: "All Categories",
    brand: "All Brands",
    type: "All Types",
    isActive: "All Status",
    stock: "All Stock",
    search: "",
    page: 1,
    limit: 5,
  });

  // --- 2. 📝 HANDLER FUNCTION ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function fetchAllProducts(filters = {}) {
    try {
      // Build query string from filters
      const params = new URLSearchParams({
        ...filters, // category, type, brand, status, stock, search
      }).toString();

      const res = await axiosInstance.get(
        `/products/get-all-products?${params}`
      );
      setShowAllProducts(res.data);

      // Assuming your backend returns { simpleProducts: [...], variableProducts: [...] }
      // Set the data into Zustand stores
      if (res.data.simpleProducts) {
        getAllSimpleProduct(res.data.simpleProducts); // or set in store directly
      }
      if (res.data.variableProducts) {
        getVariableProduct(res.data.variableProducts); // or set in store directly
      }
    } catch (error) {
      console.error("Failed to fetch all products:", error);
    }
  }

  useEffect(() => {
    // --- 1. Define static filters ---

    // --- 2. Call fetchAllProducts with static filters ---
    fetchAllProducts(filterOptions);

    getAllSimpleProduct();
    getVariableProduct(); // Fetch variable products
    getAllCategory();
    getAllBrands();
  }, [
    getAllSimpleProduct,
    getVariableProduct,
    filterOptions,
    getAllCategory,
    getAllBrands,
  ]);

  // Helper for Type Badge styling
  const getTypeBadge = (type) => {
    let style = "";
    let icon = "";
    if (type === "simple") {
      style = "bg-blue-500/20 text-blue-300";
      icon = "fas fa-cube";
    } else if (type === "variable") {
      style = "bg-purple-500/20 text-purple-300";
      icon = "fas fa-palette";
    } else if (type === "combo") {
      style = "bg-green-500/20 text-green-300";
      icon = "fas fa-gift";
    }
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${style}`}
      >
        <i className={`${icon} mr-1`}></i>{" "}
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  // --- Get Edit Link ---
  const getEditLink = (product) => {
    switch (product.type) {
      case "simple":
        return `/admin/products/edit-simple-product/${product._id}`;
      case "variable":
        return `/admin/products/edit-variable-product/${product._id}`;
      case "combo":
        return `/admin/products/edit-combo-product/${product._id}`;
      default:
        return "#";
    }
  };

  // --- Handle Delete Product ---
  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    try {
      let endpoint = "";
      let deleteFunction = null;

      if (product.type === "simple") {
        endpoint = `/simpleProduct/delete-simple-product/${product._id}`;
        deleteFunction = deleteSimpleProduct;
      } else if (product.type === "variable") {
        endpoint = `/variableProduct/delete-variable-product/${product._id}`;
        deleteFunction = deleteVariableProduct;
      } else if (product.type === "combo") {
        endpoint = `/combo/delete-combo/${product._id}`;
      }

      const response = await axiosInstance.delete(endpoint);

      if (response.data.success) {
        // Refresh the product list
        fetchAllProducts(filters);

        // Also update the store if deleteFunction exists
        if (deleteFunction) {
          deleteFunction(product._id);
        }
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  return (
    <div>
      <div className=" flex-1 p-2">
        {/* ... (Your existing header content) ... */}

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

        {/* --- Filters (No change needed here, it uses existing state/handler) --- */}
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
                <option value="simple">Simple</option>
                <option value="variable">Variable</option>
                <option value="Combo">Combo</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Status
              </label>
              <select
                name="isActive"
                value={filterOptions.isActive}
                onChange={handleFilterChange}
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
              >
                <option value="All Status">All Status</option>
                <option value="Active">Active</option>
                <option value="In Active">In Active</option>
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

        {/* --- Product Table (Updated Rendering) --- */}
        <div className="glassmorphism p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">All Products</h2>
            <div className="flex space-x-2">
              <button
                // Pass combined products for export if needed, or update exportProducts
                onClick={() => exportProducts(filteredProducts)}
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl text-sm transition-all duration-300 flex items-center"
              >
                <i className="fas fa-download mr-2"></i> Export
              </button>
              <button
                onClick={() => {
                  getAllSimpleProduct(1000);
                  getVariableProduct(1000);
                }}
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
                    {/* 🚀 Combined Products (Data Rows) - Using filteredProducts */}
                    {showAllProducts?.data?.length > 0
                      ? showAllProducts?.data?.map((product) => (
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
                              {/* Use optional chaining as some variable products might not have an image */}
                              {product.productImage && (
                                <Image
                                  src={api + product.productImage}
                                  alt={product.name}
                                  width={100}
                                  height={100}
                                  className="object-cover h-full w-full rounded-md"
                                  unoptimized
                                />
                              )}
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
                            {/* Type Column: Use the helper function */}
                            <td className="py-4 px-2">
                              {getTypeBadge(product.type)}
                            </td>
                            <td className="py-4 px-2">
                              {product.category || "No Category Found!"}
                            </td>
                            <td className="py-4 px-2">
                              {product.brand || "No Brand Found!"}
                            </td>
                            <td className="py-4 px-2">
                              {/* Price Column: Shows range for Variable, single for Simple */}
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
                                {/* Edit Link: Use the normalized editLink */}
                                <Link
                                  href={getEditLink(product)}
                                  className="bg-gray-700 cursor-pointer hover:bg-gray-600 px-2 py-1 rounded-lg transition-all duration-300"
                                >
                                  <i className="fas fa-edit text-rose-gold hover:text-pink-500"></i>
                                </Link>
                                {/* Delete Button: Use the combined handler */}
                                <button
                                  onClick={() => handleDeleteProduct(product)}
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

              {/* --- Pagination --- */}
              <div className="flex items-center justify-between mt-6">
                {/* Left: Showing info + limit */}
                <div className="flex gap-5 items-center">
                  <p className="text-gray-400 whitespace-nowrap">
                    Showing page {showAllProducts?.pagination?.currentPage} of{" "}
                    {showAllProducts?.pagination?.totalPages} | Total Products:{" "}
                    {showAllProducts?.pagination?.totalDocs}
                  </p>

                  <select
                    value={filterOptions.limit}
                    onChange={(e) =>
                      setFilterOptions((prev) => ({
                        ...prev,
                        limit: parseInt(e.target.value, 10), // make sure it's a number
                        page: 1, // Reset to first page when limit changes
                      }))
                    }
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 w-24"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>

                {/* Right: Pagination buttons */}
                <div className="flex items-center gap-2 ml-auto">
                  {/* Prev Button */}
                  <button
                    disabled={!showAllProducts?.pagination?.hasPrevPage}
                    onClick={() =>
                      setFilterOptions((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                      }))
                    }
                    className="bg-gray-800 hover:bg-gray-700 cursor-pointer disabled:hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-30 rounded-lg transition-all duration-300 w-8 h-8"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>

                  {/* Page Numbers */}
                  {[...Array(showAllProducts?.pagination?.totalPages)].map(
                    (_, index) => {
                      const pageNumber = index + 1;
                      const isActive =
                        pageNumber === showAllProducts?.pagination?.currentPage;

                      return (
                        <button
                          key={pageNumber}
                          onClick={() =>
                            setFilterOptions((prev) => ({
                              ...prev,
                              page: pageNumber,
                            }))
                          }
                          className={`p-2 rounded-lg w-10 transition-all duration-300 cursor-pointer ${
                            isActive
                              ? "bg-rose-gold text-white"
                              : "bg-gray-800 hover:bg-gray-700"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                  )}

                  {/* Next Button */}
                  <button
                    disabled={!showAllProducts?.pagination?.hasNextPage}
                    onClick={() =>
                      setFilterOptions((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                    className="bg-gray-800 hover:bg-gray-700 cursor-pointer disabled:hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-30 w-8 h-8 rounded-lg transition-all duration-300"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
