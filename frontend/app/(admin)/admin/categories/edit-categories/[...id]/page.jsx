"use client";

import { useCategoryStore } from "@/ZustandStore/useCategoryStore";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const isSub = Boolean(id[1]); // sub category কিনা check

  const {
    getMainSingleCategory,
    getSubSingleCategory,
    singleSubCategory,
    singleMainCategory,
    updateMainCategory,
    updateSubCategory,
  } = useCategoryStore();

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      mainCategoryId: null,
      isActive: false,
      isFeaturedOnHomePage: false,
      showOnNavigation: false,
      image: null,
    },
  });

  const [localFile, setLocalFile] = useState(null);
  const [serverFile, setServerFile] = useState(null);

  /** 📌 Load category data (Main or Sub) */
  useEffect(() => {
    if (isSub) {
      getSubSingleCategory(id[1]); // sub category
    } else {
      getMainSingleCategory(id[0]); // main category
    }
  }, [id, isSub, getMainSingleCategory, getSubSingleCategory]);

  /** 📌 When store data loads → update form fields */
  useEffect(() => {
    const data = isSub ? singleSubCategory : singleMainCategory;
    if (!data?._id) return;

    reset({
      name: data.name,
      slug: data.slug,
      mainCategoryId: isSub ? id[0] : null, // ✔ Correct mainCategoryId for sub
      isActive: data.isActive,
      isFeaturedOnHomePage: data.isFeaturedOnHomePage,
      showOnNavigation: data.showOnNavigation,
      image: null,
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setServerFile(data.image || null);
    setLocalFile(null);
  }, [singleMainCategory, singleSubCategory, isSub, id, reset]);

  /** 📌 File Change */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalFile(URL.createObjectURL(file));
    setValue("image", file);
  };

  /** 📌 Submit Handler */
  const onSubmit = async (formData) => {
    router.push("/admin/categories");
    if (isSub) {
      console.log(formData);
      formData.mainCategoryId = id[0];
      await updateSubCategory(formData, id[1]);
      await getSubSingleCategory(id[1]);
    } else {
      await updateMainCategory(formData, id[0]);
      await getMainSingleCategory(id[0]);
    }

    setLocalFile(null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4 py-3">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isSub ? "Update Sub Category" : "Update Category"}
            </h1>
            <p className="text-gray-400">Update category information</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => reset()}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-pink-400 hover:bg-pink-600 text-white px-4 py-2 rounded-xl"
            >
              Update
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Category Name
            </label>
            <input
              type="text"
              {...register("name")}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full"
            />

            <label className="block text-sm font-medium text-gray-400 mb-2 mt-4">
              Slug
            </label>
            <input
              type="text"
              {...register("slug")}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full"
            />

            <div className="glassmorphism p-6 rounded-2xl shadow-md mt-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Status & Visibility
              </h2>

              <label className="flex items-center">
                <input type="checkbox" {...register("isActive")} />
                <span className="ml-2 text-sm text-gray-400">Active</span>
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
                  Show in navigation
                </span>
              </label>
            </div>
          </div>

          {/* IMAGE UPLOAD */}
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <label className="text-xl font-bold text-white mb-4 block">
              Category Image
              <div
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (!file) return;
                  const fileURL = URL.createObjectURL(file);
                  setLocalFile(fileURL);
                  setValue("image", file);
                }}
                onDragOver={(e) => e.preventDefault()}
                className="image-upload-area block rounded-xl p-8 text-center cursor-pointer border-2 border-dashed border-gray-600 hover:border-rose-gold transition-all"
              >
                {localFile || serverFile ? (
                  <Image
                    src={localFile ? localFile : `${API}${serverFile}`}
                    alt="category image"
                    width={400}
                    height={300}
                    className="object-cover w-full rounded-md"
                    unoptimized
                  />
                ) : (
                  <>
                    <i className="fas fa-cloud-upload-alt text-3xl text-rose-gold mb-3"></i>
                    <button
                      onClick={() =>
                        document.getElementById("categoryFile")?.click()
                      }
                      className="text-gray-400"
                    >
                      Upload category image
                    </button>
                  </>
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
