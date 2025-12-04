"use client";

import { axiosInstance } from "@/lib/axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaSearch } from "react-icons/fa";

const MOCK_CAMPAIGNS = [
  {
    _id: "65691f42d2a4c9b1b8e4e792",
    campaignName: "Winter Clearance Sale",
    thumbnailImage: "/images/mock/campaign-winter.jpg", // Use local path or placeholder
    products: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
    startDate: new Date(2025, 0, 15).toISOString(), // Jan 15, 2025 (Pending)
    endDate: new Date(2025, 1, 28).toISOString(), // Feb 28, 2025
    createdAt: new Date(2024, 11, 1).toISOString(),
  },
  {
    _id: "65691f42d2a4c9b1b8e4e793",
    campaignName: "Eid Festive Bash",
    thumbnailImage: "/images/mock/campaign-eid.jpg",
    products: [{ id: 6 }, { id: 7 }],
    startDate: new Date(2025, 5, 1).toISOString(), // June 1, 2025 (Pending)
    endDate: new Date(2025, 5, 15).toISOString(), // June 15, 2025
    createdAt: new Date(2024, 11, 2).toISOString(),
  },
  {
    _id: "65691f42d2a4c9b1b8e4e794",
    campaignName: "Summer Travel Gear",
    thumbnailImage: "/images/mock/campaign-summer.jpg",
    products: [{ id: 8 }],
    startDate: new Date(2024, 6, 1).toISOString(), // July 1, 2024 (Ended)
    endDate: new Date(2024, 7, 30).toISOString(), // Aug 30, 2024
    createdAt: new Date(2024, 5, 20).toISOString(),
  },
  {
    _id: "65691f42d2a4c9b1b8e4e795",
    campaignName: "Flash Deal of the Day",
    thumbnailImage: "/images/mock/campaign-flash.jpg",
    products: [
      { id: 9 },
      { id: 10 },
      { id: 11 },
      { id: 12 },
      { id: 13 },
      { id: 14 },
      { id: 15 },
      { id: 16 },
      { id: 17 },
      { id: 18 },
      { id: 19 },
      { id: 20 },
    ],
    startDate: new Date(Date.now() - 86400000).toISOString(), // Starts Yesterday (Running)
    endDate: new Date(Date.now() + 86400000 * 3).toISOString(), // Ends 3 days from now
    createdAt: new Date().toISOString(),
  },
  {
    _id: "65691f42d2a4c9b1b8e4e796",
    campaignName: "Old Stock Clearance",
    thumbnailImage: "/images/mock/campaign-clear.jpg",
    products: [{ id: 21 }, { id: 22 }],
    startDate: new Date(2023, 1, 1).toISOString(), // Feb 1, 2023 (Long Ended)
    endDate: new Date(2023, 1, 28).toISOString(), // Feb 28, 2023
    createdAt: new Date(2022, 11, 1).toISOString(),
  },
];
const ORDERS_PER_PAGE = 10;

const CampaignsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [today, setToday] = useState(new Date());

  // Update today's date every minute to keep status up-to-date
  useEffect(() => {
    const interval = setInterval(() => setToday(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch campaigns
  // const { data: campaigns = [], refetch } = useQuery({
  //   queryKey: ["campaigns"],
  //   queryFn: async () => {
  //     const res = await axiosInstance.get("/campaigns");
  //     return res.data;
  //   },
  //   staleTime: 0,
  //   cacheTime: 0,
  //   keepPreviousData: false,
  //   refetchOnWindowFocus: true,
  // });

  // Filter campaigns based on search and update status dynamically
  const filteredCampaigns = MOCK_CAMPAIGNS.filter((campaign) =>
    campaign?.campaignName.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort(
    (a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id)
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredCampaigns.length / ORDERS_PER_PAGE);
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/campaigns/${id}`);
      await refetch();
      toast.success("Campaign deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen p-5">
      <div className="glassmorphism rounded-lg shadow p-5">
        {/* Header */}
        <div className="flex gap-3 justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-100">Campaigns</h1>

          {/* Search */}
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white hover:border-gray-400 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-colors ml-auto min-w-[280px]">
            <FaSearch className="text-gray-400 mr-2 shrink-0" size={14} />
            <input
              type="text"
              placeholder="Search campaigns..."
              className="w-full outline-none text-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="ml-2 text-gray-400 hover:text-gray-600 text-lg font-bold transition-colors cursor-pointer"
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Add Campaign */}
          <Link href="/admin-dashboard/campaigns/add-new-campaigns">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-sm cursor-pointer">
              <FaPlus size={14} /> Add Campaign
            </button>
          </Link>
        </div>

        {/* Table */}
        <div className=" rounded-lg border border-gray-200 shadow overflow-x-auto pb-3">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-300 bg-gray-800">
              <tr>
                <th className="px-4 py-3 font-medium">Image</th>
                <th className="px-4 py-3 font-medium">Campaign</th>
                <th className="px-4 py-3 font-medium">Products</th>
                <th className="px-4 py-3 font-medium">Start Date</th>
                <th className="px-4 py-3 font-medium">End Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCampaigns.length > 0 ? (
                paginatedCampaigns.map((campaign) => (
                  <tr key={campaign?._id} className="border-b border-gray-300">
                    <td className="px-4 py-3 flex items-center justify-center">
                      <Image
                        src={campaign?.thumbnailImage}
                        alt={campaign?.campaignName}
                        width={50}
                        height={50}
                        className="object-cover rounded"
                        unoptimized={true}
                      />
                    </td>
                    <td className="px-4 py-3 text-center font-medium">
                      {campaign?.campaignName}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {campaign?.products?.length || 0} Products
                    </td>
                    <td className="px-4 py-3 text-center">
                      {new Date(campaign?.startDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {new Date(campaign?.endDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          campaign?.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {campaign?.status?.charAt(0).toUpperCase() +
                          campaign?.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center space-x-3">
                      <Link
                        href={`/admin-dashboard/campaigns/campaign-edit/${campaign?._id}`}
                      >
                        <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors cursor-pointer">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(campaign?._id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-gray-500 text-center"
                  >
                    No campaigns found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600 px-3">
            <p>
              Showing{" "}
              {paginatedCampaigns.length > 0
                ? (currentPage - 1) * ORDERS_PER_PAGE + 1
                : 0}{" "}
              to{" "}
              {(currentPage - 1) * ORDERS_PER_PAGE + paginatedCampaigns.length}{" "}
              of {filteredCampaigns.length} campaigns
            </p>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === page
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "hover:bg-gray-100 text-gray-600 cursor-pointer"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignsPage;
