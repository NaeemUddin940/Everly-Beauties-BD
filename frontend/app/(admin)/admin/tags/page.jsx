export default function page() {
  return (
    <div>
      <div className="flex-1 p-2">
        {/* <!-- Top Bar --> */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Tag Management</h1>
            <p className="text-gray-400">
              Manage product tags for better organization and filtering
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onclick="window.location.href='create-tag.html'"
              className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
            >
              <i className="fas fa-plus mr-2"></i> Add Tag
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search tags..."
                className="bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
          </div>
        </div>

        {/* <!-- Tag Stats --> */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Total Tags</p>
                <h3 className="text-2xl font-bold text-white mt-2">156</h3>
              </div>
              <div className="bg-gradient-pink p-3 rounded-xl">
                <i className="fas fa-hashtag text-white text-xl"></i>
              </div>
            </div>
          </div>
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Active Tags</p>
                <h3 className="text-2xl font-bold text-white mt-2">142</h3>
              </div>
              <div className="bg-green-500 p-3 rounded-xl">
                <i className="fas fa-check-circle text-white text-xl"></i>
              </div>
            </div>
          </div>{" "}
          {/* <!-- Quick Actions --> */}
          {/* <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl text-sm transition-all duration-300 flex items-center">
                <i className="fas fa-trash-alt mr-2"></i> Bulk Delete
              </button>
            </div>
          </div> */}
        </div>

        {/* <!-- Tags Table View --> */}
        <div className="glassmorphism p-6 rounded-2xl shadow-md">
          <div className="flex  items-center justify-between">
            <h2 className="text-xl font-bold text-white mb-6">Tags List</h2>
            <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl text-sm transition-all duration-300 flex items-center">
              <i className="fas fa-trash-alt mr-2"></i> Bulk Delete
            </button>
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
                  <th className="py-3 px-4 text-left">Tag</th>
                  <th className="py-3 px-4 text-left">Products</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* <!-- Vegan Tag --> */}
                <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-all duration-300">
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      className="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                        <i className="fas fa-leaf text-white text-sm"></i>
                      </div>
                      <div>
                        <p className="font-medium text-white">Vegan</p>
                        <p className="text-xs text-gray-400">vegan</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-rose-gold font-medium">48</span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-block px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded-full">
                      Active
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

                {/* <!-- Cruelty-Free Tag --> */}
                <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-all duration-300">
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      className="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                        <i className="fas fa-paw text-white text-sm"></i>
                      </div>
                      <div>
                        <p className="font-medium text-white">Cruelty-Free</p>
                        <p className="text-xs text-gray-400">cruelty-free</p>
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

                {/* <!-- Organic Tag --> */}
                <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-all duration-300">
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      className="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                        <i className="fas fa-seedling text-white text-sm"></i>
                      </div>
                      <div>
                        <p className="font-medium text-white">Organic</p>
                        <p className="text-xs text-gray-400">organic</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-rose-gold font-medium">34</span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-block px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded-full">
                      Active
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
            <p className="text-gray-400">Showing 1 to 12 of 156 tags</p>
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
