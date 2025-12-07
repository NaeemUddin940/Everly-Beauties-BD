"use client";
import createSlug from "@/app/utils/SlugGenerator";
import { useBrandStore } from "@/ZustandStore/useBrandStore";
import { useCategoryStore } from "@/ZustandStore/useCategoryStore";
import { useScreenSolutionStore } from "@/ZustandStore/useScreenSolutionStore";
import { useSimpleProductStore } from "@/ZustandStore/useSimpleProductStore";
import { useTagStore } from "@/ZustandStore/useTagStore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

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

export default function CreateSimpleProductPage() {
  // stores
  const { getCategory, getAllCategory } = useCategoryStore();
  const { getAllBrands, allBrands } = useBrandStore();
  const { getAllScreenSolution, allScreenSolution } = useScreenSolutionStore();
  const { getAllTags, allTags } = useTagStore();
  const { createSimpleProduct, isLoading } = useSimpleProductStore();

  // local states for previews
  const [simpleProductImagePreview, setSimpleProductImagePreview] =
    useState(null);
  const [galleryImagesPreview, setGalleryImagesPreview] = useState([]);
  const [galleryFiles, setGalleryFiles] = useState([]);

  // price local (for validation)
  const [price, setPrice] = useState({
    regularPrice: 0,
    salePrice: 0,
  });

  // react hook form
  const { register, handleSubmit, control, reset, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      ingredient: "",
      usageGuide: "",
      regularPrice: "",
      salePrice: "",
      scheduleSale: false,
      stockQuantity: "",
      lowStockThreshold: "",
      sku: "",
      trackStock: true,
      allowBackorders: false,
      seoTitle: "",
      seoDescription: "",
      bottomContent: "",
      schemaMarkup: "",
      canonicalUrl: "",
      focusKeywords: "",
      category: "",
      brand: "",
      screenSolution: "",
      tags: [], // array for multi
      visibility: "Published",
      isActive: true,
      mainImage: null,
      galleryImages: [],
    },
  });

  // For Autho Slug generation
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    const newSlug = createSlug(name);
    setSlug(newSlug);
    setValue("slug", newSlug); // update react-hook-form value
  }, [name, setValue]);

  // fetch options on mount (empty dependency array to avoid re-trigger)
  useEffect(() => {
    getAllCategory();
    getAllBrands();
    getAllScreenSolution();
    getAllTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // build select options safely (guard for undefined)
  const categoryOptions =
    getCategory?.categories?.flatMap((category) => [
      { value: category.name, label: category.name },
      ...(category.subCategories?.map((sub) => ({
        value: sub.name,
        label: sub.name,
        indent: true,
      })) || []),
    ]) || [];

  const brandOptions =
    allBrands?.allBrands?.map((b) => ({ value: b.name, label: b.name })) || [];

  const screenOptions =
    allScreenSolution?.allScreenSolution?.map((s) => ({
      value: s.name,
      label: s.name,
    })) || [];

  const tagOptions =
    allTags?.tags?.map((t) => ({ value: t.name, label: t.name })) || [];

  // handle file change for single product image
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSimpleProductImagePreview(URL.createObjectURL(file));
    setValue("mainImage", file, { shouldDirty: true, shouldTouch: true });
  };

  // handle multiple gallery files
  const handleSimpleProductImageGallery = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setGalleryImagesPreview((prev) => [...prev, ...newPreviews]);
    setGalleryFiles((prev) => [...prev, ...files]);

    // set RHF field to array of Files
    const existing = watch("galleryImages") || [];
    setValue("galleryImages", [...existing, ...files], { shouldDirty: true });
  };

  // remove one gallery preview (by index)
  const removeGalleryImage = (index) => {
    setGalleryImagesPreview((prev) => prev.filter((_, i) => i !== index));
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    // update RHF field too
    const currentFiles = watch("galleryImages") || [];
    const updated = currentFiles.filter((_, i) => i !== index);
    setValue("galleryImages", updated);
  };

  // price validation to avoid infinite toasts
  useEffect(() => {
    if (!price) return;
    const reg = parseFloat(price.regularPrice) || 0;
    const sale = parseFloat(price.salePrice) || 0;
    if (sale > 0 && sale > reg) {
      toast.error("Sale price must be less than or equal to regular price");
      // only reset salePrice not both, so user can correct
      setPrice((p) => ({ ...p, salePrice: 0 }));
      setValue("salePrice", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price.regularPrice, price.salePrice]);

  const onSubmit = async (data) => {
    try {
      // Basic guard: ensure numeric values are numbers
      const formData = new FormData();

      // append simple fields
      formData.append("name", data.name || "");
      formData.append("slug", data.slug || "");
      formData.append("description", data.description || "");
      formData.append("ingredient", data.ingredient || "");
      formData.append("usageGuide", data.usageGuide || "");
      formData.append("regularPrice", data.regularPrice || "0");
      formData.append("salePrice", data.salePrice || "0");
      formData.append("stockQuantity", data.stockQuantity || "0");
      formData.append("lowStockThreshold", data.lowStockThreshold || "0");
      formData.append("sku", data.sku || "");
      formData.append("scheduleSale", data.scheduleSale ? "true" : "false");
      formData.append("trackStock", data.trackStock ? "true" : "false");
      formData.append(
        "allowBackorders",
        data.allowBackorders ? "true" : "false"
      );
      formData.append("isActive", data.isActive ? "true" : "false");
      formData.append("visibility", data.visibility || "Published");
      formData.append("category", data.category || "");
      formData.append("brand", data.brand || "");
      formData.append("skinSolution", data.skinSolution || "");

      // tags: send as repeated fields if array
      if (Array.isArray(data.tags)) {
        data.tags.forEach((t) => {
          // t might be string or {value,label}
          const value = typeof t === "string" ? t : t?.value ?? "";
          if (value) formData.append("tags[]", value);
        });
      } else if (data.tags) {
        // single string
        formData.append("tags[]", data.tags);
      }

      // files
      if (data.mainImage) {
        formData.append("mainImage", data.mainImage);
      }

      // gallery files from local galleryFiles
      if (galleryFiles && galleryFiles.length) {
        galleryFiles.forEach((file) => {
          formData.append("galleryImages", file);
        });
      }
      formData.append("seo[seoTitle]", data.seoTitle);
      formData.append("seo[seoDescription]", data.seoDescription);
      formData.append("seo[bottomContent]", data.bottomContent);
      formData.append("seo[schemaMarkup]", data.schemaMarkup);
      formData.append("seo[canonicalUrl]", data.canonicalUrl);
      formData.append("seo[focusKeywords]", data.focusKeywords);

      await createSimpleProduct(formData);

      // cleanup UI
      reset();
      setSimpleProductImagePreview(null);
      setGalleryImagesPreview([]);
      setGalleryFiles([]);
      setPrice({ regularPrice: 0, salePrice: 0 });
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 p-2">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Add Simple Product
            </h1>
            <p className="text-gray-400">Create a new single SKU product</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
            >
              <i className="fas fa-times mr-2"></i> Cancel
            </button>
            <button
              disabled={isLoading}
              type="submit"
              className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
            >
              <i className="fas fa-save mr-2"></i>{" "}
              {isLoading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </div>

        {/* Product Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
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
                    onChange={(e) => setName(e.target.value)}
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
                    value={slug.toLocaleLowerCase()}
                    onChange={(e) => setSlug(e.target.value)}
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
                    {...register("regularPrice")}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPrice((p) => ({ ...p, regularPrice: val }));
                    }}
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
                    {...register("salePrice")}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPrice((p) => ({ ...p, salePrice: val }));
                    }}
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
                    {...register("stockQuantity")}
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
                    {...register("lowStockThreshold")}
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
                <div className="image-upload-area rounded-xl p-8 text-center cursor-pointer border-2 border-dashed border-gray-600 hover:border-rose-gold transition-all duration-300">
                  {simpleProductImagePreview ? (
                    <Image
                      src={simpleProductImagePreview}
                      alt="Simple Product Preview"
                      height={296}
                      width={296}
                      className="object-cover w-full rounded-lg"
                    />
                  ) : (
                    <>
                      <i className="fas fa-cloud-upload-alt text-3xl text-rose-gold mb-3"></i>
                      <p className="text-gray-400 mb-2">
                        Drag & drop product image here
                      </p>
                      <p className="text-sm text-gray-500">or</p>
                      <label
                        htmlFor="simpleProductImage"
                        className="inline-block bg-pink-400 cursor-pointer hover:bg-pink-600 text-white px-4 py-2 rounded-xl mt-3 font-medium transition-all duration-300"
                      >
                        Browse Files
                      </label>
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
                </div>
              </label>
            </div>

            {/* Product Gallery */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <label
                htmlFor="simpleProductImageGallery"
                className="text-xl font-bold text-white mb-4 block"
              >
                Product Gallery
                <div className="image-upload-area rounded-xl p-8 text-center cursor-pointer border-2 border-dashed border-gray-600 hover:border-rose-gold transition-all duration-300">
                  {!galleryImagesPreview.length ? (
                    <>
                      <i className="fas fa-images text-2xl text-rose-gold mb-2"></i>
                      <p className="text-gray-400 mb-2">
                        Add product gallery images
                      </p>
                      <p className="text-sm text-gray-500">or</p>
                      <label
                        htmlFor="simpleProductImageGallery"
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl mt-2 font-medium transition-all duration-300 inline-block cursor-pointer"
                      >
                        Browse Files
                      </label>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Add multiple images to showcase your product
                      </p>
                    </>
                  ) : (
                    <div className="flex flex-wrap gap-4 justify-center">
                      {galleryImagesPreview.map((img, idx) => (
                        <div key={idx} className="relative">
                          <Image
                            src={img.preview}
                            alt={`Gallery Preview ${idx + 1}`}
                            width={120}
                            height={120}
                            className="rounded-lg object-cover h-[120px] w-[120px]"
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
                  )}
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
              </label>
            </div>

            {/* Organization */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-bold text-white mb-4">
                Organization
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Category
                  </label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={categoryOptions}
                        styles={customStyles}
                        placeholder="---Select Category---"
                        isSearchable
                        getOptionLabel={(o) => o.label}
                        getOptionValue={(o) => o.value}
                        value={
                          categoryOptions.find(
                            (c) => c.value === field.value
                          ) || null
                        }
                        onChange={(option) =>
                          field.onChange(option?.value || "")
                        }
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Brand
                  </label>
                  <Controller
                    name="brand"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={brandOptions}
                        styles={customStyles}
                        placeholder="---Select Brand---"
                        isSearchable
                        value={
                          brandOptions.find((b) => b.value === field.value) ||
                          null
                        }
                        onChange={(option) =>
                          field.onChange(option?.value || "")
                        }
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Screen Solutions
                  </label>
                  <Controller
                    name="skinSolution"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={screenOptions}
                        styles={customStyles}
                        placeholder="---Select Skin Solution---"
                        isSearchable
                        value={
                          screenOptions.find((s) => s.value === field.value) ||
                          null
                        }
                        onChange={(option) =>
                          field.onChange(option?.value || "")
                        }
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Tags
                  </label>
                  <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                      <CreatableSelect
                        {...field}
                        isClearable
                        isMulti
                        options={tagOptions}
                        styles={customStyles}
                        placeholder="Type or select tags"
                        getOptionLabel={(o) => o.label}
                        getOptionValue={(o) => o.value}
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        value={
                          Array.isArray(field.value)
                            ? field.value.map((v) =>
                                typeof v === "string"
                                  ? { value: v, label: v }
                                  : v
                              )
                            : []
                        }
                        onChange={(options) =>
                          field.onChange(
                            options ? options.map((o) => o.value) : []
                          )
                        }
                        onCreateOption={(inputValue) => {
                          // add a new tag (value only)
                          const newTag = {
                            value: inputValue,
                            label: inputValue,
                          };
                          const curr = Array.isArray(field.value)
                            ? field.value
                            : [];
                          const updated = [...curr, inputValue];
                          field.onChange(updated);
                        }}
                      />
                    )}
                  />
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
