export default function page() {
  return (
    <div>
      <div className="flex-1 p-2">
        {/* <!-- Top Bar --> */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Add Variable Product
            </h1>
            <p className="text-gray-400">
              Create a product with variations like shades, sizes, or finishes
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center">
              <i className="fas fa-times mr-2"></i> Cancel
            </button>
            <button className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center">
              <i className="fas fa-save mr-2"></i> Save Product
            </button>
          </div>
        </div>

        {/* <!-- Product Form --> */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* <!-- Left Column - Basic Info & Attributes --> */}
          <div className="lg:col-span-2 space-y-6">
            {/* <!-- Basic Information --> */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-bold text-white mb-4">
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Enter product name"
                    value="Pro Foundation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Description
                  </label>
                  <textarea
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-32 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Enter product description"
                  >
                    Professional foundation with buildable coverage and natural
                    finish. Available in multiple shades for all skin tones.
                  </textarea>
                </div>
              </div>
            </div>

            {/* <!-- Attributes --> */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Attributes</h2>
                <button className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center">
                  <i className="fas fa-plus mr-2"></i> Add Attribute
                </button>
              </div>

              {/* <!-- Shade Attribute --> */}
              <div className="mb-6 p-4 border border-gray-700 rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <h3 className="font-medium text-white">Shade</h3>
                    <span className="ml-2 px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                      Used for variations
                    </span>
                  </div>
                  <button className="text-red-400 hover:text-red-300">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="attribute-tag px-3 py-1 rounded-full text-sm flex items-center">
                    Porcelain{" "}
                    <button className="ml-2 text-xs">
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                  <span className="attribute-tag px-3 py-1 rounded-full text-sm flex items-center">
                    Ivory{" "}
                    <button className="ml-2 text-xs">
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                  <span className="attribute-tag px-3 py-1 rounded-full text-sm flex items-center">
                    Sand{" "}
                    <button className="ml-2 text-xs">
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                  <span className="attribute-tag px-3 py-1 rounded-full text-sm flex items-center">
                    Honey{" "}
                    <button className="ml-2 text-xs">
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                  <span className="attribute-tag px-3 py-1 rounded-full text-sm flex items-center">
                    Cocoa{" "}
                    <button className="ml-2 text-xs">
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                </div>
                <div className="flex">
                  <input
                    type="text"
                    className="bg-gray-800 border border-gray-700 rounded-l-xl px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Add new shade"
                  />
                  <button className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-r-xl font-medium transition-all duration-300">
                    Add
                  </button>
                </div>
              </div>

              {/* <!-- Finish Attribute --> */}
              <div className="p-4 border border-gray-700 rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <h3 className="font-medium text-white">Finish</h3>
                    <span className="ml-2 px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                      Used for variations
                    </span>
                  </div>
                  <button className="text-red-400 hover:text-red-300">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="attribute-tag px-3 py-1 rounded-full text-sm flex items-center">
                    Matte{" "}
                    <button className="ml-2 text-xs">
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                  <span className="attribute-tag px-3 py-1 rounded-full text-sm flex items-center">
                    Natural{" "}
                    <button className="ml-2 text-xs">
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                  <span className="attribute-tag px-3 py-1 rounded-full text-sm flex items-center">
                    Dewy{" "}
                    <button className="ml-2 text-xs">
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                </div>
                <div className="flex">
                  <input
                    type="text"
                    className="bg-gray-800 border border-gray-700 rounded-l-xl px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Add new finish"
                  />
                  <button className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-r-xl font-medium transition-all duration-300">
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* <!-- Variations --> */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Variations</h2>
                <div className="flex space-x-2">
                  <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center">
                    <i className="fas fa-sync-alt mr-2"></i> Generate All
                  </button>
                  <button className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center">
                    <i className="fas fa-plus mr-2"></i> Add Manually
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-3 px-4 text-left">Variation</th>
                      <th className="py-3 px-4 text-left">SKU</th>
                      <th className="py-3 px-4 text-left">Price</th>
                      <th className="py-3 px-4 text-left">Stock</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* <!-- Variation 1 --> */}
                    <tr className="variation-row border-b border-gray-800 transition-all duration-300">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-pink-200 rounded mr-3"></div>
                          <div>
                            <p className="font-medium text-white">
                              Porcelain / Matte
                            </p>
                            <p className="text-xs text-gray-400">
                              Shade: Porcelain, Finish: Matte
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <input
                          type="text"
                          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 w-24 focus:outline-none focus:ring-1 focus:ring-rose-gold"
                          value="FOUND-PM"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <input
                          type="number"
                          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 w-20 focus:outline-none focus:ring-1 focus:ring-rose-gold"
                          value="32.50"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <input
                          type="number"
                          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 w-16 focus:outline-none focus:ring-1 focus:ring-rose-gold"
                          value="25"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <button className="text-red-400 hover:text-red-300">
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>

                    {/* <!-- Variation 2 --> */}
                    <tr className="variation-row border-b border-gray-800 transition-all duration-300">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-amber-100 rounded mr-3"></div>
                          <div>
                            <p className="font-medium text-white">
                              Ivory / Natural
                            </p>
                            <p className="text-xs text-gray-400">
                              Shade: Ivory, Finish: Natural
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <input
                          type="text"
                          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 w-24 focus:outline-none focus:ring-1 focus:ring-rose-gold"
                          value="FOUND-IN"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <input
                          type="number"
                          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 w-20 focus:outline-none focus:ring-1 focus:ring-rose-gold"
                          value="34.00"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <input
                          type="number"
                          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 w-16 focus:outline-none focus:ring-1 focus:ring-rose-gold"
                          value="18"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <button className="text-red-400 hover:text-red-300">
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>

                    {/* <!-- Variation 3 --> */}
                    <tr className="variation-row border-b border-gray-800 transition-all duration-300">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-rose-300 rounded mr-3"></div>
                          <div>
                            <p className="font-medium text-white">
                              Honey / Dewy
                            </p>
                            <p className="text-xs text-gray-400">
                              Shade: Honey, Finish: Dewy
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <input
                          type="text"
                          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 w-24 focus:outline-none focus:ring-1 focus:ring-rose-gold"
                          value="FOUND-HD"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <input
                          type="number"
                          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 w-20 focus:outline-none focus:ring-1 focus:ring-rose-gold"
                          value="36.50"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <input
                          type="number"
                          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 w-16 focus:outline-none focus:ring-1 focus:ring-rose-gold"
                          value="12"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <button className="text-red-400 hover:text-red-300">
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* <!-- Right Column - Media & Organization --> */}
          <div className="space-y-6">
            {/* <!-- Product Image --> */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-bold text-white mb-4">
                Product Image
              </h2>
              <div className="image-upload-area rounded-xl p-8 text-center cursor-pointer">
                <i className="fas fa-cloud-upload-alt text-3xl text-rose-gold mb-3"></i>
                <p className="text-gray-400 mb-2">
                  Drag & drop main product image here
                </p>
                <p className="text-sm text-gray-500">or</p>
                <button className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl mt-3 font-medium transition-all duration-300">
                  Browse Files
                </button>
              </div>
            </div>

            {/* <!-- Variation Images --> */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-bold text-white mb-4">
                Variation Images
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-gray-700 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-pink-200 rounded-lg mr-3"></div>
                    <span className="text-sm text-white">
                      Porcelain / Matte
                    </span>
                  </div>
                  <button className="text-rose-gold hover:text-pink-600 text-sm">
                    <i className="fas fa-image mr-1"></i> Add Image
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-700 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg mr-3"></div>
                    <span className="text-sm text-white">Ivory / Natural</span>
                  </div>
                  <button className="text-rose-gold hover:text-pink-600 text-sm">
                    <i className="fas fa-image mr-1"></i> Add Image
                  </button>
                </div>
              </div>
            </div>

            {/* <!-- Organization --> */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-bold text-white mb-4">
                Organization
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Category
                  </label>
                  <select className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent">
                    <option>Foundation</option>
                    <option>Lipstick</option>
                    <option>Skincare</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Brand
                  </label>
                  <select className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent">
                    <option>Glamour Cosmetics</option>
                    <option>Luxe Beauty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Add tags separated by commas"
                    value="foundation, buildable, long-wear"
                  />
                </div>
              </div>
            </div>

            {/* <!-- Status --> */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-bold text-white mb-4">Status</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Visibility
                  </label>
                  <select className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent">
                    <option>Published</option>
                    <option>Draft</option>
                    <option>Hidden</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500"
                      checked
                    />
                    <span className="ml-2 text-sm text-gray-400">
                      Active product
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
