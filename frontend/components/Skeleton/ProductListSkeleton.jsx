// ProductListSkeleton.jsx
import "./ProductListSkeleton.css"; // CSS ফাইল ইমপোর্ট করা হচ্ছে

const ProductListSkeleton = () => {
  return (
    <>
      {/* Col 1: Checkbox */}
      <td className="py-4 px-2">
        {" "}
        <div className="skeleton-box checkbox"></div>{" "}
      </td>

      {/* Col 2: Image */}
      <td className="py-4 px-2">
        {" "}
        <div className="skeleton-box image-icon w-10 h-10"></div>{" "}
      </td>

      {/* Col 3: Product / Title & SKU */}
      <td className="py-4 px-2">
        <div className="flex flex-col space-y-1">
          <div className="skeleton-box title-bar w-40"></div>
          <div className="skeleton-box sku-bar w-20"></div>
        </div>
      </td>

      {/* Col 4: Type */}
      <td className="py-4 px-2">
        {" "}
        <div className="skeleton-box badge-pill"></div>{" "}
      </td>

      {/* Col 5: Category */}
      <td className="py-4 px-2">
        {" "}
        <div className="skeleton-box text-bar medium w-30"></div>{" "}
      </td>

      {/* Col 6: Brand */}
      <td className="py-4 px-2">
        {" "}
        <div className="skeleton-box text-bar medium w-28"></div>{" "}
      </td>

      {/* Col 7: Price */}
      <td className="py-4 px-2">
        <div className="flex flex-col space-y-1">
          <div className="skeleton-box price-main w-16"></div>
          <div className="skeleton-box price-sub w-10"></div>
        </div>
      </td>

      {/* Col 8: Stock */}
      <td className="py-4 px-2">
        <div className="flex flex-col space-y-1">
          <div className="skeleton-box stock-num w-8"></div>
          <div className="skeleton-box stock-text w-16"></div>
        </div>
      </td>

      {/* Col 9: Status */}
      <td className="py-4 px-2">
        {" "}
        <div className="skeleton-box status-pill"></div>{" "}
      </td>

      {/* Col 10: Actions */}
      <td className="py-4 px-2">
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
