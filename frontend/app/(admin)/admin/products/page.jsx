import Link from "next/link";

export default function page() {
  return (
    <div>
      <div className=" flex-1 p-2">
        {/* <!-- Top Bar --> */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Product Management
            </h1>
            <p className="text-gray-400">
              Manage your cosmetics products inventory
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
            <div className="relative">
              <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-xl transition-all duration-300">
                <i className="fas fa-bell text-gray-300"></i>
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* <!-- Product Type Selection --> */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Add New Product</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* <!-- Simple Product Card --> */}
            <div
              className="glassmorphism product-type-card p-6 rounded-2xl shadow-md border border-gray-700 cursor-pointer"
              onclick="window.location.href='simple-product.html'"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-500/20 p-3 rounded-xl">
                  <i className="fas fa-cube text-blue-400 text-xl"></i>
                </div>
                <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full">
                  Simple
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Simple Product
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Single SKU item like a lipstick or foundation with no
                variations.
              </p>
              <Link
                href={"/admin/products/create-simple-product"}
                className="flex items-center text-rose-gold font-medium"
              >
                <span>Create Product</span>
                <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>

            {/* <!-- Variable Product Card --> */}
            <div
              className="glassmorphism product-type-card p-6 rounded-2xl shadow-md border border-gray-700 cursor-pointer"
              onclick="window.location.href='variable-product.html'"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-purple-500/20 p-3 rounded-xl">
                  <i className="fas fa-palette text-purple-400 text-xl"></i>
                </div>
                <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">
                  Variable
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Variable Product
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Product with options like shades, sizes, or finishes.
              </p>
              <Link
                href={"/admin/products/create-variable-product"}
                className="flex items-center text-rose-gold font-medium"
              >
                <span>Create Product</span>
                <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>

            {/* <!-- Combo Product Card --> */}
            <div
              className="glassmorphism product-type-card p-6 rounded-2xl shadow-md border border-gray-700 cursor-pointer"
              onclick="window.location.href='combo-product.html'"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-green-500/20 p-3 rounded-xl">
                  <i className="fas fa-gift text-green-400 text-xl"></i>
                </div>
                <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">
                  Combo
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Combo Product
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Bundle of multiple items sold together as a set.
              </p>
              <Link
                href={"/admin/products/create-combo-product"}
                className="flex items-center text-rose-gold font-medium"
              >
                <span>Create Product</span>
                <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* <!-- Filters --> */}
        <div className="glassmorphism p-6 rounded-2xl shadow-md mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Category
              </label>
              <select className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent">
                <option>All Categories</option>
                <option>Lipstick</option>
                <option>Foundation</option>
                <option>Skincare</option>
                <option>Eyeshadow</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Brand
              </label>
              <select className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent">
                <option>All Brands</option>
                <option>Luxe Beauty</option>
                <option>Glamour Cosmetics</option>
                <option>Pure Skin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Type
              </label>
              <select className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent">
                <option>All Types</option>
                <option>Simple</option>
                <option>Variable</option>
                <option>Combo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Status
              </label>
              <select className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Stock
              </label>
              <select className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent">
                <option>All Stock</option>
                <option>In Stock</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* <!-- Products Table --> */}
        <div className="glassmorphism p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">All Products</h2>
            <div className="flex space-x-2">
              <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl text-sm transition-all duration-300 flex items-center">
                <i className="fas fa-download mr-2"></i> Export
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl text-sm transition-all duration-300 flex items-center">
                <i className="fas fa-sync-alt mr-2"></i> Refresh
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 px-4 text-left">
                    <input
                      type="checkbox"
                      className="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500"
                    />
                  </th>
                  <th className="py-3 px-4 text-left">Product</th>
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-left">Brand</th>
                  <th className="py-3 px-4 text-left">Price</th>
                  <th className="py-3 px-4 text-left">Stock</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* <!-- Simple Product Row --> */}
                <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-all duration-300">
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      className="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-pink rounded-lg flex items-center justify-center text-white mr-3">
                        <i className="fas fa-lipstick"></i>
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          Matte Liquid Lipstick
                        </p>
                        <p className="text-sm text-gray-400">SKU: LIP-001</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300">
                      <i className="fas fa-cube mr-1"></i> Simple
                    </span>
                  </td>
                  <td className="py-4 px-4">Lipstick</td>
                  <td className="py-4 px-4">Luxe Beauty</td>
                  <td className="py-4 px-4">
                    <p className="font-medium text-white">$24.99</p>
                    <p className="text-sm text-gray-400 line-through">$29.99</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-medium text-white">142</p>
                    <p className="text-sm text-green-400">In Stock</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded-full">
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-all duration-300">
                        <i className="fas fa-edit text-rose-gold"></i>
                      </button>
                      <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-all duration-300">
                        <i className="fas fa-copy text-blue-400"></i>
                      </button>
                      <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-all duration-300">
                        <i className="fas fa-trash text-red-400"></i>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* <!-- Variable Product Row --> */}
                <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-all duration-300">
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      className="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-white mr-3">
                        <i className="fas fa-palette"></i>
                      </div>
                      <div>
                        <p className="font-medium text-white">Pro Foundation</p>
                        <p className="text-sm text-gray-400">SKU: FOUND-005</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-300">
                      <i className="fas fa-palette mr-1"></i> Variable
                    </span>
                  </td>
                  <td className="py-4 px-4">Foundation</td>
                  <td className="py-4 px-4">Glamour Cosmetics</td>
                  <td className="py-4 px-4">
                    <p className="font-medium text-white">$32.50 - $45.00</p>
                    <p className="text-sm text-gray-400">5 variants</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-medium text-white">87</p>
                    <p className="text-sm text-yellow-400">Low Stock</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded-full">
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-all duration-300">
                        <i className="fas fa-edit text-rose-gold"></i>
                      </button>
                      <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-all duration-300">
                        <i className="fas fa-copy text-blue-400"></i>
                      </button>
                      <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-all duration-300">
                        <i className="fas fa-trash text-red-400"></i>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* <!-- Combo Product Row --> */}
                <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-all duration-300">
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      className="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-white mr-3">
                        <i className="fas fa-gift"></i>
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          Complete Makeup Kit
                        </p>
                        <p className="text-sm text-gray-400">SKU: KIT-012</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-300">
                      <i className="fas fa-gift mr-1"></i> Combo
                    </span>
                  </td>
                  <td className="py-4 px-4">Makeup Set</td>
                  <td className="py-4 px-4">Luxe Beauty</td>
                  <td className="py-4 px-4">
                    <p className="font-medium text-white">$89.99</p>
                    <p className="text-sm text-gray-400 line-through">
                      $124.99
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-medium text-white">24</p>
                    <p className="text-sm text-green-400">In Stock</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded-full">
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-all duration-300">
                        <i className="fas fa-edit text-rose-gold"></i>
                      </button>
                      <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-all duration-300">
                        <i className="fas fa-copy text-blue-400"></i>
                      </button>
                      <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-all duration-300">
                        <i className="fas fa-trash text-red-400"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* <!-- Pagination --> */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-gray-400">Showing 1 to 10 of 1,248 products</p>
            <div className="flex space-x-2">
              <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-all duration-300">
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="bg-rose-gold text-white p-2 rounded-lg w-10">
                1
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg w-10">
                2
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg w-10">
                3
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-all duration-300">
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
