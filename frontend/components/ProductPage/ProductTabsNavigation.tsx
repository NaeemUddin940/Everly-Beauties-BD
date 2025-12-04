"use client";
import React, { useState } from "react";

const ProductTabsNavigation = ({ product }) => {
  // Define tabs
  const tabs = [
    { id: "features", label: "Product Features" },
    { id: "description", label: "Description" },
    { id: "ingredients", label: "Ingredients" },
    { id: "shipping", label: "Shipping & Delivery" },
    { id: "reviews", label: "Reviews" },
  ];

  // State to track the active tab
  const [activeTab, setActiveTab] = useState("features");

  // Handle tab click
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  // Get review count from product or default to 0
  const reviewCount = product?.reviews?.length || 0;

  return (
    <div className="mt-16">
      <div className="border-b border-gray-200 overflow-hidden">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? "border-pink-600 text-pink-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } font-medium py-4 px-1 transition-colors`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.id === "reviews"
                ? `${tab.label} (${reviewCount})`
                : tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="py-8">
        {/* Product Features Content */}
        {activeTab === "features" && (
          <div className="md-tab-content">
            <h3 className="text-xl font-bold mb-4">
              {product?.featuresTitle || "Advanced Product Features"}
            </h3>
            <p className="text-gray-600 mb-6">
              {product?.featuresDescription ||
                "This product offers exceptional quality and performance designed to meet your specific needs."}
            </p>

            <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-3">
              {/* Product Attributes Section */} 
              {product?.attributes?.length > 0 &&
                product.attributes
                .filter(
                  (attribute) =>
                    attribute.slug !== "pa_shadesepmf" &&
                    attribute.slug !== "pa_shades-ec"
                ).map((attribute, index) => (
                    <div key={index} className="mb-8">
                      <h4 className="font-bold mb-3">{attribute.name}:</h4>
                      <ul className="space-y-3">
                        {attribute.options.map((option, optIndex) => (
                          <li key={optIndex} className="flex items-start gap-3">
                            <div className="bg-pink-100 rounded-full p-1 mt-0.5">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-pink-600"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <span className="text-gray-600">{option}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
            </div>
          </div>
        )}

        {/* Description Content */}
        {activeTab === "description" && (
          <div className="md-tab-content">
            <div className="prose max-w-none text-gray-600">
              {product?.description ? (
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <p>No description found.</p>
              )}
            </div>
          </div>
        )}

        {/* Ingredients Content */}
        {activeTab === "ingredients" && (
          <div className="md-tab-content">
            <h3 className="text-xl font-semibold">Ingredients</h3>
            <div className="prose max-w-none text-gray-600">
              {product?.ingredients ? (
                <div
                  dangerouslySetInnerHTML={{ __html: product.ingredients }}
                />
              ) : (
                <p>No ingredients found.</p>
              )}
            </div>
          </div>
        )}

        {/* Shipping & Delivery Content */}
        {activeTab === "shipping" && (
          <div className="md-tab-content">
            <div className="prose max-w-none text-gray-600">
              {product?.shippingInfo && (
                <div
                  className="mt-4"
                  dangerouslySetInnerHTML={{ __html: product.shippingInfo }}
                />
              )}
            </div>
          </div>
        )}

        {/* Reviews Content */}
        {activeTab === "reviews" && (
          <div className="md-tab-content">
            <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
            {reviewCount > 0 ? (
              <div className="space-y-4">
                {product.reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 ${
                              i < review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-gray-600 font-medium">
                        {review.username}
                      </span>
                      <span className="ml-auto text-sm text-gray-500">
                        {review.date}
                      </span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-gray-600">
                  No reviews yet. Be the first to review this product!
                </p>
                <button className="mt-4 bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded transition-colors">
                  Write a Review
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabsNavigation;