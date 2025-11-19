"use client";
/* eslint-disable react-hooks/rules-of-hooks */
import { useBrandStore } from "@/ZustandStore/useBrandStore";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function page() {
  const { getAllBrands, allBrands, deleteBrand } = useBrandStore();
  useEffect(() => {
    getAllBrands();
  }, [getAllBrands]);
  console.log(allBrands);
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
          {allBrands?.allBrands?.length === 0 ? (
            <div className="text-center text-gray-400 py-4">
              Category Not Found
            </div>
          ) : (
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
                  {/* <!-- Luxe Beauty --> */}

                  {allBrands?.allBrands?.map((brand) => (
                    <tr
                      key={brand._id}
                      className="border-b border-gray-800 hover:bg-gray-800/50 transition-all duration-300"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-10 e h-10 bg-gradient-pink rounded-lg flex items-center justify-center mr-3">
                            <Image
                              src={`http://localhost:8080${brand.image}`}
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
                          className={` ${
                            brand.isActive
                              ? "bg-green-500/20 text-green-300"
                              : "bg-red-500/30 text-red-300"
                          } text-xs px-2 py-1 rounded-full`}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteBrand(brand._id);
                            }}
                            className="text-red-400 hover:text-red-500 cursor-pointer p-2"
                          >
                            <Trash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

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
