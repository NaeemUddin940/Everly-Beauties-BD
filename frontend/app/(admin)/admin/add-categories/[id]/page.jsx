/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function page() {
  const [selectedFile, setSelectedFile] = useState(null);
  const { register, handleSubmit, setValue, reset } = useForm();

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(URL.createObjectURL(file));
      setValue("image", file);
    }
  };

  function onSubmit(data) {
    console.log(data);
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4 py-3">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Update New Category
            </h1>
            <p className="text-gray-400">
              Update a category to organize your products
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-gray-800 hover:bg-gray-700 cursor-pointer text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center">
              <i className="fas fa-times mr-2"></i> Cancel
            </button>
            <button
              type="submit"
              className="bg-pink-400 cursor-pointer hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
            >
              <i className="fas fa-save mr-2"></i> Update Category
            </button>
          </div>
        </div>
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
          <div>
            <div>
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
            <div>
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
                        className="rounded-md size-4 bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500"
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
                        className="rounded-md size-4 bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500"
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
                        className="rounded-md size-4 bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500"
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
          {/* Image Upload Box */}
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
        </div>
      </div>
    </form>
  );
}
