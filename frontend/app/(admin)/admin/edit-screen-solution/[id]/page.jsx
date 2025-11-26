/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useScreenSolutionStore } from "@/ZustandStore/useScreenSolutionStore";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Page() {
  const { id } = useParams();
  const {
    getSingleScreenSolution,
    singleScreenSolution,
    updateScreenSolution,
  } = useScreenSolutionStore();

  // --- State ---
  const [localFile, setLocalFile] = useState(null); // User selected file
  const [serverFile, setServerFile] = useState(null); // Server image

  // --- Form ---
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      name: singleScreenSolution?.name || "",
      slug: singleScreenSolution?.slug || "",
      description: singleScreenSolution?.description || "",
      isActive: singleScreenSolution?.isActive ?? true,
      seoTitle: singleScreenSolution?.seoTitle || "",
      seoDescription: singleScreenSolution?.seoDescription || "",
      bottomContent: singleScreenSolution?.bottomContent || "",
      schemaMarkup: singleScreenSolution?.schemaMarkup || "",
      canonicalUrl: singleScreenSolution?.canonicalUrl || "",
      keywords: singleScreenSolution?.keywords || "",
      image: null,
    },
  });

  // --- Fetch Data ---
  useEffect(() => {
    getSingleScreenSolution(id);
  }, [id, getSingleScreenSolution]);

  // --- Reset form when data loads ---
  useEffect(() => {
    if (singleScreenSolution?._id === id) {
      reset({
        name: singleScreenSolution.name || "",
        slug: singleScreenSolution.slug || "",
        description: singleScreenSolution.description || "",
        isActive: singleScreenSolution.isActive ?? true,
        seoTitle: singleScreenSolution.seoTitle || "",
        seoDescription: singleScreenSolution.seoDescription || "",
        bottomContent: singleScreenSolution.bottomContent || "",
        schemaMarkup: singleScreenSolution.schemaMarkup || "",
        canonicalUrl: singleScreenSolution.canonicalUrl || "",
        keywords: singleScreenSolution.keywords || "",
        image: null,
      });

      setServerFile(singleScreenSolution.image || null);
      setLocalFile(null);
    }
  }, [singleScreenSolution, id, reset]);

  // --- File Change Handler ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLocalFile(URL.createObjectURL(file));
    setValue("image", file);
  };

  // --- Drag & Drop Handler ---
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setLocalFile(URL.createObjectURL(file));
    setValue("image", file);
  };

  // --- Form Submit ---
  const onSubmit = async (data) => {
    await updateScreenSolution(data, id);

    // Reset after update
    await getSingleScreenSolution(id);
    setLocalFile(null);
    setServerFile(singleScreenSolution.image || null);
    reset();
  };

  console.log(serverFile);

  return (
    <div className="flex-1 p-2">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {singleScreenSolution?.name
              ? `Update ${singleScreenSolution.name}`
              : "Loading Solution..."}
          </h1>
          <p className="text-gray-400">
            Edit skincare or beauty solution details.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              reset();
              setLocalFile(null);
              setServerFile(singleScreenSolution?.image || null);
            }}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
          >
            Cancel Changes
          </button>

          <button
            form="solutionForm"
            type="submit"
            className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
          >
            Update Solution
          </button>
        </div>
      </div>

      {/* FORM */}
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
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Solution Name
                  </label>
                  <input
                    {...register("name", { required: true })}
                    type="text"
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full"
                    placeholder="Enter solution name"
                  />
                </div>

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
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    SEO Title
                  </label>
                  <input
                    {...register("seoTitle")}
                    type="text"
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full"
                    placeholder="Write SEO title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    SEO Description
                  </label>
                  <textarea
                    {...register("seoDescription")}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-32"
                    placeholder="Write SEO description"
                  />
                </div>

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
                  {localFile || serverFile ? (
                    <Image
                      src={
                        localFile
                          ? localFile
                          : serverFile
                          ? process.env.NEXT_PUBLIC_API_BASE_URL + serverFile
                          : "/placeholder.png"
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
    </div>
  );
}
