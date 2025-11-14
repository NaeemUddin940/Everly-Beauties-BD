export default function page() {
  return (
    <div>
      <div className="flex-1 p-2">
        {/* <!-- Top Bar --> */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Add Combo Product</h1>
            <p className="text-gray-400">
              Create a bundle of multiple products sold together
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center">
              <i className="fas fa-times mr-2"></i> Cancel
            </button>
            <button className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center">
              <i className="fas fa-save mr-2"></i> Save Combo
            </button>
          </div>
        </div>

        {/* <!-- Product Form --> */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* <!-- Left Column - Basic Info & Components --> */}
          <div className="lg:col-span-2 space-y-6">
            {/* <!-- Basic Information --> */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-bold text-white mb-4">
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Combo Name
                  </label>
                  <input
                    type="text"
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Enter combo name"
                    value="Complete Makeup Starter Kit"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Description
                  </label>
                  <textarea
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-32 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Enter combo description"
                  >
                    Everything you need to create a flawless makeup look. This
                    starter kit includes our best-selling foundation, lipstick,
                    mascara, and brushes at an incredible value.
                  </textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Combo SKU"
                    value="KIT-STARTER-01"
                  />
                </div>
              </div>
            </div>

            {/* <!-- Combo Components --> */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">
                  Combo Components
                </h2>
                <button className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center">
                  <i className="fas fa-plus mr-2"></i> Add Product
                </button>
              </div>

              <div className="space-y-4">
                {/* <!-- Component 1 --> */}
                <div className="combo-item p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-pink rounded-lg flex items-center justify-center text-white mr-3">
                        <i className="fas fa-lipstick"></i>
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          Matte Liquid Lipstick
                        </p>
                        <p className="text-sm text-gray-400">
                          SKU: LIP-001 | $24.99
                        </p>
                      </div>
                    </div>
                    <button className="text-red-400 hover:text-red-300">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 w-20 focus:outline-none focus:ring-1 focus:ring-rose-gold"
                        value="1"
                        min="1"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Discount
                      </label>
                      <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 w-full focus:outline-none focus:ring-1 focus:ring-rose-gold">
                        <option>No Discount</option>
                        <option>10% Off</option>
                        <option selected>15% Off</option>
                        <option>20% Off</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* <!-- Component 2 --> */}
                <div className="combo-item p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center text-white mr-3">
                        <i className="fas fa-palette"></i>
                      </div>
                      <div>
                        <p className="font-medium text-white">Pro Foundation</p>
                        <p className="text-sm text-gray-400">
                          SKU: FOUND-005 | $34.00
                        </p>
                      </div>
                    </div>
                    <button className="text-red-400 hover:text-red-300">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 w-20 focus:outline-none focus:ring-1 focus:ring-rose-gold"
                        value="1"
                        min="1"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Discount
                      </label>
                      <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 w-full focus:outline-none focus:ring-1 focus:ring-rose-gold">
                        <option>No Discount</option>
                        <option>10% Off</option>
                        <option selected>15% Off</option>
                        <option>20% Off</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* <!-- Component 3 --> */}
                <div className="combo-item p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-white mr-3">
                        <i className="fas fa-eye"></i>
                      </div>
                      <div>
                        <p className="font-medium text-white">Volume Mascara</p>
                        <p className="text-sm text-gray-400">
                          SKU: MASC-003 | $18.50
                        </p>
                      </div>
                    </div>
                    <button className="text-red-400 hover:text-red-300">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 w-20 focus:outline-none focus:ring-1 focus:ring-rose-gold"
                        value="1"
                        min="1"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Discount
                      </label>
                      <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 w-full focus:outline-none focus:ring-1 focus:ring-rose-gold">
                        <option>No Discount</option>
                        <option>10% Off</option>
                        <option selected>15% Off</option>
                        <option>20% Off</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- Pricing Summary --> */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-bold text-white mb-4">
                Pricing Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">
                    Individual Product Total:
                  </span>
                  <span className="text-white font-medium">$77.49</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Combo Discount (15%):</span>
                  <span className="text-green-400 font-medium">-$11.62</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-700">
                  <span className="text-white font-medium">
                    Final Combo Price:
                  </span>
                  <span className="text-rose-gold font-bold text-lg">
                    $65.87
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">You Save:</span>
                  <span className="text-green-400 text-sm font-medium">
                    15% ($11.62)
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Combo Price Override
                </label>
                <div className="flex">
                  <span className="bg-gray-800 border border-r-0 border-gray-700 rounded-l-xl px-4 py-3 text-gray-400">
                    $
                  </span>
                  <input
                    type="number"
                    className="bg-gray-800 border border-gray-700 rounded-r-xl px-4 py-3 flex-1 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="0.00"
                    value="65.87"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Set a custom price for the combo (overrides automatic
                  calculation)
                </p>
              </div>
            </div>
          </div>

          {/* <!-- Right Column - Media & Settings --> */}
          <div className="space-y-6">
            {/* <!-- Combo Image --> */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-bold text-white mb-4">Combo Image</h2>
              <div className="image-upload-area rounded-xl p-8 text-center cursor-pointer">
                <i className="fas fa-cloud-upload-alt text-3xl text-rose-gold mb-3"></i>
                <p className="text-gray-400 mb-2">
                  Drag & drop combo image here
                </p>
                <p className="text-sm text-gray-500">or</p>
                <button className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl mt-3 font-medium transition-all duration-300">
                  Browse Files
                </button>
              </div>
            </div>

            {/* <!-- Combo Settings --> */}
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-bold text-white mb-4">
                Combo Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Discount Type
                  </label>
                  <select className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent">
                    <option>Percentage Discount</option>
                    <option>Fixed Amount</option>
                    <option>Set Combo Price</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Discount Value
                  </label>
                  <div className="flex">
                    <span className="bg-gray-800 border border-r-0 border-gray-700 rounded-l-xl px-4 py-3 text-gray-400">
                      %
                    </span>
                    <input
                      type="number"
                      className="bg-gray-800 border border-gray-700 rounded-r-xl px-4 py-3 flex-1 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                      value="15"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500"
                      checked
                    />
                    <span className="ml-2 text-sm text-gray-400">
                      Allow individual product purchase
                    </span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500"
                    />
                    <span className="ml-2 text-sm text-gray-400">
                      Limited time offer
                    </span>
                  </label>
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
                    <option selected>Makeup Set</option>
                    <option>Skincare Kit</option>
                    <option>Gift Set</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Brand
                  </label>
                  <select className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent">
                    <option selected>Luxe Beauty</option>
                    <option>Glamour Cosmetics</option>
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
                    value="starter kit, bundle, value set"
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
                      Active combo
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
