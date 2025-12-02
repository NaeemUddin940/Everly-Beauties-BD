"use client";
/* eslint-disable react-hooks/rules-of-hooks */
import { useScreenSolutionStore } from "@/ZustandStore/useScreenSolutionStore";
import { useSimpleProductStore } from "@/ZustandStore/useSimpleProductStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function page() {
  const [page, setPage] = useState(1);
  // Default Brand List Show
  const [limit, setLimit] = useState(5);
  const { getAllScreenSolution, deleteScreenSolution, allScreenSolution } =
    useScreenSolutionStore();
  const { getAllSimpleProduct, allSimpleProduct } = useSimpleProductStore();

  useEffect(() => {
    getAllScreenSolution(page, limit);
    getAllSimpleProduct();
  }, [getAllScreenSolution, page, limit, getAllSimpleProduct]);


  console.log(allSimpleProduct)
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
            <Link
              href={"/admin/add-screen-solutions"}
              className="bg-rose-gold whitespace-nowrap hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
            >
              <i className="fas fa-plus mr-2"></i> Add Solution
            </Link>
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
                <h3 className="text-2xl font-bold text-white mt-2">
                  {allScreenSolution?.totalScreenSolutions || 0}
                </h3>
              </div>
              <div className="bg-gradient-pink p-3 rounded-xl">
                <i className="fas fa-spa text-white text-xl"></i>
              </div>
            </div>
          </div>

          {/* <div className="glassmorphism p-6 rounded-2xl shadow-md">
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
          </div> */}

          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Active Solutions</p>
                <h3 className="text-2xl font-bold text-white mt-2">
                  {allScreenSolution?.activeScreenSolution || 0}
                </h3>
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
                  {/* <th className="py-3 px-4 text-left">Type</th> */}
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allScreenSolution?.screenSolutions?.length > 0 ? (
                  allScreenSolution.screenSolutions.map((solution) => (
                    <tr
                      key={solution?._id}
                      className="border-b border-gray-800 hover:bg-gray-800/50 transition-all duration-300"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="logo-preview w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-pink mr-3">
                            <Image
                              src={
                                process.env.NEXT_PUBLIC_API_BASE_URL +
                                solution.image
                              }
                              alt={solution?.name || "Default Image"}
                              width={100}
                              height={100}
                              className="object-cover h-full w-full rounded-md"
                              unoptimized
                            />
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {solution?.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {solution?.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-rose-gold font-medium">
                          {
                            allSimpleProduct?.simpleProducts?.filter(
                              (product) =>
                                product.skinSolution === solution?.name
                            ).length
                          }
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            solution.isActive
                              ? "bg-green-500/20 text-green-300"
                              : "bg-red-500/30 text-red-300"
                          }`}
                        >
                          {solution.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/edit-screen-solution/${solution._id}`}
                            className="text-rose-gold hover:text-pink-600 p-2"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>
                          <button className="text-blue-400 hover:text-blue-300 p-2">
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            onClick={async () =>
                              await deleteScreenSolution(solution._id)
                            }
                            className="text-red-400 hover:text-red-300 p-2"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-400 py-10">
                      No Screen Solutions Found
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
                Showing {allScreenSolution?.pagination?.currentPage} to{" "}
                {allScreenSolution?.pagination?.totalPages} of{" "}
                {allScreenSolution?.pagination?.totalDocs} tags
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
                disabled={!allScreenSolution?.pagination?.hasPrevPage}
                onClick={() => setPage(allScreenSolution.pagination?.prevPage)}
                className=" bg-gray-800 hover:bg-gray-700 cursor-pointer disabled:hover:bg-gray-800 disabled:cursor-not-allowed  disabled:opacity-30 rounded-lg transition-all duration-300 w-8 h-8"
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              {/* Page Numbers */}
              {[...Array(allScreenSolution?.pagination?.totalPages)].map(
                (_, index) => {
                  const pageNumber = index + 1;
                  const isActive =
                    pageNumber === allScreenSolution?.pagination?.currentPage;

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
                }
              )}

              {/* Next Button */}
              <button
                disabled={!allScreenSolution?.pagination?.hasNextPage}
                onClick={() => setPage(allScreenSolution?.pagination?.nextPage)}
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
