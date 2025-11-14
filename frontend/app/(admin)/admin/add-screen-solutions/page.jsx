export default function page() {
  return (
    <div>
      <div class="flex-1 p-2">
        {/* <!-- Top Bar --> */}
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-2xl font-bold text-white">
              Create New Screen Solution
            </h1>
            <p class="text-gray-400">
              Add a new skincare or beauty solution for specific skin types and
              concerns
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              onclick="window.location.href='screen-solutions.html'"
              class="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
            >
              <i class="fas fa-times mr-2"></i> Cancel
            </button>
            <button class="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center">
              <i class="fas fa-save mr-2"></i> Save Solution
            </button>
          </div>
        </div>

        {/* <!-- Solution Form --> */}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* <!-- Left Column - Basic Info --> */}
          <div class="lg:col-span-2 space-y-6">
            {/* <!-- Basic Information --> */}
            <div class="glassmorphism p-6 rounded-2xl shadow-md">
              <h2 class="text-xl font-bold text-white mb-4">
                Basic Information
              </h2>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">
                    Solution Name
                  </label>
                  <input
                    type="text"
                    class="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Enter solution name"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    class="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="solution-slug"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    URL-friendly version of the name
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">
                    Description
                  </label>
                  <textarea
                    class="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-32 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Describe this solution and its benefits"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* <!-- SEO Content Publishing --> */}
            <div class="glassmorphism p-6 rounded-2xl shadow-md">
              <h2 class="text-xl font-bold text-white mb-4">SEO Settings</h2>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    class="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Write here SEO title"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">
                    Description
                  </label>
                  <textarea
                    class="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-32 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Write here short description"
                  ></textarea>
                </div>

                {/* <!-- Make editor using React Draft Wysiwyg  --> */}
                {/* <!-- start  --> */}
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">
                    Bottom Content
                  </label>
                  <textarea
                    class="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-40 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Write here SEO content"
                  ></textarea>
                </div>
                {/* <!-- end  --> */}
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">
                    Schema Markup
                  </label>
                  <textarea
                    class="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-40 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Write here Schema Markup"
                  ></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">
                    Canonical URL{" "}
                  </label>
                  <input
                    type="url"
                    class="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Write here Canonical URL"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">
                    Focus Keywords
                  </label>
                  <input
                    type="text"
                    class="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="lip care, lip balm, lip scrub, lip treatment, bangladesh"
                  />
                  <p class="text-xs text-gray-500 mt-1">Separate with commas</p>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Right Column - Media & Settings --> */}
          <div class="space-y-6">
            {/* <!-- Solution Banner --> */}
            <div class="glassmorphism p-6 rounded-2xl shadow-md">
              <h2 class="text-xl font-bold text-white mb-4">Solution Banner</h2>
              <div class="image-upload-area rounded-xl p-6 text-center cursor-pointer">
                <i class="fas fa-image text-2xl text-rose-gold mb-2"></i>
                <p class="text-gray-400 text-sm mb-2">
                  Add banner image for solution pages
                </p>
                <p class="text-xs text-gray-500">Optional</p>
                <button class="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl mt-2 text-sm font-medium transition-all duration-300">
                  Upload Banner
                </button>
              </div>
              <div class="mt-4">
                <p class="text-xs text-gray-500">
                  Recommended size: 1200x300 pixels. Used on solution showcase
                  pages.
                </p>
              </div>
            </div>

            {/* <!-- Status & Visibility --> */}
            <div class="glassmorphism p-6 rounded-2xl shadow-md">
              <h2 class="text-xl font-bold text-white mb-4">
                Status & Visibility
              </h2>
              <div class="space-y-4">
                <div>
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      class="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500"
                      checked
                    />
                    <span class="ml-2 text-sm text-gray-400">
                      Active solution
                    </span>
                  </label>
                </div>
                <div>
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      class="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500"
                    />
                    <span class="ml-2 text-sm text-gray-400">
                      Featured on homepage
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
