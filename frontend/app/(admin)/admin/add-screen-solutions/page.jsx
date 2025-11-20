"use client";

import createSlug from "@/app/utils/SlugGenerator";
import { useScreenSolutionStore } from "@/ZustandStore/useScreenSolutionStore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Page() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const { register, handleSubmit, reset, setValue } = useForm();
  const { createScreenSolution } = useScreenSolutionStore();

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(URL.createObjectURL(file));
      setValue("image", file);
    }
  };

  useEffect(() => {
    const newSlug = createSlug(name);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSlug(newSlug);
    setValue("slug", newSlug); // update react-hook-form value
  }, [name, setValue]);

  const onSubmit = async (data) => {
    console.log("Final Form Data:", data);
    await createScreenSolution(data);
    reset();
    setSelectedFile("");
    setSlug("");
  };

  return (
    <div>
      <div className="flex-1 p-2">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Create New Screen Solution
            </h1>
            <p className="text-gray-400">
              Add a new skincare or beauty solution for specific skin types and
              concerns
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => reset()}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
            >
              Cancel
            </button>

            <button
              form="solutionForm"
              type="submit"
              className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
            >
              Save Solution
            </button>
          </div>
        </div>

        {/* FORM START */}
        <form id="solutionForm" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN */}
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
                      {...register("name", { required: true })}
                      type="text"
                      onChange={(e) => setName(e.target.value)}
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
                      value={slug.toLocaleLowerCase()}
                      onChange={(e) => setSlug(e.target.value)}
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

              {/* SEO Settings */}
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
                      // {...register("seoTitle")}
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
                      // {...register("seoDescription")}
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
                      // {...register("bottomContent")}
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
                      // {...register("schemaMarkup")}
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
                      // {...register("canonicalUrl")}
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
                      // {...register("keywords")}
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
              {/* <!-- Solution Banner --> */}
              <div className="glassmorphism p-6 rounded-2xl shadow-md">
                <h2 className="text-xl font-bold text-white mb-4">
                  Solution Banner
                </h2>

                <div
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    setSelectedFile(url);
                    setValue("image", file);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  className="image-upload-area rounded-xl p-6 text-center cursor-pointer"
                >
                  <label htmlFor="solutionBanner">
                    {selectedFile ? (
                      <Image
                        src={selectedFile}
                        alt="SolutionBanner"
                        width={600}
                        height={300}
                        className="rounded-xl w-full h-auto object-cover"
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
