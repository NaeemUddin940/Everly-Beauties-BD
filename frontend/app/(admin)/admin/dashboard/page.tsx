import Topbar from "@/components/admin/Topbar";

export default function page() {
  return (
    <div>
      <Topbar />
      <div className=" flex-1 py-4">
        {/* <!-- Stats Cards --> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glassmorphism p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Total Products</p>
                <h3 className="text-2xl font-bold text-white mt-2">1,248</h3>
                <p className="text-green-400 text-sm mt-1 flex items-center">
                  <i className="fas fa-arrow-up mr-1"></i> 12% from last month
                </p>
              </div>
              <div className="bg-gradient-pink p-3 rounded-xl">
                <i className="fas fa-box-open text-white text-xl"></i>
              </div>
            </div>
          </div>

          <div className="glassmorphism p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Total Orders</p>
                <h3 className="text-2xl font-bold text-white mt-2">342</h3>
                <p className="text-rose-gold text-sm mt-1">18 pending</p>
              </div>
              <div className="bg-gradient-pink p-3 rounded-xl">
                <i className="fas fa-shopping-cart text-white text-xl"></i>
              </div>
            </div>
          </div>

          <div className="glassmorphism p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <h3 className="text-2xl font-bold text-white mt-2">$24,580</h3>
                <p className="text-green-400 text-sm mt-1 flex items-center">
                  <i className="fas fa-arrow-up mr-1"></i> 8.2% from last month
                </p>
              </div>
              <div className="bg-gradient-pink p-3 rounded-xl">
                <i className="fas fa-dollar-sign text-white text-xl"></i>
              </div>
            </div>
          </div>

          <div className="glassmorphism p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Total Customers</p>
                <h3 className="text-2xl font-bold text-white mt-2">8,452</h3>
                <p className="text-green-400 text-sm mt-1 flex items-center">
                  <i className="fas fa-arrow-up mr-1"></i> 5.3% from last month
                </p>
              </div>
              <div className="bg-gradient-pink p-3 rounded-xl">
                <i className="fas fa-users text-white text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Charts and Recent Orders --> */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* <!-- Sales Chart --> */}
          <div className="lg:col-span-2 chart-container p-6 rounded-2xl shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                Monthly Sales Overview
              </h2>
              <div className="flex space-x-2">
                <button className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-lg text-sm transition-all duration-300">
                  Monthly
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-lg text-sm transition-all duration-300">
                  Quarterly
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-lg text-sm transition-all duration-300">
                  Yearly
                </button>
              </div>
            </div>

            {/* <!-- Chart Placeholder --> */}
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <i className="fas fa-chart-line text-4xl text-rose-gold mb-4"></i>
                <p className="text-gray-400">
                  Sales chart visualization would appear here
                </p>
              </div>
            </div>
          </div>

          {/* <!-- Recent Orders --> */}
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-white mb-6">Recent Orders</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                <div>
                  <p className="font-medium text-white">#ORD-7842</p>
                  <p className="text-sm text-gray-400">Luxury Lipstick Set</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">$124.99</p>
                  <span className="inline-block px-2 py-1 text-xs bg-yellow-500/20 text-yellow-300 rounded-full">
                    Pending
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                <div>
                  <p className="font-medium text-white">#ORD-7841</p>
                  <p className="text-sm text-gray-400">Skincare Bundle</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">$89.50</p>
                  <span className="inline-block px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full">
                    Processing
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                <div>
                  <p className="font-medium text-white">#ORD-7840</p>
                  <p className="text-sm text-gray-400">
                    Foundation & Concealer
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">$67.25</p>
                  <span className="inline-block px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded-full">
                    Completed
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                <div>
                  <p className="font-medium text-white">#ORD-7839</p>
                  <p className="text-sm text-gray-400">Eye Shadow Palette</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">$45.99</p>
                  <span className="inline-block px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded-full">
                    Completed
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-white">#ORD-7838</p>
                  <p className="text-sm text-gray-400">Makeup Brushes Set</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">$32.75</p>
                  <span className="inline-block px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded-full">
                    Completed
                  </span>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 bg-gray-800 hover:bg-gray-700 py-2 rounded-xl text-rose-gold font-medium transition-all duration-300">
              View All Orders
            </button>
          </div>
        </div>

        {/* <!-- Best Sellers and Low Stock --> */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* <!-- Best Selling Products --> */}
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-white mb-6">
              Best Selling Products
            </h2>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-pink flex items-center justify-center text-white">
                  <i className="fas fa-lipstick"></i>
                </div>
                <div className="ml-4 flex-1">
                  <p className="font-medium text-white">
                    Matte Liquid Lipstick
                  </p>
                  <p className="text-sm text-gray-400">128 sold this month</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">$24.99</p>
                  <p className="text-sm text-green-400">+24%</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-pink flex items-center justify-center text-white">
                  <i className="fas fa-palette"></i>
                </div>
                <div className="ml-4 flex-1">
                  <p className="font-medium text-white">
                    Pro Eyeshadow Palette
                  </p>
                  <p className="text-sm text-gray-400">96 sold this month</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">$52.50</p>
                  <p className="text-sm text-green-400">+18%</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-pink flex items-center justify-center text-white">
                  <i className="fas fa-spa"></i>
                </div>
                <div className="ml-4 flex-1">
                  <p className="font-medium text-white">Hydrating Face Serum</p>
                  <p className="text-sm text-gray-400">87 sold this month</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">$34.99</p>
                  <p className="text-sm text-green-400">+12%</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-pink flex items-center justify-center text-white">
                  <i className="fas fa-air-freshener"></i>
                </div>
                <div className="ml-4 flex-1">
                  <p className="font-medium text-white">Setting Spray</p>
                  <p className="text-sm text-gray-400">74 sold this month</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">$18.50</p>
                  <p className="text-sm text-green-400">+9%</p>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Low Stock Warning --> */}
          <div className="glassmorphism p-6 rounded-2xl shadow-md border-l-4 border-rose-gold">
            <h2 className="text-xl font-bold text-white mb-6">
              Low Stock Products
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                <div>
                  <p className="font-medium text-white">Mascara - Black</p>
                  <p className="text-sm text-gray-400">Only 5 items left</p>
                </div>
                <button className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300">
                  Restock
                </button>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                <div>
                  <p className="font-medium text-white">Concealer - Light</p>
                  <p className="text-sm text-gray-400">Only 3 items left</p>
                </div>
                <button className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300">
                  Restock
                </button>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                <div>
                  <p className="font-medium text-white">Blush - Rose</p>
                  <p className="text-sm text-gray-400">Only 7 items left</p>
                </div>
                <button className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300">
                  Restock
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-white">Makeup Remover</p>
                  <p className="text-sm text-gray-400">Only 4 items left</p>
                </div>
                <button className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300">
                  Restock
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
