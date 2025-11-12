"use client";
import { Button } from "@/components/ui/button";
import { useHeroSliderStore } from "@/ZustandStore/useHeroSliderStore";
import {
  CloudUpload,
  Edit,
  Loader,
  PlusCircleIcon,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

export default function AddSLider() {
  const { register, handleSubmit, setValue, reset } = useForm();

  const { addSlider, getAllSlides, allSlides, deleteSlide, isUploading } =
    useHeroSliderStore();

  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState("");
  const UploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    setImagePreview(previewURL);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result; // এইটা backend এ পাঠাবে

      setValue("sliderImage", base64);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data) => {
    const payload = {
      sliderImage: data.sliderImage,
      sliderTitle: data.sliderTitle,
      sliderLink: data.sliderLink,
    };

    await addSlider(payload);
    await getAllSlides();
    reset();
    setImagePreview("");
  };

  async function handleDelete(id) {
    await deleteSlide(id);
  }
  return (
    <div className="flex flex-col gap-6 border-t-2 rounded-md">
      <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="p-5">
          <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] text-gray-900 dark:text-white">
            Slider Image Management
          </h2>
          <p className="text-base font-normal text-gray-500 dark:text-[#93a5c8]">
            Add, remove, and reorder the images in your slider.
          </p>
        </div>
        <button className="flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg border-2 border-primary bg-primary/10 px-4 text-sm font-medium text-primary transition-colors hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30">
          Add New Slide <PlusCircleIcon />
        </button>
      </div>
      <div className="rounded-xl border border-gray-200 bg-gray-900 p-4 dark:border-[#344465] dark:bg-background-dark/50">
        <div className="space-y-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 rounded-lg border border-primary/50 bg-primary/5 p-4 dark:border-primary/70 dark:bg-primary/10"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-gray-600 dark:text-white">
                  Slider Image
                </p>
                <div className="flex items-center justify-center w-full">
                  <label
                    className="flex flex-col items-center justify-center w-full h-60 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-[#1a2232] hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-[#243047] transition-colors"
                    htmlFor="dropzone-file"
                  >
                    <div className="flex flex-col h-60 w-full items-center justify-center pt-5 pb-6">
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt=""
                          height={224} // optional, matches h-56
                          width={560} // optional, set to container width
                          className="object-cover max-h-full max-w-full rounded-md"
                        />
                      ) : (
                        <>
                          {" "}
                          <span className="material-symbols-outlined text-4xl text-gray-500 dark:text-gray-400">
                            <CloudUpload />
                          </span>
                          <p className="mb-2 text-sm text-center text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            SVG, PNG, JPG (REC. 1920x1080px)
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      className="hidden"
                      id="dropzone-file"
                      ref={fileInputRef}
                      type="file"
                      onChange={UploadImage}
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <label className="flex flex-1 flex-col">
                  <p className="pb-2 text-sm font-medium text-gray-600 dark:text-white">
                    Slider Title
                  </p>
                  <input
                    className=" w-full min-w-0 py-2 resize-none overflow-hidden rounded-lg border border-gray-300 bg-white px-[15px] text-base font-normal leading-normal text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-[#344465] dark:bg-[#1a2232] dark:text-white dark:placeholder:text-[#93a5c8] dark:focus:border-primary"
                    placeholder="e.g. Summer Sale"
                    {...register("sliderTitle")}
                  />
                </label>
                <label className="flex flex-1 flex-col">
                  <p className="pb-2 text-sm font-medium text-gray-600 dark:text-white">
                    Slider Link (URL)
                  </p>
                  <input
                    className="form-input py-2 w-full resize-none overflow-hidden rounded-lg border border-gray-300 bg-white p-[15px] text-base font-normal leading-normal text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-[#344465] dark:bg-[#1a2232] dark:text-white dark:placeholder:text-[#93a5c8] dark:focus:border-primary"
                    placeholder="e.g. /products/summer-collection"
                    {...register("sliderLink")}
                  />
                </label>
                <div className="flex items-center justify-end gap-3">
                  <button className="flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-gray-200 dark:bg-white/5 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-300 dark:hover:bg-white/10">
                    Cancel
                  </button>
                  <Button className="flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary  px-4 text-sm font-medium ">
                    {isUploading ? (
                      <Loader className="animate-spin" />
                    ) : (
                      "Save Slide"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
          <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 p-4 dark:border-white/10 sm:flex-row sm:items-center">
            {allSlides.map((slide) => (
              <div
                key={slide._id}
                className="flex items-center justify-between gap-5"
              >
                <div className="flex items-center gap-4">
                  <Image
                    height={100}
                    width={100}
                    alt={slide.sliderTitle}
                    className="h-16 w-32 rounded-md object-cover"
                    src={slide.sliderImage}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Summer Sale
                  </p>
                  <p className="text-sm text-gray-500 dark:text-[#93a5c8]">
                    Links to: /products/summer-collection
                  </p>
                </div>
                <div className="flex gap-2 self-start sm:self-center">
                  <button
                    // onClick={handleEdit(slide._id)}
                    className="flex  h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
                  >
                    <Edit />
                  </button>
                  <button
                    onClick={() => handleDelete(slide._id)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
