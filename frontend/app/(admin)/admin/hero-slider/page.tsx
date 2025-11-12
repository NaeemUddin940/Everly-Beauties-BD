"use clietn";
import Behavior from "@/components/admin/HeroSlider/Behavior";
import DIsplayAndNavigation from "@/components/admin/HeroSlider/DIsplayAndNavigation";
import HeroSlider from "@/components/home/HeroSlider";
import { Edit, PlusCircleIcon, Trash2 } from "lucide-react";
import Image from "next/image";

export default function page() {
  return (
    <div>
      <div
        className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display"
        // style='font-family: "Spline Sans", "Noto Sans", sans-serif;'
      >
        <div className="flex h-full grow flex-col">
          <div className="flex flex-1 justify-center p-4 sm:p-6 md:p-8">
            <div className="flex w-full max-w-7xl flex-col">
              {/* <div className="flex flex-wrap items-center justify-between gap-4 pb-8">
                <div className="flex flex-col gap-1">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
                    Hero Slider Settings
                  </p>
                  <p className="text-base font-normal text-gray-500 dark:text-[#93a5c8]">
                    Manage the behavior and appearance of the hero slider on the
                    homepage.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-gray-200 dark:bg-white/5 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-300 dark:hover:bg-white/10">
                    Reset to Default
                  </button>
                  <button className="flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-4 text-sm font-medium text-white">
                    Save Changes
                  </button>
                </div>
              </div> */}
              <div className="flex flex-col gap-10">
                {/* Live Preview */}
                <HeroSlider />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Behavior */}
                  <Behavior />
                  {/* Display Navigation */}
                  <DIsplayAndNavigation />
                </div>

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
                      <div className="flex flex-col gap-6 rounded-lg border border-primary/50 bg-primary/5 p-4 dark:border-primary/70 dark:bg-primary/10">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-gray-600 dark:text-white">
                              Slider Image
                            </p>
                            <div className="flex items-center justify-center w-full">
                              <label
                                className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-[#1a2232] hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-[#243047] transition-colors"
                                htmlFor="dropzone-file"
                              >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <span className="material-symbols-outlined text-4xl text-gray-500 dark:text-gray-400">
                                    cloud_upload
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
                                </div>
                                <input
                                  className="hidden"
                                  id="dropzone-file"
                                  type="file"
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
                                className="form-input h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-white p-[15px] text-base font-normal leading-normal text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-[#344465] dark:bg-[#1a2232] dark:text-white dark:placeholder:text-[#93a5c8] dark:focus:border-primary"
                                placeholder="e.g. Summer Sale"
                              />
                            </label>
                            <label className="flex flex-1 flex-col">
                              <p className="pb-2 text-sm font-medium text-gray-600 dark:text-white">
                                Slider Link (URL)
                              </p>
                              <input
                                className="form-input h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-white p-[15px] text-base font-normal leading-normal text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-[#344465] dark:bg-[#1a2232] dark:text-white dark:placeholder:text-[#93a5c8] dark:focus:border-primary"
                                placeholder="e.g. /products/summer-collection"
                              />
                            </label>
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-3">
                          <button className="flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-gray-200 dark:bg-white/5 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-300 dark:hover:bg-white/10">
                            Cancel
                          </button>
                          <button className="flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-4 text-sm font-medium text-white">
                            Save Slide
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4 dark:border-white/10 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-4">
                          <Image
                            height={100}
                            width={100}
                            alt="Summer Sale Banner"
                            className="h-16 w-32 rounded-md object-cover"
                            src="https://images.unsplash.com/photo-1618783609530-e60ae69093a4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MTR8ODYxMzg1MHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=500"
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
                          <button className="flex  h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10">
                            <Edit />
                          </button>
                          <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10">
                            <Trash2 />
                          </button>
                        </div>
                      </div>
                      {/* <div className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4 dark:border-white/10 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-4">
                          <button className="cursor-grab text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                            <span className="material-symbols-outlined">
                              drag_indicator
                            </span>
                          </button>
                          <img
                            alt="New Arrivals"
                            className="h-16 w-32 rounded-md object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbIKBHvmdDKtj74SDwE-TOdID1k5ZZYwBA2aJy-fH1cmCL8vIufp0gmSbZP4ornvG-0-YG228RNJKPEPa_ldAm0Nf4R-00em6CVp-Gvq4wF6gJHEiSpKXkCP6pakpqncGO2GtOmIkwhp3fgHQYbb4WhV8ySaZD56pkgztwjSx7nPR-88oUUAGQXo8rFzhjJ5tZyHmxtzH1_yHIxU1pGwVpAJOG3XtbgF2MAgJ5SyoCfNqgZCqIqxL9suViM_1d5iwzhQPp53_SmgD0"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            New Arrivals
                          </p>
                          <p className="text-sm text-gray-500 dark:text-[#93a5c8]">
                            Links to: /products/new
                          </p>
                        </div>
                        <div className="flex gap-2 self-start sm:self-center">
                          <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10">
                            <span className="material-symbols-outlined text-xl">
                              edit
                            </span>
                          </button>
                          <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10">
                            <span className="material-symbols-outlined text-xl">
                              delete
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4 dark:border-white/10 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-4">
                          <button className="cursor-grab text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                            <span className="material-symbols-outlined">
                              drag_indicator
                            </span>
                          </button>
                          <img
                            alt="Clearance Event"
                            className="h-16 w-32 rounded-md object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGORLsQleW6er0g01SbB77Cw1Y8fRGPxAzENeWmwMqa4SPjRnmgbqEAcPVaQuteE0GTmxg9eOIA9dfDlsZREP45UrcRpy4Yvq-uOeI_5lYpQBov0WTrRDjammLm1tFcRvnGySk87PW7G-N8_2aFkgcywAGCjZp4beEfni9T-H-QOZy3dNbZC9BNQaa0TI530UnIIkFKk8YISF0lsIUbpyIJzGxvv45Wuv-WRTQIHjvY1iSSJC2F8Ys4swR0CH9ze5xE05th6WCHbfk"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            Clearance Event
                          </p>
                          <p className="text-sm text-gray-500 dark:text-[#93a5c8]">
                            Links to: /sale
                          </p>
                        </div>
                        <div className="flex gap-2 self-start sm:self-center">
                          <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10">
                            <span className="material-symbols-outlined text-xl">
                              edit
                            </span>
                          </button>
                          <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10">
                            <span className="material-symbols-outlined text-xl">
                              delete
                            </span>
                          </button>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
