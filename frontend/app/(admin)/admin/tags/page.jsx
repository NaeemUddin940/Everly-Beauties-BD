"use client";
import { useSimpleProductStore } from "@/ZustandStore/useSimpleProductStore";
/* eslint-disable react-hooks/rules-of-hooks */
import { useTagStore } from "@/ZustandStore/useTagStore";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function page() {
  const [page, setPage] = useState(1);
  // Default Brand List Show
  const [limit, setLimit] = useState(5);
  const { getAllSimpleProduct, allSimpleProduct } = useSimpleProductStore();
  const { getAllTags, allTags, deleteTag } = useTagStore();

  useEffect(() => {
    getAllTags(page, limit);
    getAllSimpleProduct();
  }, [page, getAllTags, getAllSimpleProduct, limit]);

  return (
    <div>
      <div className="flex-1 p-2">
        {/* <!-- Top Bar --> */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center md:mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Tag Management</h1>
              <p className="text-gray-400">
                Manage product tags for better organization and filtering
              </p>
            </div>
            <div className="flex  items-center space-x-4">
              <Link
                href={"/admin/add-tags"}
                className="bg-rose-gold whitespace-nowrap hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
              >
                <i className="fas fa-plus mr-2"></i> Add Tag
              </Link>
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search tags..."
                  className="bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                />
                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              </div>
            </div>
          </div>
          <div className="relative md:hidden my-2">
            <input
              type="text"
              placeholder="Search tags..."
              className="bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
        </div>

        {/* <!-- Tag Stats --> */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Total Tags</p>
                <h3 className="text-2xl font-bold text-white mt-2">
                  {allTags?.totalTags}
                </h3>
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
                <h3 className="text-2xl font-bold text-white mt-2">
                  {allTags?.activeTags}
                </h3>
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
                    <input type="checkbox" className="custom-checkbox" />
                  </th>
                  <th className="py-3 px-4 text-left">Tag</th>
                  <th className="py-3 px-4 text-left">Products</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allTags?.tags?.length > 0 ? (
                  allTags.tags.map((tag) => (
                    <tr
                      key={tag._id}
                      className="border-b border-gray-800 hover:bg-gray-800/50 transition-all duration-300"
                    >
                      <td className="px-4">
                        <input type="checkbox" className="custom-checkbox" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="logo-preview w-10 h-10 rounded-lg flex items-center justify-center bg-green-500 mr-3">
                            <i className="fas fa-leaf text-white text-sm"></i>
                          </div>
                          <div>
                            <p className="font-medium text-white">{tag.name}</p>
                            <p className="text-xs text-gray-400">{tag.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-rose-gold text-center font-medium">
                          {
                            allSimpleProduct?.simpleProducts?.filter(
                              (product) => product.tags.includes(tag.name)
                            ).length
                          }
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            tag.isActive
                              ? "bg-green-500/20 text-green-300"
                              : "bg-red-500/30 text-red-300"
                          }`}
                        >
                          {tag.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${
                            tag.type === "featured"
                              ? "bg-purple-500/20 text-purple-300"
                              : "bg-gray-500/20 text-gray-300"
                          }`}
                        >
                          {tag.type === "featured" ? "Featured" : "Standard"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/edit-tag/${tag._id}`}
                            className="text-rose-gold hover:text-pink-600 p-2"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>
                          <button className="text-blue-400 hover:text-blue-300 p-2">
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            onClick={async () => await deleteTag(tag._id)}
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
                    <td colSpan={6} className="text-center text-gray-400 py-10">
                      No Tags Found
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
                Showing {allTags?.pagination?.currentPage} to{" "}
                {allTags?.pagination?.totalPages} of{" "}
                {allTags?.pagination?.totalDocs} tags
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
                disabled={!allTags?.pagination?.hasPrevPage}
                onClick={() => setPage(allTags.pagination?.prevPage)}
                className=" bg-gray-800 hover:bg-gray-700 cursor-pointer disabled:hover:bg-gray-800 disabled:cursor-not-allowed  disabled:opacity-30 rounded-lg transition-all duration-300 w-8 h-8"
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              {/* Page Numbers */}
              {[...Array(allTags?.pagination?.totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                const isActive =
                  pageNumber === allTags?.pagination?.currentPage;

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
                disabled={!allTags?.pagination?.hasNextPage}
                onClick={() => setPage(allTags?.pagination?.nextPage)}
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
