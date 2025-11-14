import { Sidebar } from "lucide-react";

import { Button } from "../ui/button";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

export default function Topbar() {
  return (
    <div>
      <div className="flex justify-between items-center py-2 border-b border-gray-400">
        <SheetTrigger className="lg:hidden" asChild>
          <Button>
            <Sidebar />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[350px] bg-gray-900">
          <div className="w-64 h-screen fixed left-0 top-0 overflow-y-auto z-10">
            <SheetHeader className="p-6">
              <SheetTitle className="text-2xl font-bold text-white flex items-center">
                <i className="fas fa-palette text-rose-gold mr-2"></i>
                Glamour<span className="text-rose-gold">Admin</span>
              </SheetTitle>
              <SheetDescription className="text-gray-400 text-sm mt-1">
                Cosmetics Dashboard
              </SheetDescription>
            </SheetHeader>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="bg-gray-800 border border-gray-700 rounded-xl pl-10 w-full py-2 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>

            <nav className="mt-6">
              <div className="px-4 mb-4">
                <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">
                  Main
                </p>
              </div>
              <a
                href="#"
                className="sidebar-link active flex items-center px-6 py-3 text-gray-300 hover:text-white transition-all duration-300"
              >
                <i className="fas fa-chart-pie w-6 mr-3"></i>
                Dashboard
              </a>
              <a
                href="#"
                className="sidebar-link flex items-center px-6 py-3 text-gray-300 hover:text-white transition-all duration-300"
              >
                <i className="fas fa-box-open w-6 mr-3"></i>
                Products
              </a>
              <a
                href="#"
                className="sidebar-link flex items-center px-6 py-3 text-gray-300 hover:text-white transition-all duration-300"
              >
                <i className="fas fa-tags w-6 mr-3"></i>
                Categories
              </a>
              <a
                href="#"
                className="sidebar-link flex items-center px-6 py-3 text-gray-300 hover:text-white transition-all duration-300"
              >
                <i className="fas fa-copyright w-6 mr-3"></i>
                Brands
              </a>

              <div className="px-4 my-4">
                <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">
                  Store
                </p>
              </div>
              <a
                href="#"
                className="sidebar-link flex items-center px-6 py-3 text-gray-300 hover:text-white transition-all duration-300"
              >
                <i className="fas fa-shopping-cart w-6 mr-3"></i>
                Orders
              </a>
              <a
                href="#"
                className="sidebar-link flex items-center px-6 py-3 text-gray-300 hover:text-white transition-all duration-300"
              >
                <i className="fas fa-users w-6 mr-3"></i>
                Customers
              </a>
              <a
                href="#"
                className="sidebar-link flex items-center px-6 py-3 text-gray-300 hover:text-white transition-all duration-300"
              >
                <i className="fas fa-home w-6 mr-3"></i>
                Home Settings
              </a>

              <div className="px-4 my-4">
                <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">
                  System
                </p>
              </div>
              <a
                href="#"
                className="sidebar-link flex items-center px-6 py-3 text-gray-300 hover:text-white transition-all duration-300"
              >
                <i className="fas fa-cog w-6 mr-3"></i>
                Settings
              </a>
              <a
                href="#"
                className="sidebar-link flex items-center px-6 py-3 text-gray-300 hover:text-white transition-all duration-300"
              >
                <i className="fas fa-user-shield w-6 mr-3"></i>
                Admin Users
              </a>
            </nav>

            <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-pink flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">Admin User</p>
                  <p className="text-xs text-gray-400">admin@glamour.com</p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400 hidden md:block">
            Welcome back! Here&apos;s what&apos;s happening with your store
            today.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative hidden lg:block">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
          <div className="relative">
            <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-xl transition-all duration-300">
              <i className="fas fa-bell text-gray-300"></i>
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
          </div>
          <div className="relative">
            <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-xl transition-all duration-300">
              <i className="fas fa-envelope text-gray-300"></i>
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                5
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
