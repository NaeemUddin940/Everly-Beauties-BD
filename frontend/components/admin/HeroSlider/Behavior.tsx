export default function Behavior() {
  return (
    <div className="bg-gray-900 rounded-md border-t-2">
      <h2 className="text-[22px] md:text-3xl font-bold leading-tight tracking-[-0.015em] text-gray-900 dark:text-white px-4 pb-3 pt-5">
        Behavior
      </h2>
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-900 p-2 dark:border-[#344465] dark:bg-background-dark/50">
        {/* Enable AutoPlay  */}
        <div className="flex flex-1 flex-col items-start justify-between gap-4 rounded-lg px-5 mt-5 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-1">
            <p className="text-base font-bold text-gray-900 dark:text-white">
              Enable Autoplay
            </p>
            <p className="text-base font-normal text-gray-500 dark:text-[#93a5c8]">
              Slides will automatically advance.
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
        {/* AutoPlay Speed */}
        <div className="flex w-full items-end gap-4 px-4">
          <label className="flex flex-1 flex-col">
            <p className="pb-2 text-sm font-medium text-gray-600 dark:text-white">
              Autoplay Speed (ms)
            </p>
            <input className="form-input h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-white p-[15px] text-base font-normal leading-normal text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-[#344465] dark:bg-[#1a2232] dark:text-white dark:placeholder:text-[#93a5c8] dark:focus:border-primary" />
          </label>
        </div>
        <hr className="border-gray-200 dark:border-white/10 mx-5" />

        <div className="flex flex-1 flex-col items-start justify-between gap-4 rounded-lg px-5 mt-3 sm:flex-row sm:items-center">
          {/* Enable Infinite Loop */}
          <div className="flex flex-col gap-1">
            <p className="text-base font-bold text-gray-900 dark:text-white">
              Enable Infinite Loop
            </p>
            <p className="text-base font-normal text-gray-500 dark:text-[#93a5c8]">
              The slider will loop back to the beginning.
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

        {/* Transition Speed */}
        <div className="flex w-full items-end gap-4 px-4">
          <label className="flex flex-1 flex-col">
            <p className="pb-2 text-sm font-medium text-gray-600 dark:text-white">
              Transition Speed (ms)
            </p>
            <input className="form-input h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-white p-[15px] text-base font-normal leading-normal text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-[#344465] dark:bg-[#1a2232] dark:text-white dark:placeholder:text-[#93a5c8] dark:focus:border-primary" />
          </label>
        </div>
      </div>
    </div>
  );
}
