"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BiCategory } from "react-icons/bi";
import {
  FaBoxOpen,
  FaChartPie,
  FaCog,
  FaCopyright,
  FaHome,
  FaImages,
  FaShoppingCart,
  FaSpa,
  FaTags,
  FaUsers,
  FaUserShield,
} from "react-icons/fa";
import { MdCampaign } from "react-icons/md";

const sidebarMenu = [
  {
    section: "Main",
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: FaChartPie },
      { name: "Hero Slider", href: "/admin/hero-slider", icon: FaImages },
      { name: "Products", href: "/admin/products", icon: FaBoxOpen },
      {
        name: "Campaigns",
        icon: MdCampaign,
        subItems: [
          { name: "Add Campaign", href: "/admin/campaigns/add-new-campaigns" },
          { name: "All Campaigns", href: "/admin/campaigns" },
        ],
      },
      {
        name: "Categories",
        icon: BiCategory,
        subItems: [
          { name: "Add Category", href: "/admin/categories/add-categories" },
          { name: "All Categories", href: "/admin/categories" },
        ],
      },
      {
        name: "Tags",
        icon: FaTags,
        subItems: [
          { name: "Add Tag", href: "/admin/tags/add-tags" },
          { name: "All Tags", href: "/admin/tags" },
        ],
      },
      {
        name: "Brands",
        icon: FaCopyright,
        subItems: [
          { name: "Add Brand", href: "/admin/brands/add-brands" },
          { name: "All Brands", href: "/admin/brands" },
        ],
      },
      {
        name: "Screen Solutions",
        icon: FaSpa,
        subItems: [
          { name: "Add Solution", href: "/admin/screen-solutions/add-screen-solutions" },
          { name: "All Solutions", href: "/admin/screen-solutions" },
        ],
      },
    ],
  },
  {
    section: "Store",
    items: [
      { name: "Orders", href: "/admin/orders", icon: FaShoppingCart },
      { name: "Customers", href: "/admin/customers", icon: FaUsers },
      { name: "Home Settings", href: "/admin/home-settings", icon: FaHome },
    ],
  },
  {
    section: "System",
    items: [
      { name: "Settings", href: "/admin/settings", icon: FaCog },
      { name: "Admin Users", href: "/admin/admin-users", icon: FaUserShield },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 h-screen fixed left-0 top-0 z-10 flex flex-col">
      {/* Header */}
      <Link href={"/"} className="p-6 shrink-0">
        <h1 className="text-2xl font-bold text-white flex items-center">
          {/* <i className="fas fa-palette text-pink-400 mr-2"></i> */}
          Everly<span className="text-pink-500">Beauties</span> <sup>BD</sup>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Cosmetics Dashboard</p>
      </Link>

      {/* Scrollable Menu */}
      <nav className="flex-1 overflow-y-auto">
        {sidebarMenu.map((section) => (
          <div key={section.section} className="mb-4">
            <div className="px-4 mb-2">
              <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">
                {section.section}
              </p>
            </div>

            {section.items.map((item) => {
              const Icon = item.icon;

              if (item.subItems) {
                const isOpen = openMenus[item.name] || false;
                return (
                  <div key={item.name} className="mb-1">
                    {/* Menu Header */}
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={`flex items-center cursor-pointer justify-between px-6 py-3 w-full text-gray-300 hover:text-white transition-all duration-300 font-medium ${
                        Object.values(item.subItems).some((sub) =>
                          isActive(sub.href)
                        )
                          ? "bg-gray-800 text-pink-500 rounded-r-md"
                          : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="w-5 h-5 mr-3" />
                        {item.name}
                      </div>
                      <i
                        className={`fas fa-chevron-${
                          isOpen ? "down" : "right"
                        } text-gray-400`}
                      ></i>
                    </button>

                    {/* Sub Items with animation */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="flex flex-col ml-10 cursor-pointer overflow-hidden"
                        >
                          {item.subItems.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={`px-4 py-2 text-gray-400 text-sm hover:text-white hover:bg-gray-800 rounded-md transition-all duration-300 ${
                                isActive(sub.href)
                                  ? "bg-gray-800 text-pink-500 font-medium"
                                  : ""
                              }`}
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-6 py-3 text-gray-300 hover:text-white transition-all duration-300 ${
                    isActive(item.href)
                      ? "bg-gray-800 text-pink-500 border-l-4 border-pink-500 font-medium rounded-r-md"
                      : ""
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer / Profile */}
      <div className="p-4 border-t border-gray-800 shrink-0">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-linear-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold">
            A
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-400">admin@glamour.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
