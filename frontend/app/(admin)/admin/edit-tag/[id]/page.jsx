"use client";

import { useTagStore } from "@/ZustandStore/useTagStore";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function Page() {
  const router = useRouter();
  const { updateTag, getSingleTag, singleTag } = useTagStore();
  const { id } = useParams();

  // React Hook Form
  const { register, handleSubmit, reset } = useForm();

  // Load single tag
  useEffect(() => {
    getSingleTag(id);
  }, [getSingleTag, id]);

  // Set default form values WHEN data loads
  useEffect(() => {
    if (singleTag) {
      reset({
        name: singleTag.name,
        slug: singleTag.slug,
        type: singleTag.type,
        isActive: singleTag.isActive,
      });
    }
  }, [singleTag, reset]);

  // Submit Handler
  const onSubmit = async (data) => {
    router.push("/admin/tags");
    await updateTag(data, id);
  };

  return (
    <div>
      <div className="flex-1 p-2">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Update Tag</h1>
            <p className="text-gray-400">
              Update product tag for better organization and filtering
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => reset()}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl"
            >
              Cancel
            </button>

            <button
              form="tagForm"
              type="submit"
              className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl"
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
              <div className="glassmorphism p-6 rounded-2xl shadow-md">
                <h2 className="text-xl font-bold text-white mb-4">
                  Basic Information
                </h2>

                <div className="space-y-4">
                  {/* Tag Name */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Tag Name
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full"
                      placeholder="Enter tag name"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Slug
                    </label>
                    <input
                      {...register("slug")}
                      type="text"
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
                    <label className="block text-sm text-gray-400 mb-2">
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
