"use client";

import ProductCard from "../common/ProductCard";

const RecommendedProductsGrid = ({ products }) => {
  if (!products || products.length === 0) return null;

  const handleAddToCart = (productId, variation = null) => {
    console.log(
      "Adding to cart:",
      productId,
      variation ? "with variation" : ""
    );
  };

  const handleWishlistToggle = (productId) => {
    console.log("Toggling wishlist for:", productId);
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {products.map((product) => (
          <div key={product.id}>
            <ProductCard
              id={product.id}
              slug={product.slug}
              image={product.image}
              title={product.title}
              brand={product.brand || ""}
              price={parseFloat(product.price)}
              regularPrice={
                product.regular_price ? parseFloat(product.regular_price) : null
              }
              campaignName={product.campaign_name}
              variations={product.variations}
              rating={product.rating}
              hasFreeShipping={product.hasFreeShipping}
              onAddToCart={() => handleAddToCart(product.id)}
              onWishlistToggle={() => handleWishlistToggle(product.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProductsGrid;
