"use client";
import { useBrandStore } from "@/ZustandStore/useBrandStore";
/* eslint-disable react-hooks/rules-of-hooks */
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function page() {
  const { id } = useParams();

  const [localFile, setLocalFile] = useState(null); // User selected file
  const [serverFile, setServerFile] = useState(null); // Server image
  const { updateBrand, singleBrand, getSingleBrand } = useBrandStore();
  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      name: singleBrand?.name || "",
      slug: singleBrand?.slug || "",
      description: singleBrand?.description || "",
      isPremium: singleBrand?.isPremium || false,
      isFeatured: singleBrand?.isFeatured || false,
      isActive: singleBrand?.isActive || true,
      image: null,
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLocalFile(URL.createObjectURL(file));
    setValue("image", file);
  };

  useEffect(() => {
    getSingleBrand(id);
  }, [getSingleBrand, id]);

  useEffect(() => {
    if (!singleBrand) return;
    reset({
      name: singleBrand?.name || "",
      slug: singleBrand?.slug || "",
      description: singleBrand?.description || "",
      isPremium: singleBrand?.isPremium || false,
      isFeatured: singleBrand?.isFeatured || false,
      isActive: singleBrand?.isActive || true,
      image: null,
    });

    setServerFile(singleBrand?.image || null);
    setLocalFile(null);
  }, [singleBrand, id, reset]);

  async function onSubmit(data) {
    
    await updateBrand(data, id);

    setLocalFile(null);
    setServerFile(singleBrand?.image || null);
    reset();
  }

  console.log(singleBrand?.name);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex-1 p-2">
        {/* <!-- Top Bar --> */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Create New Brand</h1>
            <p className="text-gray-400">
              Add a new cosmetic brand to your store
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="reset"
              onClick={() => reset()}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
            >
              <i className="fas fa-times mr-2"></i> Cancel
            </button>
            <button
              type="submit"
              className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
            >
              <i className="fas fa-save mr-2"></i> Save Brand
            </button>
          </div>
        </div>

        {/* <!-- Brand Form --> */}
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
                    Brand Name
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Enter brand name"
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
                    placeholder="brand-slug"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL-friendly version of the name
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-32 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Enter brand description and story"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* <!-- SEO Content Publishing --> */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-bold text-white mb-4">
                SEO Settings
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
                    type="url"
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
            {/* <!-- Brand Logo --> */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <label
                htmlFor="brandFile"
                className="text-xl font-bold text-white mb-4"
              >
                Brand Image
                <div
                  className="image-upload-area rounded-xl p-4 text-center cursor-pointer border-2 border-dashed border-gray-600 hover:border-rose-gold transition-all duration-300"
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (!file) return;
                    const fileURL = URL.createObjectURL(file);
                    setSelectedFile(fileURL);
                    setValue("image", file);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {localFile || serverFile ? (
                    <Image
                      src={
                        localFile
                          ? localFile
                          : serverFile
                          ? process.env.NEXT_PUBLIC_API_BASE_URL + serverFile
                          : "/placeholder.png"
                      }
                      alt="category image"
                      width={400}
                      height={400}
                      className="object-cover h-[300px] w-full rounded-md"
                      unoptimized
                    />
                  ) : (
                    <>
                      <i className="fas fa-cloud-upload-alt text-xl text-rose-gold mb-3"></i>
                      <p className="text-gray-400 mb-2">
                        Drag & drop brand image here
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
                  id="brandFile"
                  type="file"
                  name="image"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* <!-- Brand Settings --> */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-bold text-white mb-4">
                Brand Settings
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("isActive")}
                      className="custom-checkbox"
                    />
                    <span className="ml-2 text-sm text-gray-400">
                      Active brand
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("isFeatured")}
                      className="custom-checkbox"
                    />
                    <span className="ml-2 text-sm text-gray-400">
                      Featured brand
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("isPremium")}
                      className="custom-checkbox"
                    />
                    <span className="ml-2 text-sm text-gray-400">
                      Premium Brands
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
