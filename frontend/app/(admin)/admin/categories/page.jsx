"use client";
import { useCategoryStore } from "@/ZustandStore/useCategoryStore";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
  // ❗ প্রতিটি ক্যাটাগরির collapse এর জন্য আলাদা স্টেট
  const [openCategoryId, setOpenCategoryId] = useState(null);

  // অ্যানিমেশন ভ্যারিয়েন্ট
  const collapseVariants = {
    open: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
    collapsed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
  };

  const { getAllCategory, getCategory, deleteSubCategory, deleteMainCategory } =
    useCategoryStore();

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
                {getAllCategory?.totalCategories || 0}
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
                {getAllCategory?.mainCategoriesCount || 0}
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
                {getAllCategory?.subCategoriesCount || 0}
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
                {getAllCategory?.activeCategoryCount || 0}
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
          {!getAllCategory?.allCategories?.length ? (
            <div className="text-center text-gray-400 py-4">
              Category Not Found
            </div>
          ) : (
            getAllCategory.allCategories.map((cat) => (
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
                          src={`http://localhost:8080${cat.image}`}
                          alt={cat.title}
                          width={100}
                          height={100}
                          className="object-cover h-full w-full rounded-md"
                          unoptimized
                        />
                      </div>

                      <div>
                        <h4 className="font-medium text-white">{cat.title}</h4>
                        <p className="text-xs text-gray-400">
                          48 products • {cat.subCategories.length || 0}{" "}
                          subcategories
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

                      <button
                        className="text-rose-gold hover:text-pink-600 p-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <i className="fas fa-edit"></i>
                      </button>

                      <button
                        className="text-red-400 hover:text-red-500 cursor-pointer p-2"
                        onClick={async (e) => {
                          e.stopPropagation();
                          deleteMainCategory(cat._id);
                          await getCategory();
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
                        {cat.subCategories.map((sub) => (
                          <div
                            key={sub._id}
                            className="bg-gray-700/50 rounded-lg p-3"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-10 e h-10 bg-gradient-pink rounded-lg flex items-center justify-center mr-3">
                                  <Image
                                    src={`http://localhost:8080${sub.image}`}
                                    alt={cat.title}
                                    width={100}
                                    height={100}
                                    className="object-cover h-full w-full rounded-md"
                                    unoptimized
                                  />
                                </div>

                                <div>
                                  <h5 className="font-medium text-white text-sm">
                                    {sub.title}
                                  </h5>
                                  <p className="text-xs text-gray-400">
                                    22 products
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
                                  {sub.isActive ? "Active" : "Inactive"}
                                </span>

                                <button className="text-rose-gold hover:text-pink-600">
                                  <i className="fas fa-edit text-xs"></i>
                                </button>
                                <button
                                  className="text-red-400 hover:text-red-500 cursor-pointer p-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteSubCategory(sub._id);
                                    // await getCategory();
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
