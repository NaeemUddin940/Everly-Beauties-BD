export const exportProducts = (allSimpleProduct) => {
  if (!allSimpleProduct?.simpleProducts?.length) return;

  const headers = [
    "Name",
    "SKU",
    "Type",
    "Category",
    "Brand",
    "Price",
    "Stock",
    "Status",
  ];

  const rows = allSimpleProduct.simpleProducts.map((p) => [
    p.name,
    p.sku,
    "Simple",
    p.category || "",
    p.brand || "",
    p.regularPrice,
    p.stockQuantity,
    p.isActive ? "Active" : "Inactive",
  ]);

  let csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows].map((e) => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "products.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
