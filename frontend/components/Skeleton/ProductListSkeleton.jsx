// ProductListSkeleton.jsx
import "./ProductListSkeleton.css"; // CSS ফাইলটি একই থাকবে, শুধু Layout CSS বাদ যাবে (নিচে দেখুন)

const ProductListSkeleton = () => {
  return (
    <>
      {" "}
      {/* এটি একাধিক TD রিটার্ন করার জন্য জরুরি */}
      {/* কলাম ১: Checkbox */}
      <td className="py-4 px-4">
        <div className="skeleton-box checkbox"></div>
      </td>
      {/* কলাম ২: Product / Title & SKU (সবচেয়ে প্রশস্ত কলাম) */}
      <td className="py-4 px-4">
        <div className="flex items-center space-x-3">
          <div className="skeleton-box image-icon shrink-0"></div>
          <div className="flex flex-col space-y-1">
            {" "}
            {/* flex-col ব্যবহার করে Title/SKU vertically সাজানো */}
            <div className="skeleton-box title-bar w-80"></div>{" "}
            {/* w-40 দিয়ে প্রস্থ নির্দিষ্ট করা হলো */}
            <div className="skeleton-box sku-bar w-20"></div>
          </div>
        </div>
      </td>
      {/* কলাম ৩: Type */}
      <td className="py-4 px-4">
        <div className="skeleton-box badge-pill"></div>
      </td>
      {/* কলাম ৪: Category */}
      <td className="py-4 px-4">
        <div className="skeleton-box text-bar medium w-28"></div>
      </td>
      {/* কলাম ৫: Brand */}
      <td className="py-4 px-4">
        <div className="skeleton-box text-bar medium w-24"></div>
      </td>
      {/* কলাম ৬: Price */}
      <td className="py-4 px-4">
        <div className="flex flex-col space-y-1">
          <div className="skeleton-box price-main w-16"></div>
          <div className="skeleton-box price-sub w-10"></div>
        </div>
      </td>
      {/* কলাম ৭: Stock */}
      <td className="py-4 px-4">
        <div className="flex flex-col space-y-1">
          <div className="skeleton-box stock-num w-8"></div>
          <div className="skeleton-box stock-text w-16"></div>
        </div>
      </td>
      {/* কলাম ৮: Status */}
      <td className="py-4 px-4">
        <div className="skeleton-box status-pill"></div>
      </td>
      {/* কলাম ৯: Actions */}
      <td className="py-4 px-4">
        <div className="flex space-x-2">
          <div className="skeleton-box action-btn"></div>
          <div className="skeleton-box action-btn"></div>
          <div className="skeleton-box action-btn"></div>
        </div>
      </td>
    </>
  );
};

export default ProductListSkeleton;
