"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiCategory } from "react-icons/bi";
import {
  FaBoxOpen,
  FaChartPie,
  FaCog,
  FaCopyright,
  FaHome,
  FaImages,
  FaPlusCircle,
  FaShoppingCart,
  FaSpa,
  FaTags,
  FaUsers,
  FaUserShield,
} from "react-icons/fa";
import { ImPriceTags } from "react-icons/im";
import { TbCategoryPlus } from "react-icons/tb";

const sidebarMenu = [
  {
    section: "Main",
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: FaChartPie },
      { name: "Hero Slider", href: "/admin/hero-slider", icon: FaImages },
      { name: "Products", href: "/admin/products", icon: FaBoxOpen },
      { name: "Categories", href: "/admin/categories", icon: BiCategory },
      {
        name: "Add Categories",
        href: "/admin/add-categories",
        icon: TbCategoryPlus,
      },
      { name: "Create Tags", href: "/admin/create-tags", icon: ImPriceTags },
      { name: "Tags", href: "/admin/tags", icon: FaTags },
      { name: "Brands", href: "/admin/brands", icon: FaCopyright },
      { name: "Add Brands", href: "/admin/add-brands", icon: FaCopyright },
      {
        name: "Screen Solutions",
        href: "/admin/screen-solutions",
        icon: FaSpa,
      },
      {
        name: "Add Screen Solution",
        href: "/admin/add-screen-solutions",
        icon: FaPlusCircle,
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

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 h-screen fixed left-0 top-0 z-10 flex flex-col">
      {/* Header */}
      <div className="p-6 shrink-0">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <i className="fas fa-palette text-pink-400 mr-2"></i>
          Glamour<span className="text-pink-500">Admin</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Cosmetics Dashboard</p>
      </div>

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
      <div className="p-4 border-t border-gray-800 flex-shrink-0">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold">
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
