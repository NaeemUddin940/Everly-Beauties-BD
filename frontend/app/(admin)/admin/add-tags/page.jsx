/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import createSlug from "@/app/utils/SlugGenerator";
import { useTagStore } from "@/ZustandStore/useTagStore";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Page() {
  const { createTag } = useTagStore();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const newSlug = createSlug(name);
    setSlug(newSlug);
    setValue("slug", newSlug); // update react-hook-form value
  }, [name, setValue]);

  // Submit Handler
  const onSubmit = async (data) => {
    console.log("Final Form Data:", data);
    await createTag(data);
    reset();
    setSlug('')
  };

  return (
    <div>
      <div className="flex-1 p-2">
        {/* <!-- Top Bar --> */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Create New Tag</h1>
            <p className="text-gray-400">
              Add a new product tag for better organization and filtering
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => (window.location.href = "tags.html")}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
            >
              Cancel
            </button>

            {/* Save Button → submit form */}
            <button
              form="tagForm"
              type="submit"
              className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
            >
              Save Tag
            </button>
          </div>
        </div>

        {/* FORM START */}
        <form id="tagForm" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="glassmorphism p-6 rounded-2xl shadow-md">
                <h2 className="text-xl font-bold text-white mb-4">
                  Basic Information
                </h2>

                <div className="space-y-4">
                  {/* Tag Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Tag Name
                    </label>
                    <input
                      {...register("name", { required: true })}
                      type="text"
                      onChange={(e) => setName(e.target.value)}
                      className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full"
                      placeholder="Enter tag name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        Tag name is required
                      </p>
                    )}
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
                      placeholder="tag-slug"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      URL-friendly version of the tag name
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              <div className="glassmorphism p-6 rounded-2xl shadow-md">
                <h2 className="text-xl font-bold text-white mb-4">
                  Tag Settings
                </h2>

                <div className="space-y-4">
                  {/* Tag Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Tag Type
                    </label>
                    <select
                      {...register("type")}
                      className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full"
                    >
                      <option value="standard">Standard</option>
                      <option value="featured">Featured</option>
                    </select>
                  </div>

                  {/* Active Tag */}
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        {...register("isActive")}
                        type="checkbox"
                        className="custom-checkbox"
                      />
                      <span className="ml-2 text-sm text-gray-400">
                        Active tag
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
        {/* FORM END */}
      </div>
    </div>
  );
}
