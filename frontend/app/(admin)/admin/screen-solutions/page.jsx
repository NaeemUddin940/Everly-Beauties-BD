export default function page() {
  return (
    <div>
      <div className="flex-1 p-2">
        {/* <!-- Top Bar --> */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Screen Solutions Management
            </h1>
            <p className="text-gray-400">
              Organize skincare and beauty solutions by skin types and concerns
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onclick="window.location.href='create-screen-solution.html'"
              className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
            >
              <i className="fas fa-plus mr-2"></i> Add Solution
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search solutions..."
                className="bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
          </div>
        </div>

        {/* <!-- Solution Stats --> */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Total Solutions</p>
                <h3 className="text-2xl font-bold text-white mt-2">32</h3>
              </div>
              <div className="bg-gradient-pink p-3 rounded-xl">
                <i className="fas fa-spa text-white text-xl"></i>
              </div>
            </div>
          </div>

          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Skin Type Solutions</p>
                <h3 className="text-2xl font-bold text-white mt-2">12</h3>
              </div>
              <div className="bg-blue-500 p-3 rounded-xl">
                <i className="fas fa-user text-white text-xl"></i>
              </div>
            </div>
          </div>

          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Skin Concern Solutions</p>
                <h3 className="text-2xl font-bold text-white mt-2">15</h3>
              </div>
              <div className="bg-green-500 p-3 rounded-xl">
                <i className="fas fa-heart text-white text-xl"></i>
              </div>
            </div>
          </div>

          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Active Solutions</p>
                <h3 className="text-2xl font-bold text-white mt-2">28</h3>
              </div>
              <div className="bg-purple-500 p-3 rounded-xl">
                <i className="fas fa-check-circle text-white text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Solutions Tree View --> */}

        {/* <!-- Brands Table View --> */}
        <div className="glassmorphism p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold text-white mb-6">
            Screen Solutions List
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 px-4 text-left">Screen Solutions</th>
                  <th className="py-3 px-4 text-left">Products</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* <!-- Luxe Beauty --> */}
                <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-all duration-300">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="logo-preview w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-pink mr-3">
                        <span className="text-white font-bold text-xs">AP</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">Acne & Pimples</p>
                        <p className="text-xs text-gray-400">acne-pimples</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-rose-gold font-medium">124</span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-block px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded-full">
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-2 py-1 text-xs bg-gray-500/20 text-gray-300 rounded-full">
                      Standard
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button className="text-rose-gold hover:text-pink-600 p-2">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="text-blue-400 hover:text-blue-300 p-2">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="text-red-400 hover:text-red-300 p-2">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* <!-- Glamour Cosmetics --> */}
                <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-all duration-300">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="logo-preview w-10 h-10 rounded-lg flex items-center justify-center bg-purple-500 mr-3">
                        <span className="text-white font-bold text-xs">DS</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">Dark Spots</p>
                        <p className="text-xs text-gray-400">dark-spots</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-rose-gold font-medium">89</span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-block px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded-full">
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full">
                      Featured
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button className="text-rose-gold hover:text-pink-600 p-2">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="text-blue-400 hover:text-blue-300 p-2">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="text-red-400 hover:text-red-300 p-2">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* <!-- Pure Skin --> */}
                <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-all duration-300">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="logo-preview w-10 h-10 rounded-lg flex items-center justify-center bg-blue-500 mr-3">
                        <span className="text-white font-bold text-xs">DU</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          Dullness & Uneven Skin Tone
                        </p>
                        <p className="text-xs text-gray-400">
                          dullness-uneven-skin-tone
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-rose-gold font-medium">67</span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-block px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded-full">
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-2 py-1 text-xs bg-gray-500/20 text-gray-300 rounded-full">
                      Standard
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button className="text-rose-gold hover:text-pink-600 p-2">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="text-blue-400 hover:text-blue-300 p-2">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="text-red-400 hover:text-red-300 p-2">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
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
    </div>
  );
}
