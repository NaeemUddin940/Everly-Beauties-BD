"use clietn";
import AddSLider from "@/components/admin/HeroSlider/AddSLider";
import Behavior from "@/components/admin/HeroSlider/Behavior";
import DIsplayAndNavigation from "@/components/admin/HeroSlider/DIsplayAndNavigation";
import HeroSlider from "@/components/home/HeroSlider";

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

                <AddSLider />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
