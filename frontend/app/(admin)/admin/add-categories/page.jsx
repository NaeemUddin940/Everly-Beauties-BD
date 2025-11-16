/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useCategoryStore } from "@/ZustandStore/useCategoryStore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function page() {
  const {
    createMainCategory,
    createSubCategory,
    getCategory,
    getAllCategory,
  } = useCategoryStore();

  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      showOnNavigation: false,
      isFeaturedOnHomePage: false,
      isActive: true,
    },
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(URL.createObjectURL(file));
      setValue("image", file);
    }
  };

  async function onSubmit(data) {
    console.log(data);
    if (data.mainCategoryId) {
      await createSubCategory(data);
    } else {
      await createMainCategory(data);
    }
    setSelectedFile(null);
    reset();
  }

  useEffect(() => {
    async function fetchCategories() {
      await getCategory();
    }
    fetchCategories();
  }, [getCategory]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {" "}
      <div className="flex-1 p-2">
        {/* <!-- Top Bar --> */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Create New Category
            </h1>
            <p className="text-gray-400">
              Add a new category to organize your products
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              // onclick="window.location.href='categories.html'"
              className="bg-gray-800 hover:bg-gray-700 cursor-pointer text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
            >
              <i className="fas fa-times mr-2"></i> Cancel
            </button>
            <button
              type="submit"
              className="bg-pink-400 cursor-pointer hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
            >
              <i className="fas fa-save mr-2"></i> Save Category
            </button>
          </div>
        </div>

        {/* <!-- Category Form --> */}
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
                    Category Name
                  </label>
                  <input
                    type="text"
                    {...register("title")}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Enter category name"
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
                    placeholder="category-slug"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL-friendly version of the name. Usually lowercase and
                    contains only letters, numbers, and hyphens.
                  </p>
                </div>
              </div>
            </div>

            {/* <!-- Parent Category --> */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-bold text-white mb-4">
                Parent Category
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Parent Category
                  </label>
                  <select
                    {...register("mainCategoryId")}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                  >
                    <option value="">No Parent (Top Level Category)</option>
                    {getAllCategory?.allCategories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Select a parent category to make this a subcategory
                  </p>
                </div>
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
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Write here SEO title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Description
                  </label>
                  <textarea
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
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-40 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Write here Schema Markup"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Canonical URL{" "}
                  </label>
                  <input
                    type="text"
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

          {/* <!-- Right Column - Media & Settings --> */}
          <div className="space-y-6">
            {/* <!-- Category Image --> */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <label
                htmlFor="categoryFile"
                className="text-xl font-bold text-white mb-4"
              >
                Category Image
                <div className="image-upload-area rounded-xl p-8 text-center cursor-pointer border-2 border-dashed border-gray-600 hover:border-rose-gold transition-all duration-300">
                  {selectedFile && (
                    <Image
                      src={selectedFile}
                      alt="categoryImage"
                      height={296}
                      className="object-cover w-full"
                      width={100}
                    />
                  )}
                  {!selectedFile && (
                    <>
                      <i className="fas fa-cloud-upload-alt text-3xl text-rose-gold mb-3"></i>
                      <p className="text-gray-400 mb-2">
                        Drag & drop category image here
                      </p>
                      <p className="text-sm text-gray-500">or</p>
                    </>
                  )}

                  {!selectedFile && (
                    <button
                      // id="categoryFile"
                      type="button"
                      className="bg-pink-400 cursor-pointer hover:bg-pink-600 text-white px-4 py-2 rounded-xl mt-3 font-medium transition-all duration-300"
                    >
                      Browse Files
                    </button>
                  )}
                  {!selectedFile && (
                    <div className="mt-4">
                      <p className="text-xs text-gray-500">
                        Recommended size: 400x400 pixels. JPG, PNG, or WebP
                        format.
                      </p>
                    </div>
                  )}
                </div>
                <input
                  id="categoryFile"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* <!-- Status & Visibility --> */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-bold text-white mb-4">
                Status & Visibility
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("isActive")}
                      className="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500"
                      // checked
                    />
                    <span className="ml-2 text-sm text-gray-400">
                      Active category
                    </span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("isFeaturedOnHomePage")}
                      className="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500"
                    />
                    <span className="ml-2 text-sm text-gray-400">
                      Featured on homepage
                    </span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("showOnNavigation")}
                      className="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500"
                      // checked
                    />
                    <span className="ml-2 text-sm text-gray-400">
                      Show in navigation menu
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
