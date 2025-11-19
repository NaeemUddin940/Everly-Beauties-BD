"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function Page({ onSubmit, updatingData = {} }) {
  // Use updatingData?.image for initial state if present.
  // This state is correctly re-initialized when the form key changes and forces a remount.
  const [selectedFile, setSelectedFile] = useState(updatingData?.image || null);

  // FIX: useForm defaults correctly initialized via the key prop below.
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      name: updatingData?.name || "",
      slug: updatingData?.slug || "",
      description: updatingData?.description || "",
      isActive: updatingData?.isActive ?? true,
      seoTitle: updatingData?.seoTitle || "",
      seoDescription: updatingData?.seoDescription || "",
      bottomContent: updatingData?.bottomContent || "",
      schemaMarkup: updatingData?.schemaMarkup || "",
      canonicalUrl: updatingData?.canonicalUrl || "",
      keywords: updatingData?.keywords || "",
      // Do NOT include image, as it's handled via setValue on file select.
    },
  });

  const router = useRouter();

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // 1. Create a local object URL for instant preview
      setSelectedFile(URL.createObjectURL(file));
      // 2. Set the actual File object into the form data
      setValue("image", file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setSelectedFile(url);
    setValue("image", file);
  };

  // Define the form key: unique ID for edit, or a static string for create
  const formKey = updatingData?._id || "create-new-solution";

  return (
    <div>
      <div className="flex-1 p-2">
        {/* Top Bar (omitted for brevity) */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {updatingData?.name ? "Update " : "Create New "}
              Screen Solution
            </h1>
            <p className="text-gray-400">
              {updatingData?.name ? "Update " : "Create New "} skincare or
              beauty solution for specific skin types and concerns
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                if (updatingData?._id) {
                  router.push("/admin/screen-solutions");
                } else {
                  reset();
                  setSelectedFile(null);
                }
              }}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
            >
              Cancel
            </button>

            <button
              form="solutionForm"
              type="submit"
              className="bg-rose-gold cursor-pointer hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
            >
              {updatingData?.name ? "Update" : "Create"}
            </button>
          </div>
        </div>

        {/* FORM START */}
        {/* FIX: Add key prop to force re-initialization when switching items */}
        <form id="solutionForm" key={formKey} onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN (omitted for brevity) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="glassmorphism p-6 rounded-2xl shadow-md">
                <h2 className="text-xl font-bold text-white mb-4">
                  Basic Information
                </h2>
                <div className="space-y-4">
                  {/* Solution Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Solution Name
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full"
                      placeholder="Enter solution name"
                    />
                  </div>
                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Slug
                    </label>
                    <input
                      {...register("slug")}
                      type="text"
                      className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full"
                      placeholder="solution-slug"
                    />
                  </div>
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Description
                    </label>
                    <textarea
                      {...register("description")}
                      className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-32"
                      placeholder="Describe this solution"
                    />
                  </div>
                </div>
              </div>
              {/* SEO Settings (omitted fields) */}
              <div className="glassmorphism p-6 rounded-2xl shadow-md">
                <h2 className="text-xl font-bold text-white mb-4">
                  SEO Settings
                </h2>
                <div className="space-y-4">
                  {/* SEO Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Title
                    </label>
                    <input
                      {...register("seoTitle")}
                      type="text"
                      className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full"
                      placeholder="Write SEO title"
                    />
                  </div>
                  {/* SEO Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Description
                    </label>
                    <textarea
                      {...register("seoDescription")}
                      className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-32"
                      placeholder="Write SEO description"
                    />
                  </div>
                  {/* Bottom Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Bottom Content
                    </label>
                    <textarea
                      {...register("bottomContent")}
                      className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-40"
                      placeholder="Bottom content"
                    />
                  </div>
                  {/* Schema Markup */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Schema Markup
                    </label>
                    <textarea
                      {...register("schemaMarkup")}
                      className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-40"
                      placeholder="Schema Markup"
                    />
                  </div>
                  {/* Canonical URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Canonical URL
                    </label>
                    <input
                      {...register("canonicalUrl")}
                      type="url"
                      className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full"
                      placeholder="Canonical URL"
                    />
                  </div>
                  {/* Focus Keywords */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Focus Keywords
                    </label>
                    <input
                      {...register("keywords")}
                      type="text"
                      className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full"
                      placeholder="lip care, lip balm, lip scrub"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* Banner Upload */}
              <div className="glassmorphism p-6 rounded-2xl shadow-md">
                <h2 className="text-xl font-bold text-white mb-4">
                  Solution Banner
                </h2>

                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="image-upload-area rounded-xl p-6 text-center cursor-pointer"
                >
                  <label htmlFor="solutionBanner">
                    {selectedFile ? (
                      <Image
                        src={
                          // CORRECT LOGIC: If it starts with '/', it needs the base URL. Otherwise, it's a blob URL.
                          selectedFile.startsWith("/")
                            ? `http://localhost:8080${selectedFile}`
                            : selectedFile
                        }
                        alt="SolutionBanner"
                        width={600}
                        height={300}
                        className="rounded-xl w-full h-auto object-cover"
                        unoptimized
                      />
                    ) : (
                      <>
                        <i className="fas fa-image text-2xl text-rose-gold mb-2"></i>
                        <p className="text-gray-400 text-sm mb-2">
                          Add banner image for solution pages
                        </p>
                        <p className="text-xs text-gray-500">Optional</p>

                        <button
                          type="button"
                          onClick={() =>
                            document.getElementById("solutionBanner")?.click()
                          }
                          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl mt-2 text-sm font-medium transition-all duration-300"
                        >
                          Upload Banner
                        </button>
                      </>
                    )}
                  </label>

                  <input
                    id="solutionBanner"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <div className="mt-4">
                  <p className="text-xs text-gray-500">
                    Recommended size: 1200x300 pixels.
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="glassmorphism p-6 rounded-2xl shadow-md">
                <h2 className="text-xl font-bold text-white mb-4">
                  Status & Visibility
                </h2>

                <label className="flex items-center">
                  <input
                    {...register("isActive")}
                    type="checkbox"
                    className="custom-checkbox checked:bg-pink-500 checked:border-pink-500"
                  />
                  <span className="ml-2 text-sm text-gray-400">
                    Active solution
                  </span>
                </label>
              </div>
            </div>
          </div>
        </form>
        {/* FORM END */}
      </div>
    </div>
  );
}
