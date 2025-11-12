export default function DIsplayAndNavigation() {
  return (
    <div className="bg-gray-900 rounded-md border-t-2">
      <h2 className="text-[22px]  md:text-3xl font-bold leading-tight tracking-[-0.015em] text-gray-900 dark:text-white px-4 pb-3 pt-5">
        Display &amp; Navigation
      </h2>
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-900 p-2 dark:border-[#344465] dark:bg-background-dark/50">
        <div className="grid grid-cols-1 gap-4 px-4 py-3 sm:grid-cols-2">
          <label className="flex flex-1 flex-col">
            <p className="pb-2 text-sm font-medium text-gray-600 dark:text-white">
              Slides to Show
            </p>
            <input className="form-input h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-white p-[15px] text-base font-normal leading-normal text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-[#344465] dark:bg-[#1a2232] dark:text-white dark:placeholder:text-[#93a5c8] dark:focus:border-primary" />
          </label>
          <label className="flex flex-1 flex-col">
            <p className="pb-2 text-sm font-medium text-gray-600 dark:text-white">
              Slides to Scroll
            </p>
            <input className="form-input h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-white p-[15px] text-base font-normal leading-normal text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-[#344465] dark:bg-[#1a2232] dark:text-white dark:placeholder:text-[#93a5c8] dark:focus:border-primary" />
          </label>
        </div>
        <hr className="border-gray-200 dark:border-white/10 mx-5" />
        <div className="flex flex-1 flex-col items-start justify-between gap-4 rounded-lg p-5 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-1">
            <p className="text-base font-bold text-gray-900 dark:text-white">
              Show Navigation Arrows
            </p>
            <p className="text-base font-normal text-gray-500 dark:text-[#93a5c8]">
              Display previous/next buttons.
            </p>
          </div>
          <label className="relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-gray-200 p-0.5 has-[:checked]:bg-primary dark:bg-[#243047]">
            <div
              className="h-full w-[27px] rounded-full bg-white"
              //   style="box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 8px, rgba(0, 0, 0, 0.06) 0px 3px 1px;"
            ></div>
            <input
              //   checked=""
              className="invisible absolute"
              type="checkbox"
            />
          </label>
        </div>
        <hr className="border-gray-200 dark:border-white/10 mx-5" />
        <div className="flex flex-1 flex-col items-start justify-between gap-4 rounded-lg p-5 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-1">
            <p className="text-base font-bold text-gray-900 dark:text-white">
              Show Pagination Dots
            </p>
            <p className="text-base font-normal text-gray-500 dark:text-[#93a5c8]">
              Display dot indicators for slides.
            </p>
          </div>
          <label className="relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-gray-200 p-0.5 has-[:checked]:bg-primary dark:bg-[#243047]">
            <div
              className="h-full w-[27px] rounded-full bg-white"
              //   style="box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 8px, rgba(0, 0, 0, 0.06) 0px 3px 1px;"
            ></div>
            <input className="invisible absolute" type="checkbox" />
          </label>
        </div>
      </div>
    </div>
  );
}
