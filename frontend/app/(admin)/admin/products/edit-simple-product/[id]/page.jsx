/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { api } from "@/lib/axios";
import { useBrandStore } from "@/ZustandStore/useBrandStore";
import { useCategoryStore } from "@/ZustandStore/useCategoryStore";
import { useScreenSolutionStore } from "@/ZustandStore/useScreenSolutionStore";
import { useSimpleProductStore } from "@/ZustandStore/useSimpleProductStore";
import { useTagStore } from "@/ZustandStore/useTagStore";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function CreateSimpleProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const { getSingleSimpleProduct, singleSimpleProduct, updateSimpleProduct } =
    useSimpleProductStore();

  const { getAllCategory, getCategory } = useCategoryStore();
  const { allBrands, getAllBrands } = useBrandStore();
  const { allScreenSolution, getAllScreenSolution } = useScreenSolutionStore();
  const { getAllTags, allTags } = useTagStore();

  // --- LOCAL STATES FOR DYNAMIC FIELDS & PREVIEWS ---
  const [simpleProductImagePreview, setSimpleProductImagePreview] =
    useState(null);
  const [galleryImagesPreview, setGalleryImagesPreview] = useState([]);

  // ** FIX **: আসল ফাইল অবজেক্ট সংরক্ষণের জন্য নতুন স্টেট
  const [productImageFile, setProductImageFile] = useState(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState([]); // নতুন আপলোড করা ফাইল

  // State for handling dynamic product tags
  const [productTags, setProductTags] = useState([]);

  // React Hook Form Initialization
  const { register, handleSubmit, reset } = useForm();

  // --- Image Source Logic Helper ---
  const getImageUrl = (path) => {
    if (!path) return "";
    // If the path starts with 'blob:', it's a new file preview URL, use it directly.
    if (path.startsWith("blob:")) {
      return path;
    }
    // Otherwise, assume it's an existing file path and needs the base URL prefix.
    return api + path;
  };

  // --- DATA FETCHING & FORM POPULATION ---
  useEffect(() => {
    if (id) {
      getSingleSimpleProduct(id);
      getAllCategory();
      getAllBrands();
      getAllScreenSolution();
      getAllTags();
    }
  }, [
    id,
    getSingleSimpleProduct,
    getAllCategory,
    getAllBrands,
    getAllScreenSolution,
    getAllTags,
  ]);

  console.log(allTags);
  useEffect(() => {
    if (singleSimpleProduct) {
      // 1. Populate all standard form fields using reset()
      reset({
        name: singleSimpleProduct.name || "",
        slug: singleSimpleProduct.slug || "",
        description: singleSimpleProduct.description || "",
        ingredient: singleSimpleProduct.ingredient || "",
        usageGuide: singleSimpleProduct.usageGuide || "",
        regularPrice: singleSimpleProduct.regularPrice || 0,
        salePrice: singleSimpleProduct.salePrice || 0,
        scheduleSale: singleSimpleProduct.scheduleSale || false,
        stockQuantity: singleSimpleProduct.stockQuantity || 0,
        lowStockThreshold: singleSimpleProduct.lowStockThreshold || 5,
        sku: singleSimpleProduct.sku || "",
        trackStock: singleSimpleProduct.trackStock || false,
        allowBackorders: singleSimpleProduct.allowBackorders || false,
        seoTitle: singleSimpleProduct.seo?.seoTitle || "",
        seoDescription: singleSimpleProduct.seo?.seoDescription || "",
        bottomContent: singleSimpleProduct.seo?.bottomContent || "",
        schemaMarkup: singleSimpleProduct.seo?.schemaMarkup || "",
        canonicalUrl: singleSimpleProduct.seo?.canonicalUrl || "",
        focusKeywords: singleSimpleProduct.seo?.focusKeywords?.join(", ") || "",
        category: singleSimpleProduct.category || "",
        brand: singleSimpleProduct.brand || "",
        skinSolution: singleSimpleProduct.skinSolution || "",
        visibility: singleSimpleProduct.visibility || "",
        isActive: singleSimpleProduct.isActive || false,
      });

      // 2. Set dynamic states (Images & Tags)
      setSimpleProductImagePreview(singleSimpleProduct.mainImage || null);

      if (singleSimpleProduct.galleryImages) {
        // existing images have only the preview URL (path) and no file object
        setGalleryImagesPreview(
          singleSimpleProduct.galleryImages.map((img) => ({
            file: null, // file is null for existing images
            preview: img,
          }))
        );
      }

      // Initialize productTags state
      if (singleSimpleProduct.tags) {
        setProductTags(singleSimpleProduct.tags);
      }
    }
  }, [singleSimpleProduct, reset]);

  // --- IMAGE HANDLERS ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSimpleProductImagePreview(URL.createObjectURL(file));
      // ** FIX **: আসল ফাইল অবজেক্ট সংরক্ষণ করা হচ্ছে
      setProductImageFile(file);
    }
  };

  const handleSimpleProductImageGallery = (e) => {
    const files = Array.from(e.target.files);

    const previews = files.map((file) => ({
      file: file, // file object for newly selected files
      preview: URL.createObjectURL(file),
    }));

    // নতুন ফাইল অবজেক্টগুলো galleryImageFiles স্টেটে যোগ করা হচ্ছে
    setGalleryImageFiles((prev) => [...prev, ...files]);
    setGalleryImagesPreview((prev) => [...prev, ...previews]);
  };

  const removeGalleryImage = (indexToRemove) => {
    setGalleryImagesPreview((prev) => {
      const removedItem = prev[indexToRemove];
      // If the removed item was a newly selected file (item.file is not null)
      if (removedItem.file) {
        // Remove the corresponding file from the galleryImageFiles state
        setGalleryImageFiles((currentFiles) =>
          currentFiles.filter((file) => file !== removedItem.file)
        );
      }
      return prev.filter((_, i) => i !== indexToRemove);
    });
  };

  // --- FORM SUBMISSION HANDLER ---
  const onSubmit = async (data) => {
    console.log("Form data before submit:", data);

    const formData = new FormData();

    // 1️⃣ সাধারণ ফিল্ডগুলো
    for (const key in data) {
      if (
        typeof data[key] !== "object" &&
        ![
          "focusKeywords",
          "seoTitle",
          "seoDescription",
          "bottomContent",
          "schemaMarkup",
          "canonicalUrl",
        ].includes(key)
      ) {
        if (typeof data[key] === "boolean") {
          formData.append(key, data[key] ? "true" : "false");
        } else {
          formData.append(key, data[key]);
        }
      }
    }

    // 2️⃣ Tags
    formData.append("tags", data.tag);

    // 3️⃣ SEO ডেটা
    formData.append("seo[seoTitle]", data.seoTitle);
    formData.append("seo[seoDescription]", data.seoDescription);
    formData.append("seo[bottomContent]", data.bottomContent);
    formData.append("seo[schemaMarkup]", data.schemaMarkup);
    formData.append("seo[canonicalUrl]", data.canonicalUrl);
    formData.append("seo[focusKeywords]", data.focusKeywords);

    // 4️⃣ Main Product Image
    if (productImageFile) {
      // নতুন file select করলে
      formData.append("mainImage", productImageFile);
    } else if (
      simpleProductImagePreview &&
      !simpleProductImagePreview.startsWith("blob:")
    ) {
      // পুরনো main image URL থাকলে
      formData.append("mainImage", simpleProductImagePreview);
    }

    // 5️⃣ Gallery Images (merge existing + new uploads)
    const mergedGalleryImages = [];

    // Existing images
    galleryImagesPreview.forEach((item) => {
      if (!item.file) {
        mergedGalleryImages.push(item.preview); // server URL
      }
    });

    // নতুন uploads
    galleryImageFiles.forEach((file) => {
      mergedGalleryImages.push(file); // file object
    });

    // FormData এ append
    mergedGalleryImages.forEach((img) => {
      formData.append("galleryImages", img);
    });

    // 6️⃣ API call
    console.log("Submitting merged form data...", formData);
    await updateSimpleProduct(id, formData);

    // Submit হলে redirect
    router.push("/admin/products");
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 p-2">
        {/* Top Bar (omitted for brevity) */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Edit Simple Product
            </h1>
            <p className="text-gray-400">
              Update an existing single SKU product
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => router.back()} // Go back to previous page
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
            >
              <i className="fas fa-times mr-2"></i> Cancel
            </button>
            <button
              type="submit"
              className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
            >
              Update Product
            </button>
          </div>
        </div>

        {/* Product Form - Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (omitted for brevity) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-bold text-white mb-4">
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    {...register("slug")}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Product Slug"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-32 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Enter product description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Ingredient
                  </label>
                  <textarea
                    {...register("ingredient")}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-32 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Enter product Ingredient"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Usage Guide
                  </label>
                  <textarea
                    {...register("usageGuide")}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-32 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Enter product usage guide"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-bold text-white mb-4">Pricing</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Regular Price ($)
                  </label>
                  <input
                    type="number"
                    {...register("regularPrice", { valueAsNumber: true })}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Sale Price ($)
                  </label>
                  <input
                    type="number"
                    {...register("salePrice", { valueAsNumber: true })}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("scheduleSale")}
                    className="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500"
                  />
                  <span className="ml-2 text-sm text-gray-400">
                    Schedule sale dates
                  </span>
                </label>
              </div>
            </div>

            {/* Inventory */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-bold text-white mb-4">Inventory</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    {...register("stockQuantity", { valueAsNumber: true })}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    {...register("lowStockThreshold", { valueAsNumber: true })}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    {...register("sku")}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Product SKU"
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("trackStock")}
                    className="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500"
                  />
                  <span className="ml-2 text-sm text-gray-400">
                    Track stock quantity
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("allowBackorders")}
                    className="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500"
                  />
                  <span className="ml-2 text-sm text-gray-400">
                    Allow backorders
                  </span>
                </label>
              </div>
            </div>

            {/* SEO */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-bold text-white mb-4">
                SEO Content For Category Page
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    {...register("seoTitle")}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Write here SEO title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register("seoDescription")}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-32 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Write here short description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Bottom Content
                  </label>
                  <textarea
                    {...register("bottomContent")}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-40 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Write here SEO content"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Schema Markup
                  </label>
                  <textarea
                    {...register("schemaMarkup")}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-40 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Write here Schema Markup"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Canonical URL
                  </label>
                  <input
                    type="url"
                    {...register("canonicalUrl")}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Write here Canonical URL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Focus Keywords
                  </label>
                  {/* Focus Keywords is now a simple text input for simplicity */}
                  <input
                    type="text"
                    {...register("focusKeywords")}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="lip care, lip balm, ..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate with commas
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Product Image */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <label
                htmlFor="simpleProductImage"
                className="text-xl font-bold text-white mb-4 block"
              >
                Simple Product Image
              </label>

              <label
                htmlFor="simpleProductImage"
                className="image-upload-area rounded-xl p-8 text-center cursor-pointer border-2 border-dashed border-gray-600 hover:border-rose-gold transition-all duration-300 block"
              >
                {simpleProductImagePreview ? (
                  <div className="relative">
                    <Image
                      src={getImageUrl(simpleProductImagePreview)}
                      alt="Simple Product Preview"
                      height={296}
                      width={296}
                      className="object-cover w-full rounded-lg"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/50 bg-opacity-10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg">
                      <i className="fas fa-camera text-white text-3xl"></i>
                    </div>
                  </div>
                ) : (
                  <>
                    <i className="fas fa-cloud-upload-alt text-3xl text-rose-gold mb-3"></i>
                    <p className="text-gray-400 mb-2">
                      Drag & drop product image here
                    </p>
                    <p className="text-sm text-gray-500">or</p>
                    <div className="inline-block bg-pink-400 text-white px-4 py-2 rounded-xl mt-3 font-medium transition-all duration-300">
                      Browse Files
                    </div>
                    <div className="mt-4">
                      <p className="text-xs text-gray-500">
                        Recommended size: 400x400 pixels. JPG, PNG, or WebP
                        format.
                      </p>
                    </div>
                  </>
                )}

                <input
                  id="simpleProductImage"
                  type="file"
                  name="mainImage"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* Product Gallery */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <label
                htmlFor="simpleProductImageGallery"
                className="text-xl font-bold text-white mb-4 block"
              >
                Product Gallery
              </label>
              <div className="image-upload-area rounded-xl p-8 text-center cursor-pointer border-2 border-dashed border-gray-600 hover:border-rose-gold transition-all duration-300">
                <div className="flex flex-wrap gap-4 justify-center mb-4">
                  {galleryImagesPreview.map((img, idx) => (
                    <div key={idx} className="relative">
                      <Image
                        src={getImageUrl(img.preview)}
                        alt={`Gallery Preview ${idx + 1}`}
                        width={120}
                        height={120}
                        className="rounded-lg object-cover h-[120px] w-[120px]"
                        unoptimized
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          removeGalleryImage(idx);
                        }}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Upload Prompt always visible below the previews */}
                <label
                  htmlFor="simpleProductImageGallery"
                  className="inline-block cursor-pointer"
                >
                  <div className="p-4 border border-dashed border-gray-700 hover:border-rose-gold rounded-lg transition duration-300">
                    <i className="fas fa-plus text-2xl text-rose-gold mb-1"></i>
                    <p className="text-sm text-gray-400">Add More Images</p>
                  </div>
                </label>

                <input
                  id="simpleProductImageGallery"
                  type="file"
                  name="galleryImages"
                  accept="image/png, image/jpeg, image/webp"
                  multiple
                  className="hidden"
                  onChange={handleSimpleProductImageGallery}
                />
              </div>
            </div>

            {/* Organization */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-bold text-white mb-4">
                Organization
              </h2>
              <div className="space-y-4">
                <select
                  {...register("category")}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                >
                  {getCategory?.categories?.map((cat) => (
                    <React.Fragment key={cat._id}>
                      {/* Main Category */}
                      <option value={cat.name} className="font-bold">
                        {cat.name}
                      </option>

                      {/* Subcategories with padding-left */}
                      {cat?.subCategories?.map((sub) => (
                        <option key={sub._id} value={sub.name} className="pl-5">
                          └─ {sub.name}
                        </option>
                      ))}
                    </React.Fragment>
                  ))}
                </select>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Brand
                  </label>
                  <select
                    {...register("brand")}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                  >
                    {allBrands?.brands?.map((brand) => (
                      <option key={brand._id} value={brand.name}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Skin Solutions
                  </label>
                  <select
                    {...register("skinSolution")}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                  >
                    {allScreenSolution?.screenSolutions?.map((solution) => (
                      <option key={solution._id} value={solution.name}>
                        {solution.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags Management */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Tags
                  </label>
                  <select
                    {...register("tag")}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                  >
                    {allTags?.tags?.map((tag) => (
                      <option key={tag._id} value={tag.name}>
                        {tag.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-bold text-white mb-4">Status</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Visibility
                  </label>
                  <select
                    {...register("visibility")}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("isActive")}
                      className="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500"
                    />
                    <span className="ml-2 text-sm text-gray-400">
                      Active product
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
