/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCategoryStore } from "@/ZustandStore/useCategoryStore";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Page() {
  const { id } = useParams();
  const { getMainSingleCategory, updateMainCategory, singleMainCategory } =
    useCategoryStore();

  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      name: singleMainCategory?.name || "",
      slug: singleMainCategory?.slug || "",
      isActive: singleMainCategory?.isActive || false,
      isFeaturedOnHomePage: singleMainCategory?.isFeaturedOnHomePage || false,
      showOnNavigation: singleMainCategory?.showOnNavigation || false,
      image: null,
    },
  });

  const [localFile, setLocalFile] = useState(null); // User selected file
  const [serverFile, setServerFile] = useState(null); // Server image

  /** 📌 Load category */
  useEffect(() => {
    getMainSingleCategory(id);
  }, [getMainSingleCategory, id]);

  /** 📌 When data comes → set form + preview image */
  useEffect(() => {
    if (!singleMainCategory) return;

    if (singleMainCategory?._id) {
      reset({
        name: singleMainCategory?.name || "",
        slug: singleMainCategory?.slug || "",
        isActive: singleMainCategory?.isActive || false,
        isFeaturedOnHomePage: singleMainCategory?.isFeaturedOnHomePage || false,
        showOnNavigation: singleMainCategory?.showOnNavigation || false,
        image: null,
      });

      // Show preview image from server

      setServerFile(singleMainCategory?.image || null);
      setLocalFile(null);
    }
  }, [singleMainCategory, id, reset]);

  /** 📌 Handle image change */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLocalFile(URL.createObjectURL(file));
    setValue("image", file);
  };

  /** 📌 Submit */
  const onSubmit = async (data) => {
    console.log("Submitted Data:", data);
    await updateMainCategory(data, id);

    await getMainSingleCategory(id);
    setLocalFile(null);
    setServerFile(singleMainCategory?.image || null);
    reset();
  };

  // console.log("server", API + serverFile);
  console.log("local", serverFile ? API + serverFile : localFile);
  console.log("singleMainCategory", API + singleMainCategory?.image);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4 py-3">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Update Category</h1>
            <p className="text-gray-400">
              Update a category to organize your products
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => reset()}
              className="bg-gray-800 hover:bg-gray-700 cursor-pointer text-white px-4 py-2 rounded-xl font-medium transition-all duration-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-pink-400 cursor-pointer hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300"
            >
              Update Category
            </button>
          </div>
        </div>

        {/* FORM */}
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
          <div>
            {/* Name */}
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Category Name
            </label>
            <input
              type="text"
              {...register("name")}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none"
            />

            {/* Slug */}
            <label className="block text-sm font-medium text-gray-400 mb-2 mt-4">
              Slug
            </label>
            <input
              type="text"
              {...register("slug")}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none"
            />

            {/* Checkboxes */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md mt-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Status & Visibility
              </h2>

              <label className="flex items-center">
                <input type="checkbox" {...register("isActive")} />
                <span className="ml-2 text-sm text-gray-400">
                  Active category
                </span>
              </label>

              <label className="flex items-center mt-3">
                <input type="checkbox" {...register("isFeaturedOnHomePage")} />
                <span className="ml-2 text-sm text-gray-400">
                  Featured on homepage
                </span>
              </label>

              <label className="flex items-center mt-3">
                <input type="checkbox" {...register("showOnNavigation")} />
                <span className="ml-2 text-sm text-gray-400">
                  Show in navigation menu
                </span>
              </label>
            </div>
          </div>

          {/* IMAGE UPLOAD */}
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <label className="text-xl font-bold text-white mb-4 block">
              Category Image
            </label>

            <label
              htmlFor="categoryFile"
              className="image-upload-area block rounded-xl p-8 text-center cursor-pointer border-2 border-dashed border-gray-600 hover:border-rose-gold transition-all duration-300"
            >
              {localFile || serverFile ? (
                <Image
                  src={
                    localFile
                      ? localFile
                      : serverFile
                      ? `http://localhost:8080${serverFile}`
                      : "/placeholder.png"
                  }
                  alt="category image"
                  width={400}
                  height={300}
                  className="object-cover w-full rounded-md"
                  unoptimized
                />
              ) : (
                <>
                  <i className="fas fa-cloud-upload-alt text-3xl text-rose-gold mb-3"></i>
                  <p className="text-gray-400 mb-2">
                    Drag & drop category image here
                  </p>
                  <p className="text-sm text-gray-500">or Browse Files</p>
                </>
              )}
            </label>

            <input
              id="categoryFile"
              type="file"
              accept="image/png, image/jpeg, image/webp, image/jpg"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
