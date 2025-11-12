"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaBoxOpen,
  FaChartPie,
  FaCog,
  FaCopyright,
  FaHome,
  FaShoppingCart,
  FaTags,
  FaUsers,
  FaUserShield,
} from "react-icons/fa";

const sidebarMenu = [
  {
    section: "Main",
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: FaChartPie },
      { name: "Hero Slider", href: "/admin/hero-slider", icon: FaChartPie },
      { name: "Products", href: "/admin/products", icon: FaBoxOpen },
      { name: "Categories", href: "/admin/categories", icon: FaTags },
      { name: "Brands", href: "/admin/brands", icon: FaCopyright },
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
      <div className="p-6 flex-shrink-0">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <span className="text-rose-500 mr-2">🎨</span>
          Glamour<span className="text-rose-500">Admin</span>
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
                      ? "bg-gray-800 text-white font-medium rounded-r-md"
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
