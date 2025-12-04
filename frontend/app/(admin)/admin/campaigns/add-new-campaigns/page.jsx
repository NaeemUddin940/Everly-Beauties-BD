"use client";

import Image from "next/image";
// প্রয়োজনীয় ইমপোর্টগুলো রাখা হলো
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast"; // assuming toast is available
import { FaTimes } from "react-icons/fa";
import Select from "react-select";

// Discount Options
const discountTypeOptions = [
  { value: "percentage", label: "Percentage Discount" },
  { value: "fixed", label: "Fixed Amount Discount" },
];

// Status Options
const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#1F2937",
    borderColor: state.isFocused ? "#f472b6" : "#374151",
    borderRadius: "0.75rem",
    padding: "0.25rem",
    minHeight: "3rem",
    boxShadow: state.isFocused ? "0 0 0 2px #f472b6" : "none",
    outline: "none",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#F43F5E", // normal red
    cursor: "pointer",
    backgroundColor: "#ffa2a2",
    ":hover": {
      backgroundColor: "#ffa2c6",
      color: "#be123c", // darker red on hover
    },
  }),
  input: (provided) => ({ ...provided, color: "#fff" }),
  placeholder: (provided) => ({ ...provided, color: "#9CA3AF" }),
  singleValue: (provided) => ({ ...provided, color: "#fff" }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? "#374151"
      : state.isSelected
      ? "#F43F5E"
      : "#1F2937",
    color: "#fff",
    paddingLeft: state.data.indent ? "2rem" : "0.75rem",
  }),

  menu: (provided) => ({
    ...provided,
    backgroundColor: "#1F2937",
    borderRadius: "0.75rem",
    zIndex: 9999,
  }),

  // 🔥 MOST IMPORTANT for fixing dropdown clipping
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 99999,
  }),
};

// **********************************************
// DUMMY DATA FOR UI RENDERING (API data removed)
// **********************************************
const DUMMY_CATEGORIES = [
  { _id: "c1", categoryName: "Electronics" },
  { _id: "c2", categoryName: "Apparel" },
  { _id: "c3", categoryName: "Mobiles", parentCategory: "c1" },
  { _id: "c4", categoryName: "T-Shirts", parentCategory: "c2" },
];
const DUMMY_PRODUCTS = [
  {
    _id: "p1",
    productName: "Smartphone X",
    salePrice: 25000,
    mainImage: "https://via.placeholder.com/40?text=P1",
    categories: [{ _id: "c3" }],
  },
  {
    _id: "p2",
    productName: "Summer T-Shirt",
    salePrice: 800,
    mainImage: "https://via.placeholder.com/40?text=P2",
    categories: [{ _id: "c4" }],
  },
  {
    _id: "p3",
    productName: "Laptop Pro",
    salePrice: 75000,
    mainImage: "https://via.placeholder.com/40?text=P3",
    categories: [{ _id: "c1" }],
  },
];
const PRODUCTS_PER_PAGE = 10;
// **********************************************

const AddNewCampaigns = ({ isEditMode = false, campaign = null }) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      campaignName: "",
      discountType: discountTypeOptions[0],
      discountAmount: "",
      status: statusOptions[0],
      startDate: "",
      endDate: "",
      description: "",
      parentCategory: null,
      productDiscounts: {},
      selectedProductChecks: {},
      thumbnailImage: null,
    },
  });

  const discountType = watch("discountType");
  const parentCategory = watch("parentCategory");
  const selectedProductChecks = watch("selectedProductChecks");

  const [searchTerm, setSearchTerm] = useState("");
  // DUMMY PRODUCTS - Start with some for UI testing
  const [selectedProducts, setSelectedProducts] = useState(["p1", "p2"]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const searchRef = useRef(null);
  // const router = useRouter(); // Router removed as navigation is not needed for UI-only
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(
    isEditMode && campaign?.thumbnailImage ? campaign.thumbnailImage : null
  );

  // Replicating category options structure
  const buildCategoryOptions = (categories, parent = null, level = 0) =>
    categories
      ?.filter((cat) => (cat.parentCategory || null) === parent)
      .sort((a, b) => a.categoryName.localeCompare(b.categoryName))
      .flatMap((cat) => [
        {
          value: cat._id,
          label: `${"\u00A0".repeat(level * 4)}${cat.categoryName}`,
        },
        ...buildCategoryOptions(categories, cat._id, level + 1),
      ]);

  const categoryOptions = buildCategoryOptions(DUMMY_CATEGORIES);
  const products = DUMMY_PRODUCTS; // Using dummy products

  // Edit Mode UI Setup (Minimal, based on passed 'campaign' prop)
  useEffect(() => {
    if (isEditMode && campaign) {
      // Minimal reset for UI demo
      reset({
        campaignName: campaign.campaignName || "Edited Campaign Name",
        discountType:
          discountTypeOptions.find(
            (opt) => opt.value === campaign.discountType
          ) || discountTypeOptions[0],
        discountAmount: campaign.discountAmount || "10",
        status:
          statusOptions.find((opt) => opt.value === campaign.status) ||
          statusOptions[0],
        startDate: "2025-12-05T10:00",
        endDate: "2025-12-10T10:00",
        description: campaign.description || "Updated description for UI demo.",
        selectedProductChecks: campaign.selectedProducts?.reduce(
          (acc, id) => ({ ...acc, [id]: true }),
          {}
        ) || { p1: true, p2: true },
        productDiscounts: { p1: 50, p2: 100 },
      });
      setSelectedProducts(campaign.selectedProducts || ["p1", "p2"]);
    }
  }, [isEditMode, campaign, reset]);

  // Suggested products (DUMMY implementation)
  const suggestedProducts = useMemo(() => {
    if (!parentCategory) return [];
    if (!searchTerm) return [];

    return products
      .filter((p) => {
        // Find if any category of the product matches the parentCategory
        const matchesCategory = p.categories?.some(
          (c) => c._id === parentCategory
        );
        const matchesSearch = p.productName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const notSelected = !selectedProducts.includes(p._id);

        return (
          (parentCategory ? matchesCategory : true) &&
          matchesSearch &&
          notSelected
        );
      })
      .slice(0, 5); // Limit suggestions for UI clarity
  }, [products, parentCategory, searchTerm, selectedProducts]);

  // Selected product details
  const selectedProductDetails = useMemo(
    () =>
      selectedProducts
        .map((id) => products.find((p) => p._id === id))
        .filter(Boolean),
    [selectedProducts, products]
  );

  // Pagination
  const totalPages = Math.ceil(
    selectedProductDetails.length / PRODUCTS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = selectedProductDetails.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Select All logic
  const allChecked =
    selectedProductDetails.length > 0 &&
    selectedProductDetails.every((p) => selectedProductChecks?.[p._id]);

  const handleSelectAll = () => {
    const newState = !allChecked;
    selectedProductDetails.forEach((p) =>
      setValue(`selectedProductChecks.${p._id}`, newState)
    );
  };

  const addProduct = (productId) => {
    // Only add if not already present
    if (!selectedProducts.includes(productId)) {
      setSelectedProducts((prev) => [...prev, productId]);
      setValue(`selectedProductChecks.${productId}`, true);
      setSearchTerm("");
      setShowSuggestions(false);
      setCurrentPage(1);
    }
  };

  const removeProduct = (productId) => {
    setSelectedProducts((prev) => prev.filter((id) => id !== productId));
    setValue(`selectedProductChecks.${productId}`, false);
    // Remove fixed discount field as well
    setValue(`productDiscounts.${productId}`, undefined);

    const newLength = selectedProducts.length - 1;
    const newTotalPages = Math.ceil(newLength / PRODUCTS_PER_PAGE);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  // Close suggestion dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dropzone for thumbnail
  const onMainDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      const file = acceptedFiles[0];
      setThumbnailFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onMainDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  // Generate preview & cleanup
  useEffect(() => {
    if (!thumbnailFile) return;

    const objectUrl = URL.createObjectURL(thumbnailFile);
    setThumbnailPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [thumbnailFile]);

  // Remove
  const removeThumbnailImage = (e) => {
    e.stopPropagation();
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  // **********************************************
  // UI ONLY SUBMIT HANDLER
  // **********************************************
  const onSubmit = (data) => {
    // Log the entire form data for verification
    console.log("🔥 Form Submission Successful! Data to be sent to API:");
    console.log(data);

    // Filter final selected products based on checkboxes
    const finalProducts = selectedProductDetails
      .filter((p) => data.selectedProductChecks?.[p._id])
      .map((p) => ({
        id: p._id,
        name: p.productName,
        discount:
          data.discountType.value === "fixed"
            ? data.productDiscounts?.[p._id] || 0
            : data.discountAmount,
      }));

    console.log(
      "Selected/Filtered Products with calculated discount:",
      finalProducts
    );

    toast.success(
      `${
        isEditMode ? "Update" : "Creation"
      } UI test successful. Check console for data!`
    );

    // NOTE: Actual API call logic (POST/PATCH) has been removed.
    // router.push("/admin-dashboard/campaigns"); // Navigation removed for UI-only test
  };
  // **********************************************

  return (
    <div className=" min-h-screen p-5">
      <div className="glassmorphism shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-6">
          {isEditMode
            ? "Edit Campaign (UI Test Mode)"
            : "Add New Campaign (UI Test Mode)"}
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={(e) => {
            const target = e.target;
            // Prevent form submission on ENTER key press unless it's a TEXTAREA
            if (e.key === "Enter" && target.tagName !== "TEXTAREA") {
              e.preventDefault();
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Name
            </label>
            <input
              type="text"
              placeholder="Enter campaign name"
              {...register("campaignName", {
                required: "Campaign Name is required",
              })}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
            />
            {errors.campaignName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.campaignName.message}
              </p>
            )}
          </div>

          {/* Discount Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Type
            </label>
            <Controller
              styles={customStyles}
              name="discountType"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={discountTypeOptions}
                  styles={customStyles}
                />
              )}
            />
          </div>

          {/* Discount Amount (Percentage) */}
          {discountType?.value === "percentage" && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                <span>Discount Amount</span>
                <span className="text-gray-500 text-xs">%</span>
              </label>
              <input
                type="number"
                min={0}
                placeholder="Enter discount"
                {...register("discountAmount", {
                  required: "Discount Amount is required",
                  min: { value: 1, message: "Discount must be > 0" },
                })}
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
              />
              {errors.discountAmount && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.discountAmount.message}
                </p>
              )}
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Controller
              name="status"
              control={control}
              styles={customStyles}
              render={({ field }) => (
                <Select
                  {...field}
                  options={statusOptions}
                  styles={customStyles}
                />
              )}
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="datetime-local"
              {...register("startDate", { required: "Start Date is required" })}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
            />
            {errors.startDate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.startDate.message}
              </p>
            )}
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="datetime-local"
              {...register("endDate", { required: "End Date is required" })}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
            />
            {errors.endDate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.endDate.message}
              </p>
            )}
          </div>

          {/* Thumbnail + Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 col-span-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thumbnail
              </label>
              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-md p-6 text-center cursor-pointer min-h-[100px] flex items-center justify-center hover:border-blue-500 ${
                  isDragActive
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-300"
                }`}
              >
                <input {...getInputProps()} />
                {thumbnailPreview ? (
                  <div className="relative inline-block">
                    {/* Dummy Image Tag for UI */}
                    <Image
                      src={thumbnailPreview}
                      alt="thumbnail preview"
                      width={250}
                      height={128}
                      className="object-cover rounded"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={removeThumbnailImage}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 cursor-pointer"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Drag & drop thumbnail here, or click to select
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                placeholder="Enter campaign description"
                {...register("description", {
                  required: "Description is required",
                })}
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                rows={3}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Product Selection */}
          <div className="col-span-2">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Select Products
            </label>

            <div className="flex gap-4 mb-5">
              {/* Category Filter */}
              <div className="w-full">
                <Controller
                  name="parentCategory"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      styles={customStyles}
                      options={categoryOptions}
                      placeholder="Select Category"
                      isClearable
                      onChange={(val) => field.onChange(val ? val.value : null)}
                      value={
                        categoryOptions.find(
                          (opt) => opt.value === field.value
                        ) || null
                      }
                    />
                  )}
                />
              </div>

              {/* Search Input */}
              <div className="relative w-full" ref={searchRef}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                />

                {showSuggestions && searchTerm && (
                  <div className="absolute z-10 w-full border border-gray-300 rounded-md shadow-lg mt-1 max-h-80 overflow-y-auto">
                    {suggestedProducts && suggestedProducts.length > 0 ? (
                      suggestedProducts.map((product) => {
                        const isDisabled =
                          product?.campaign || product?.status === "active"; // Dummy check

                        return (
                          <div
                            key={product?._id}
                            onClick={() => {
                              if (!isDisabled) addProduct(product?._id);
                            }}
                            className={`flex items-center px-4 py-2 gap-3 cursor-pointer transition-colors duration-150
          ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}
        `}
                          >
                            <Image
                              src={product?.mainImage || "/placeholder.png"}
                              alt={product?.productName || "Unnamed Product"}
                              width={40}
                              height={40}
                              className="object-cover rounded"
                              unoptimized
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium line-clamp-1">
                                {product?.productName || "Unnamed Product"}
                              </p>
                              <p className="text-gray-600 text-xs">
                                ৳ {product?.salePrice ?? "N/A"}
                              </p>
                              {isDisabled && (
                                <p className="text-red-500 text-xs font-medium mt-1">
                                  ⚠ Already in campaign
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        No products found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Selected Products Table */}
            <div className=" rounded-lg border border-gray-200 shadow">
              <div className="px-4 py-2 border-b border-gray-200">
                <span className="text-sm font-medium">
                  Selected Products ({selectedProductDetails.length})
                </span>

                {/* Select All */}
                {selectedProductDetails.length > 0 && (
                  <label className="flex items-center gap-2 my-3 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={handleSelectAll}
                      className="cursor-pointer"
                    />
                    Select All
                  </label>
                )}
              </div>

              {selectedProductDetails.length === 0 ? (
                <p className="px-4 py-3 text-sm text-gray-500">
                  No products selected. Search and click to add products.
                </p>
              ) : (
                <div className="divide-y divide-gray-00">
                  {paginatedProducts.map((product) => {
                    const salePrice = product?.salePrice ?? 0;
                    const image = product?.mainImage || "";
                    const isChecked = selectedProductChecks?.[product?._id];

                    return (
                      <div
                        key={product._id}
                        className="flex items-center px-4 py-3 gap-3"
                      >
                        <input
                          type="checkbox"
                          {...register(`selectedProductChecks.${product._id}`)}
                        />
                        <Image
                          src={image}
                          alt={product?.productName}
                          width={45}
                          height={60}
                          className="object-cover rounded"
                          unoptimized
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {product?.productName}
                          </p>
                          <p className="text-gray-600 text-xs">৳ {salePrice}</p>

                          {/* Fixed Discount Input */}
                          {discountType?.value === "fixed" && isChecked && (
                            <input
                              type="number"
                              placeholder="Discount ৳"
                              min={0}
                              {...register(`productDiscounts.${product._id}`, {
                                required: "Discount is required",
                                min: {
                                  value: 1,
                                  message: "Discount must be > 0",
                                },
                              })}
                              className="w-48 border border-gray-300 rounded-md px-2 py-1 text-sm mt-3 focus:ring-2 focus:ring-rose-gold focus:outline-none"
                            />
                          )}
                        </div>

                        <button
                          type="button"
                          className="cursor-pointer bg-red-400 py-1 px-3 rounded text-white hover:bg-red-500 transition"
                          onClick={() => removeProduct(product._id)}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pagination for Selected Products */}
            {selectedProductDetails.length > 0 && (
              <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                <p>
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, selectedProductDetails.length)} of{" "}
                  {selectedProductDetails.length} products
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 border rounded ${
                          currentPage === page
                            ? "bg-rose-gold text-white border-rose-gold"
                            : "hover:bg-gray-100 text-gray-600 cursor-pointer"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="mt-6 col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-rose-gold text-white rounded-md hover:bg-rose-gold/90 transition cursor-pointer"
            >
              {isEditMode ? "Update Campaign" : "Save Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewCampaigns;
