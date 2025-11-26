"use client";
import { useBrandStore } from "@/ZustandStore/useBrandStore";
import { useCategoryStore } from "@/ZustandStore/useCategoryStore";
import { useScreenSolutionStore } from "@/ZustandStore/useScreenSolutionStore";
import { useSimpleProductStore } from "@/ZustandStore/useSimpleProductStore";
import { useTagStore } from "@/ZustandStore/useTagStore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#1F2937", // bg-gray-800
    borderColor: state.isFocused ? "#f472b6" : "#374151", // focus:border-rose-gold
    borderRadius: "0.75rem",
    padding: "0.25rem",
    minHeight: "3rem",
    boxShadow: state.isFocused ? "0 0 0 2px #f472b6" : "none", // Tailwind focus:ring-2 focus:ring-rose-gold
    outline: "none", // blue default remove
  }),
  input: (provided) => ({
    ...provided,
    color: "#fff",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#9CA3AF",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#fff",
  }),
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
  }),
};

export default function CreateSimpleProductPage() {
  const { getAllCategory, getCategory } = useCategoryStore();
  const { getAllBrands, allBrands } = useBrandStore();
  const { getAllScreenSolution, allScreenSolution } = useScreenSolutionStore();
  const { getAllTags, allTags } = useTagStore();
  const { createSimpleProduct } = useSimpleProductStore();
  const [simpleProductImage, setSimpleProductImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    getCategory();
    getAllBrands();
    getAllScreenSolution();
    getAllTags();
  }, [getCategory, getAllBrands, getAllScreenSolution, getAllTags]);
  const { register, handleSubmit, control, reset, setValue } = useForm({
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
      tags: "",
      visibility: "Published",
      isActive: true,
      productImage: null,
      galleryImages: [],
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSimpleProductImage(URL.createObjectURL(file));
      setValue("productImage", file);
    }
  };

  const handleSimpleProductImageGallery = (e) => {
    const files = Array.from(e.target.files);

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setGalleryImages((prev) => [...prev, ...newImages]);
    setValue("galleryImages", [
      ...galleryImages,
      ...newImages.map((img) => img.file),
    ]);
  };

  const categoryOptions = getAllCategory?.categories?.flatMap((category) => [
    { value: category.name },
    ...(category.subCategories?.map((sub) => ({
      value: sub.name,
      label: sub.name,
      indent: true, // subcategory indented
    })) || []),
  ]);

  // Brand options
  const brandOptions = allBrands?.allBrands?.map((b) => ({
    value: b.name,
    label: b.name,
  }));

  // Screen solution options
  const screenOptions = allScreenSolution?.allScreenSolution?.map((s) => ({
    value: s.name,
    label: s.name,
  }));

  const tagOptions = allTags?.tags?.map((t) => ({
    value: t.name,
    label: t.name,
  }));

  const onSubmit = async (data) => {
    const formData = new FormData();

    // --- Append Basic Text Fields ---
    formData.append("name", data.name);
    formData.append("slug", data.slug);
    formData.append("description", data.description);
    formData.append("ingredient", data.ingredient);
    formData.append("usageGuide", data.usageGuide);
    formData.append("regularPrice", data.regularPrice);
    formData.append("salePrice", data.salePrice);
    formData.append("stockQuantity", data.stockQuantity);
    formData.append("lowStockThreshold", data.lowStockThreshold);
    formData.append("sku", data.sku);

    // --- Handle Booleans (FormData converts everything to strings) ---
    formData.append("scheduleSale", data.scheduleSale);
    formData.append("trackStock", data.trackStock);
    formData.append("allowBackorders", data.allowBackorders);
    formData.append("isActive", true); // Or extract from data

    // --- Handle Files ---
    if (data.productImage) {
      formData.append("productImage", data.productImage);
    }

    if (data.galleryImages && data.galleryImages.length > 0) {
      data.galleryImages.forEach((file) => {
        formData.append("galleryImages", file);
      });
    }

    // --- Handle Relations & Mismatches ---
    formData.append("category", data.category);
    formData.append("brand", data.brand);
    // Backend expects 'skinSolution', Frontend has 'screenSolution'
    formData.append("skinSolution", data.screenSolution);
    formData.append("tags", data.tags); // If this is a single string
    formData.append("visibility", data.visibility);

    // --- Handle Nested SEO Object ---
    // Option A: Send as JSON string (Easiest to handle if backend parses it)
    // Option B: Send using bracket notation for Multer to parse into object
    formData.append("seo[title]", data.title);
    formData.append("seo[description]", data.description);
    formData.append("seo[bottomContent]", data.bottomContent);
    formData.append("seo[schemaMarkup]", data.schemaMarkup);
    formData.append("seo[canonicalUrl]", data.canonicalUrl);
    formData.append("seo[focusKeywords]", data.focusKeywords);

    try {
      // Pass formData, NOT 'data'
      await createSimpleProduct(formData);
      reset();
      setSimpleProductImage(null);
      setGalleryImages([]);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 p-2">
        {/* <!-- Top Bar --> */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Add Simple Product
            </h1>
            <p className="text-gray-400">Create a new single SKU product</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center">
              <i className="fas fa-times mr-2"></i> Cancel
            </button>
            <button className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center">
              <i className="fas fa-save mr-2"></i> Save Product
            </button>
          </div>
        </div>

        {/* <!-- Product Form --> */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* <!-- Left Column - Basic Info --> */}
          <div className="lg:col-span-2 space-y-6">
            {/* <!-- Basic Information --> */}
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
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Ingredient
                  </label>
                  <textarea
                    {...register("ingredient")}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-32 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Enter product Ingredient"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Usage Guide
                  </label>
                  <textarea
                    {...register("usageGuide")}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-32 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Enter product"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* <!-- Pricing --> */}
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

            {/* <!-- Inventory --> */}
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

            {/* <!-- SEO Content Publishing --> */}
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
                    {...register("title")}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Write here SEO title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-32 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Write here short description"
                  ></textarea>
                </div>

                {/* <!-- Make editor using React Draft Wysiwyg  --> */}
                {/* <!-- start  --> */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Bottom Content
                  </label>
                  <textarea
                    {...register("bottomContent")}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-40 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Write here SEO content"
                  ></textarea>
                </div>
                {/* <!-- end  --> */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Schema Markup
                  </label>
                  <textarea
                    {...register("schemaMarkup")}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-40 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Write here Schema Markup"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Canonical URL{" "}
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
                    placeholder="lip care, lip balm, lip scrub, lip treatment, bangladesh"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate with commas
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Right Column - Media & Organization --> */}
          <div className="space-y-6">
            {/* <!-- Product Image --> */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <label
                htmlFor="simpleProductImage"
                className="text-xl font-bold text-white mb-4"
              >
                Simple Product Image
                <div className="image-upload-area rounded-xl p-8 text-center cursor-pointer border-2 border-dashed border-gray-600 hover:border-rose-gold transition-all duration-300">
                  {simpleProductImage && (
                    <Image
                      src={simpleProductImage}
                      alt="Simple Product Preview"
                      height={296}
                      className="object-cover w-full"
                      width={100}
                    />
                  )}
                  {!simpleProductImage && (
                    <>
                      <i className="fas fa-cloud-upload-alt text-3xl text-rose-gold mb-3"></i>
                      <p className="text-gray-400 mb-2">
                        Drag & drop category image here
                      </p>
                      <p className="text-sm text-gray-500">or</p>

                      <button
                        type="button"
                        className="bg-pink-400 cursor-pointer hover:bg-pink-600 text-white px-4 py-2 rounded-xl mt-3 font-medium transition-all duration-300"
                      >
                        Browse Files
                      </button>

                      <div className="mt-4">
                        <p className="text-xs text-gray-500">
                          Recommended size: 400x400 pixels. JPG, PNG, or WebP
                          format.
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <input
                  id="simpleProductImage"
                  type="file"
                  name="productImage"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {/* <!-- Product Gallery Images --> */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <label
                htmlFor="simpleProductImageGallery"
                className="text-xl font-bold text-white mb-4"
              >
                Product Gallery
                <div className="image-upload-area rounded-xl p-8 text-center cursor-pointer border-2 border-dashed border-gray-600 hover:border-rose-gold transition-all duration-300">
                  {!galleryImages.length ? (
                    <>
                      <i className="fas fa-images text-2xl text-rose-gold mb-2"></i>
                      <p className="text-gray-400 mb-2">
                        Add product gallery images
                      </p>
                      <p className="text-sm text-gray-500">or</p>
                      <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl mt-2 font-medium transition-all duration-300">
                        Browse Files
                      </button>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Add multiple images to showcase your product
                      </p>
                    </>
                  ) : (
                    <div className="flex flex-wrap gap-4 justify-center">
                      {galleryImages.map((img, idx) => (
                        <div key={idx} className="relative">
                          <Image
                            src={img.preview}
                            alt="Gallery Preview"
                            width={120}
                            height={120}
                            className="rounded-lg object-cover h-[120px] w-[120px]"
                          />

                          {/* Remove Button */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setGalleryImages((prev) =>
                                prev.filter((_, i) => i !== idx)
                              );
                            }}
                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  id="simpleProductImageGallery"
                  type="file"
                  name="galleryImages"
                  accept="image/png, image/jpeg, image/webp"
                  multiple
                  className="hidden"
                  onChange={handleSimpleProductImageGallery}
                />
              </label>
            </div>

            {/* <!-- Organization --> */}
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
                        options={categoryOptions || []}
                        styles={customStyles}
                        placeholder="---Select Category---"
                        isSearchable
                        getOptionLabel={(option) =>
                          option.indent
                            ? `\u00A0\u00A0\u00A0${option.value}`
                            : option.value
                        }
                        getOptionValue={(option) => option.value}
                        value={
                          (categoryOptions || []).find(
                            (c) => c.value === field.value
                          ) || null
                        }
                        onChange={(option) => field.onChange(option.value)}
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
                        options={brandOptions || []}
                        styles={customStyles}
                        placeholder="---Select Brand---"
                        isSearchable
                        getOptionLabel={(option) =>
                          option.indent
                            ? `\u00A0\u00A0\u00A0${option.value}`
                            : option.value
                        }
                        getOptionValue={(option) => option.value}
                        value={
                          (brandOptions || []).find(
                            (c) => c.value === field.value
                          ) || null
                        }
                        onChange={(option) => field.onChange(option.value)}
                      />
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Screen Solutions
                  </label>
                  <Controller
                    name="screenSolution"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={screenOptions || []}
                        styles={customStyles}
                        placeholder="---Select Screen Solution---"
                        isSearchable
                        getOptionLabel={(option) =>
                          option.indent
                            ? `\u00A0\u00A0\u00A0${option.value}`
                            : option.value
                        }
                        getOptionValue={(option) => option.value}
                        value={
                          (screenOptions || []).find(
                            (c) => c.value === field.value
                          ) || null
                        }
                        onChange={(option) => field.onChange(option.value)}
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
                        isMulti={false} // single value, change to true if multiple tags
                        options={tagOptions || []}
                        styles={customStyles}
                        placeholder="Type or select a tag"
                        getOptionLabel={(option) =>
                          option.indent
                            ? `\u00A0\u00A0\u00A0${option.value}`
                            : option.value
                        }
                        getOptionValue={(option) => option.value}
                        value={
                          (tagOptions || []).find(
                            (c) => c.value === field.value
                          ) || { value: field.value, label: field.value }
                        }
                        onChange={(option) =>
                          field.onChange(option?.value || "")
                        }
                        onCreateOption={(inputValue) =>
                          field.onChange(inputValue)
                        }
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* <!-- Status --> */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-bold text-white mb-4">Status</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Visibility
                  </label>
                  <select className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent">
                    <option>Published</option>
                    <option>Draft</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
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
