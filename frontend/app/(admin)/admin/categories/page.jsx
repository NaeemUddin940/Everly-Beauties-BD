export default function page() {
  return (
    <div className=" flex-1 p-2">
      {/* <!-- Top Bar --> */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Category Management</h1>
          <p className="text-gray-400">
            Organize your products with categories and subcategories
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onclick="window.location.href='create-category.html'"
            className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
          >
            <i className="fas fa-plus mr-2"></i> Add Category
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories..."
              className="bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
        </div>
      </div>

      {/* <!-- Category Stats --> */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glassmorphism p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Total Categories</p>
              <h3 className="text-2xl font-bold text-white mt-2">24</h3>
            </div>
            <div className="bg-gradient-pink p-3 rounded-xl">
              <i className="fas fa-tags text-white text-xl"></i>
            </div>
          </div>
        </div>

        <div className="glassmorphism p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Main Categories</p>
              <h3 className="text-2xl font-bold text-white mt-2">8</h3>
            </div>
            <div className="bg-blue-500 p-3 rounded-xl">
              <i className="fas fa-folder text-white text-xl"></i>
            </div>
          </div>
        </div>

        <div className="glassmorphism p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Subcategories</p>
              <h3 className="text-2xl font-bold text-white mt-2">16</h3>
            </div>
            <div className="bg-green-500 p-3 rounded-xl">
              <i className="fas fa-folder-open text-white text-xl"></i>
            </div>
          </div>
        </div>

        <div className="glassmorphism p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Active Categories</p>
              <h3 className="text-2xl font-bold text-white mt-2">22</h3>
            </div>
            <div className="bg-purple-500 p-3 rounded-xl">
              <i className="fas fa-check-circle text-white text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Categories Tree View --> */}
      <div className="glassmorphism p-6 rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Category Hierarchy</h2>
          <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl text-sm transition-all duration-300 flex items-center">
            <i className="fas fa-expand mr-2"></i> Expand All
          </button>
        </div>

        <div className="space-y-2">
          {/* <!-- Makeup Category with Children --> */}
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button className="text-rose-gold mr-3">
                  <i className="fas fa-chevron-down"></i>
                </button>
                <div className="w-8 h-8 bg-gradient-pink rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-palette text-white text-sm"></i>
                </div>
                <div>
                  <h4 className="font-medium text-white">Makeup</h4>
                  <p className="text-xs text-gray-400">
                    48 products • 3 subcategories
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">
                  Active
                </span>
                <button className="text-rose-gold hover:text-pink-600 p-2">
                  <i className="fas fa-edit"></i>
                </button>
                <button className="text-red-400 hover:text-red-300 p-2">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>

            {/* <!-- Subcategories --> */}
            <div className="nested-category mt-3 space-y-2 pl-4">
              {/* <!-- Face Makeup --> */}
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-pink-400 rounded flex items-center justify-center mr-3">
                      <i className="fas fa-user text-white text-xs"></i>
                    </div>
                    <div>
                      <h5 className="font-medium text-white text-sm">
                        Face Makeup
                      </h5>
                      <p className="text-xs text-gray-400">22 products</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                    <button className="text-rose-gold hover:text-pink-600">
                      <i className="fas fa-edit text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* <!-- Eye Makeup --> */}
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-purple-400 rounded flex items-center justify-center mr-3">
                      <i className="fas fa-eye text-white text-xs"></i>
                    </div>
                    <div>
                      <h5 className="font-medium text-white text-sm">
                        Eye Makeup
                      </h5>
                      <p className="text-xs text-gray-400">18 products</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                    <button className="text-rose-gold hover:text-pink-600">
                      <i className="fas fa-edit text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* <!-- Lip Makeup --> */}
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-red-400 rounded flex items-center justify-center mr-3">
                      <i className="fas fa-lips text-white text-xs"></i>
                    </div>
                    <div>
                      <h5 className="font-medium text-white text-sm">
                        Lip Makeup
                      </h5>
                      <p className="text-xs text-gray-400">8 products</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                    <button className="text-rose-gold hover:text-pink-600">
                      <i className="fas fa-edit text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Skincare Category --> */}
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button className="text-rose-gold mr-3">
                  <i className="fas fa-chevron-right"></i>
                </button>
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-spa text-white text-sm"></i>
                </div>
                <div>
                  <h4 className="font-medium text-white">Skincare</h4>
                  <p className="text-xs text-gray-400">
                    36 products • 4 subcategories
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">
                  Active
                </span>
                <button className="text-rose-gold hover:text-pink-600 p-2">
                  <i className="fas fa-edit"></i>
                </button>
                <button className="text-red-400 hover:text-red-300 p-2">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>

          {/* <!-- Hair Care Category --> */}
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button className="text-rose-gold mr-3">
                  <i className="fas fa-chevron-right"></i>
                </button>
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-air-freshener text-white text-sm"></i>
                </div>
                <div>
                  <h4 className="font-medium text-white">Hair Care</h4>
                  <p className="text-xs text-gray-400">
                    28 products • 2 subcategories
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">
                  Active
                </span>
                <button className="text-rose-gold hover:text-pink-600 p-2">
                  <i className="fas fa-edit"></i>
                </button>
                <button className="text-red-400 hover:text-red-300 p-2">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Pagination --> */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-gray-400">Showing 1 to 8 of 18 brands</p>
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
  );
}
