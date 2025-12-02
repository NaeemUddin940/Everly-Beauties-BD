"use client";
import { useCategoryStore } from "@/ZustandStore/useCategoryStore";
import { useSimpleProductStore } from "@/ZustandStore/useSimpleProductStore";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  // ❗ প্রতিটি ক্যাটাগরির collapse এর জন্য আলাদা স্টেট
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const { getAllSimpleProduct, allSimpleProduct } = useSimpleProductStore();
  const { getAllCategory, getCategory, deleteSubCategory, deleteMainCategory } =
    useCategoryStore();

  const [page, setPage] = useState(1);
  // Default Brand List Show
  const [limit, setLimit] = useState(5);

  // অ্যানিমেশন ভ্যারিয়েন্ট
  const collapseVariants = {
    open: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
    collapsed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
  };

  useEffect(() => {
    getAllCategory(page, limit);
    getAllSimpleProduct();
  }, [getAllCategory, page, limit, getAllSimpleProduct]);

  return (
    <div className="flex-1 p-2">
      {/* <!-- Top Bar --> */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Category Management</h1>
          <p className="text-gray-400">
            Organize your products with categories and subcategories
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href={"/admin/add-categories"}
            className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
          >
            <i className="fas fa-plus mr-2"></i> Add Category
          </Link>

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
        {/* Total Categories */}
        <div className="glassmorphism p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Total Categories</p>
              <h3 className="text-2xl font-bold text-white mt-2">
                {getCategory?.totalCategories || 0}
              </h3>
            </div>
            <div className="bg-gradient-pink p-3 rounded-xl">
              <i className="fas fa-tags text-white text-xl"></i>
            </div>
          </div>
        </div>

        {/* Main Categories */}
        <div className="glassmorphism p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Main Categories</p>
              <h3 className="text-2xl font-bold text-white mt-2">
                {getCategory?.mainCategoriesCount || 0}
              </h3>
            </div>
            <div className="bg-blue-500 p-3 rounded-xl">
              <i className="fas fa-folder text-white text-xl"></i>
            </div>
          </div>
        </div>

        {/* Sub Categories */}
        <div className="glassmorphism p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Subcategories</p>
              <h3 className="text-2xl font-bold text-white mt-2">
                {getCategory?.subCategoriesCount || 0}
              </h3>
            </div>
            <div className="bg-green-500 p-3 rounded-xl">
              <i className="fas fa-folder-open text-white text-xl"></i>
            </div>
          </div>
        </div>

        {/* Active Categories */}
        <div className="glassmorphism p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Active Categories</p>
              <h3 className="text-2xl font-bold text-white mt-2">
                {getCategory?.activeCategoryCount || 0}
              </h3>
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
        </div>

        <div className="space-y-2">
          {!getCategory?.categories?.length ? (
            <div className="text-center text-gray-400 py-4">
              Category Not Found
            </div>
          ) : (
            getCategory?.categories?.map((cat) => (
              <div key={cat._id} className="bg-gray-800 rounded-xl">
                {/* Trigger Area */}

                <div
                  className="p-4 cursor-pointer"
                  onClick={() =>
                    setOpenCategoryId(
                      openCategoryId === cat._id ? null : cat._id
                    )
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {/* Chevron Icon */}
                      <motion.button
                        className="text-rose-gold mr-3"
                        animate={{
                          rotate: openCategoryId === cat._id ? 180 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <i className="fas fa-chevron-down"></i>
                      </motion.button>

                      <div className="w-10 e h-10 bg-gradient-pink rounded-lg flex items-center justify-center mr-3">
                        <Image
                          src={process.env.NEXT_PUBLIC_API_BASE_URL + cat.image}
                          alt={cat.name}
                          width={100}
                          height={100}
                          className="object-cover h-full w-full rounded-md"
                          unoptimized
                        />
                      </div>

                      <div>
                        <h4 className="font-medium text-white">{cat.name}</h4>
                        <p className="text-xs text-gray-400">
                          {
                            allSimpleProduct?.simpleProducts?.filter(
                              (prod) => prod.category === cat.name
                            ).length
                          }{" "}
                          products • {cat.subCategoryCount || 0} subcategories
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={` ${
                          cat.isActive
                            ? "bg-green-500/20 text-green-300"
                            : "bg-red-500/30 text-red-300"
                        } text-xs px-2 py-1 rounded-full`}
                      >
                        {cat.isActive ? "Active" : "Inactive"}
                      </span>

                      <Link
                        href={`/admin/edit-categories/${cat._id}`}
                        className="text-rose-gold hover:text-pink-600 p-2"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>

                      <button
                        className="text-red-400 hover:text-red-500 cursor-pointer p-2"
                        onClick={async (e) => {
                          e.stopPropagation();
                          await deleteMainCategory(cat._id);
                          await getAllCategory(page, limit);
                        }}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Collapsible Subcategories */}
                <AnimatePresence initial={false}>
                  {openCategoryId === cat._id && (
                    <motion.div
                      key={cat._id}
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={collapseVariants}
                      className="overflow-hidden"
                    >
                      <div className="nested-category space-y-2 pl-4 pb-4">
                        {cat?.subCategories?.map((sub) => (
                          <div
                            key={sub._id}
                            className="bg-gray-700/50 rounded-lg p-3"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-10 e h-10 bg-gradient-pink rounded-lg flex items-center justify-center mr-3">
                                  <Image
                                    src={
                                      process.env.NEXT_PUBLIC_API_BASE_URL +
                                      sub.image
                                    }
                                    alt={sub.name}
                                    width={100}
                                    height={100}
                                    className="object-cover h-full w-full rounded-md"
                                    unoptimized
                                  />
                                </div>

                                <div>
                                  <h5 className="font-medium text-white text-sm">
                                    {sub.name}
                                  </h5>
                                  <p className="text-xs text-gray-400">
                                    {
                                      allSimpleProduct?.simpleProducts?.filter(
                                        (prod) => prod.category === sub.name
                                      ).length
                                    }{" "}
                                    products
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <span
                                  className={` ${
                                    sub.isActive
                                      ? "bg-green-500/20 text-green-300"
                                      : "bg-red-500/30 text-red-300"
                                  } text-xs px-2 py-1 rounded-full`}
                                >
                                  {sub.isActive ? "Active" : "Inactive"}
                                </span>

                                <Link
                                  href={`/admin/edit-categories/${cat._id}/${sub._id}`}
                                  className="text-rose-gold hover:text-pink-600"
                                >
                                  <i className="fas fa-edit text-md"></i>
                                </Link>
                                <button
                                  className="text-red-400 hover:text-red-500 cursor-pointer p-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteSubCategory(sub._id);
                                  }}
                                >
                                  <Trash2 />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>
        {/* <!-- Pagination --> */}
        <div className="flex justify-between items-center mt-6">
          <div className="flex gap-5 items-center">
            <p className="text-gray-400 whitespace-nowrap">
              Showing {getAllCategory?.pagination?.currentPage} to{" "}
              {getAllCategory?.pagination?.totalPages} of{" "}
              {getAllCategory?.pagination?.totalMainCategories} tags
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
              disabled={!getAllCategory?.pagination?.hasPrevPage}
              onClick={() => setPage(getAllCategory.pagination?.prevPage)}
              className=" bg-gray-800 hover:bg-gray-700 cursor-pointer disabled:hover:bg-gray-800 disabled:cursor-not-allowed  disabled:opacity-30 rounded-lg transition-all duration-300 w-8 h-8"
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            {/* Page Numbers */}
            {[...Array(getAllCategory?.pagination?.totalPages)].map(
              (_, index) => {
                const pageNumber = index + 1;
                const isActive =
                  pageNumber === getAllCategory?.pagination?.currentPage;

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
              disabled={!getAllCategory?.pagination?.hasNextPage}
              onClick={() => setPage(getAllCategory?.pagination?.nextPage)}
              className=" bg-gray-800 hover:bg-gray-700 cursor-pointer disabled:hover:bg-gray-800  disabled:cursor-not-allowed disabled:opacity-30 w-8 h-8 rounded-lg transition-all duration-300"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
