"use client";
/* eslint-disable react-hooks/rules-of-hooks */
import { useBrandStore } from "@/ZustandStore/useBrandStore";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function page() {
  const [page, setPage] = useState(1);
  // Default Brand List Show
  const [limit, setLimit] = useState(5);
  const { getAllBrands, allBrands, deleteBrand } = useBrandStore();
  useEffect(() => {
    getAllBrands(page, limit);
  }, [getAllBrands, page, limit]);
  return (
    <div>
      <div className="flex-1 p-2">
        {/* <!-- Top Bar --> */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Brand Management</h1>
            <p className="text-gray-400">
              Manage cosmetic brands and their information
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              //   onClick="window.location.href='create-brand.html'"
              className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
            >
              <i className="fas fa-plus mr-2"></i> Add Brand
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search brands..."
                className="bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
          </div>
        </div>

        {/* <!-- Brand Stats --> */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Total Brands</p>
                <h3 className="text-2xl font-bold text-white mt-2">
                  {allBrands?.totalBrands}
                </h3>
              </div>
              <div className="bg-gradient-pink p-3 rounded-xl">
                <i className="fas fa-copyright text-white text-xl"></i>
              </div>
            </div>
          </div>

          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Active Brands</p>
                <h3 className="text-2xl font-bold text-white mt-2">
                  {allBrands?.activeBrands}
                </h3>
              </div>
              <div className="bg-green-500 p-3 rounded-xl">
                <i className="fas fa-check-circle text-white text-xl"></i>
              </div>
            </div>
          </div>

          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Premium Brands</p>
                <h3 className="text-2xl font-bold text-white mt-2">
                  {allBrands?.premiumBrands}
                </h3>
              </div>
              <div className="bg-yellow-500 p-3 rounded-xl">
                <i className="fas fa-crown text-white text-xl"></i>
              </div>
            </div>
          </div>

          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Featured Brands</p>
                <h3 className="text-2xl font-bold text-white mt-2">
                  {allBrands?.featuredBrands}
                </h3>
              </div>
              <div className="bg-purple-500 p-3 rounded-xl">
                <i className="fas fa-star text-white text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Brands Table View --> */}
        <div className="glassmorphism p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold text-white mb-6">Brands List</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 px-4 text-left">Brand</th>
                  <th className="py-3 px-4 text-left">Products</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {allBrands?.brands?.length > 0 ? (
                  allBrands.brands.map((brand) => (
                    <tr
                      key={brand._id}
                      className="border-b border-gray-800 hover:bg-gray-800/50 transition-all duration-300"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-pink rounded-lg flex items-center justify-center mr-3">
                            <Image
                              src={
                                process.env.NEXT_PUBLIC_API_BASE_URL +
                                brand.image
                              }
                              alt={brand.name}
                              width={100}
                              height={100}
                              className="object-cover h-full w-full rounded-md"
                              unoptimized
                            />
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {brand.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {brand.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-rose-gold font-medium">124</span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            brand.isActive
                              ? "bg-green-500/20 text-green-300"
                              : "bg-red-500/30 text-red-300"
                          }`}
                        >
                          {brand.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-4 px-4 flex gap-2">
                        {brand.isPremium && (
                          <span className="inline-block px-2 py-1 text-xs bg-yellow-500/20 text-yellow-300 rounded-full">
                            Premium
                          </span>
                        )}
                        {brand.isFeatured && (
                          <span className="inline-block px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full">
                            Featured
                          </span>
                        )}
                        {!brand.isPremium && !brand.isFeatured && (
                          <span className="inline-block px-2 py-1 text-xs bg-gray-500/20 text-gray-300 rounded-full">
                            Standard
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/edit-brand/${brand._id}`}
                            className="text-rose-gold hover:text-pink-600 p-2"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>
                          <button className="text-blue-400 hover:text-blue-300 p-2">
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            onClick={async () => await deleteBrand(brand._id)}
                            className="text-red-400 hover:text-red-500 cursor-pointer p-2"
                          >
                            <Trash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-400 py-10">
                      No Brands Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* <!-- Pagination --> */}
          <div className="flex justify-between items-center mt-6">
            <div className="flex gap-5 items-center">
              <p className="text-gray-400 whitespace-nowrap">
                Showing {allBrands?.pagination?.currentPage} to{" "}
                {allBrands?.pagination?.totalPages} of{" "}
                {allBrands?.pagination?.totalDocs} tags
              </p>
              <select
                onChange={(e) => setLimit(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 w-full"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              {/* Prev Button */}
              <button
                disabled={!allBrands?.pagination?.hasPrevPage}
                onClick={() => setPage(allBrands.pagination?.prevPage)}
                className=" bg-gray-800 hover:bg-gray-700 cursor-pointer disabled:hover:bg-gray-800 disabled:cursor-not-allowed  disabled:opacity-30 rounded-lg transition-all duration-300 w-8 h-8"
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              {/* Page Numbers */}
              {[...Array(allBrands?.pagination?.totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                const isActive =
                  pageNumber === allBrands?.pagination?.currentPage;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`p-2 rounded-lg w-10 transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-rose-gold text-white"
                        : "bg-gray-800 hover:bg-gray-700"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                disabled={!allBrands?.pagination?.hasNextPage}
                onClick={() => setPage(allBrands?.pagination?.nextPage)}
                className=" bg-gray-800 hover:bg-gray-700 cursor-pointer disabled:hover:bg-gray-800  disabled:cursor-not-allowed disabled:opacity-30 w-8 h-8 rounded-lg transition-all duration-300"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
