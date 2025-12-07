"use client";
import { api } from "@/lib/axios";
import { useBrandStore } from "@/ZustandStore/useBrandStore";
import { useCategoryStore } from "@/ZustandStore/useCategoryStore";
import { useScreenSolutionStore } from "@/ZustandStore/useScreenSolutionStore";
import { useSimpleProductStore } from "@/ZustandStore/useSimpleProductStore";
import { useTagStore } from "@/ZustandStore/useTagStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaCloudUploadAlt,
  FaImage,
  FaPlus,
  FaSave,
  FaSearch,
  FaTag,
  FaTimes,
} from "react-icons/fa";

interface Product {
  id: string; // Changed from number to string for MongoDB ObjectId
  name: string;
  sku: string;
  originalPrice: number;
  category: string;
  brand: string;
  thumbnail?: string;
  images?: { url: string; altText?: string }[]; // Added images array
}

interface ComboComponent {
  id: number;
  productId: string; // Changed from number to string
  name: string;
  sku: string;
  originalPrice: number;
  customPrice: number;
  quantity: number;
  bgColor: string;
  thumbnail: string;
}

interface ComboFormData {
  name: string;
  description: string;
  slug: string;
  components: ComboComponent[];
  comboRegularPrice: number;
  comboSalePrice: number;
  discountPercentage: number;
  limitedTimeOffer: boolean;
  category: string;
  brand: string;
  tags: string;
  visibility: string;
  isActive: boolean;
  hasFreeShipping: boolean;
  image: File | null;
  title: string;
  seoDescription: string;
  bottomContent: string;
  schemaMarkup: string;
  canonicalUrl: string;
  focusKeywords: string;
  screenSolution: string;
}

// Helper function to generate slug from text
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
};

const calculateComboPrices = (components: ComboComponent[]) => {
  const comboRegularPrice = components.reduce(
    (sum, comp) => sum + comp.originalPrice * comp.quantity,
    0
  );

  const comboSalePrice = components.reduce(
    (sum, comp) => sum + comp.customPrice * comp.quantity,
    0
  );

  const discountPercentage =
    comboRegularPrice > 0
      ? ((comboRegularPrice - comboSalePrice) / comboRegularPrice) * 100
      : 0;

  return { comboRegularPrice, comboSalePrice, discountPercentage };
};

const getRandomBgColor = () => {
  const colors = [
    "bg-gradient-pink",
    "bg-purple-500/20",
    "bg-blue-500/20",
    "bg-green-500/20",
    "bg-yellow-500/20",
    "bg-red-500/20",
    "bg-indigo-500/20",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const ComboProductCreationPage = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<ComboFormData>({
    name: "",
    description: "",
    components: [],
    comboRegularPrice: 0,
    comboSalePrice: 0,
    discountPercentage: 0,
    limitedTimeOffer: false,
    slug: "",
    category: "",
    brand: "",
    tags: "",
    visibility: "Draft",
    isActive: true,
    hasFreeShipping: true,
    image: null,
    title: "",
    seoDescription: "",
    bottomContent: "",
    schemaMarkup: "",
    canonicalUrl: "",
    focusKeywords: "",
    screenSolution: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [priceErrors, setPriceErrors] = useState<Record<number, string>>({});

  // SEO & Organization related states
  const [categorySearch, setCategorySearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // Tags related states
  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const tagsRef = useRef<HTMLDivElement>(null);

  // Categories from mock data
  const [categories, setCategories] = useState<string[]>([
    "Makeup",
    "Skincare",
    "Haircare",
    "Lipstick",
    "Foundation",
    "Eyeshadow",
  ]);

  const { getCategory, getAllCategory } = useCategoryStore();
  const { allBrands, getAllBrands } = useBrandStore();
  const { allTags, getAllTags } = useTagStore();
  const { allScreenSolution, getAllScreenSolution } = useScreenSolutionStore();
  const { allSimpleProduct, getAllSimpleProduct } = useSimpleProductStore();

  const [availableTags, setAvailableTags] = useState<string[]>([
    "cosmetics",
    "beauty",
    "makeup",
    "skincare",
    "foundation",
    "lipstick",
    "mascara",
    "eyeshadow",
    "brushes",
    "glam",
    "natural",
    "organic",
    "vegan",
    "cruelty-free",
    "luxury",
    "affordable",
  ]);

  const [popularTags, setPopularTags] = useState<string[]>([
    "cosmetics",
    "beauty",
    "makeup",
    "skincare",
    "vegan",
    "cruelty-free",
  ]);

  const [brands, setBrands] = useState<string[]>([
    "Luxe Beauty",
    "Glamour Cosmetics",
    "Pure Skin",
    "Eco Beauty",
    "Pro Makeup",
  ]);

  const [screenSolutions, setScreenSolutions] = useState<string[]>([
    "Oily Skin",
    "Dry Skin",
    "Combination Skin",
    "Sensitive Skin",
    "Acne-Prone Skin",
    "Aging Solutions",
    "Dark Spots",
    "Hyperpigmentation",
  ]);

  useEffect(() => {
    getAllBrands();
    getAllCategory();
    getAllTags();
    getAllScreenSolution();
    getAllSimpleProduct();
  }, [
    getAllBrands,
    getAllSimpleProduct,
    getAllCategory,
    getAllScreenSolution,
    getAllTags,
  ]);

  console.log("Simple Products:", allSimpleProduct?.simpleProducts);

  // Brand এর জন্য আলাদা effect
  useEffect(() => {
    if (allBrands?.allBrands) {
      setBrands((prev) => {
        const newBrands = allBrands.allBrands.map(
          (brand: { name: string }) => brand.name
        );
        const merged = [...new Set([...prev, ...newBrands])];
        return merged;
      });
    }
  }, [allBrands]);

  // Tag এর জন্য আলাদা effect
  useEffect(() => {
    if (allTags?.tags) {
      setPopularTags((prev) => {
        const newTags = allTags.tags.map((tag: { name: string }) => tag.name);
        const merged = [...new Set([...prev, ...newTags])];
        return merged;
      });
    }
  }, [allTags]);

  useEffect(() => {
    if (allScreenSolution?.allScreenSolution) {
      setScreenSolutions((prev) => {
        const newScreenSolution = allScreenSolution.allScreenSolution.map(
          (screenSolution: { name: string }) => screenSolution.name
        );
        const merged = [...new Set([...prev, ...newScreenSolution])];
        return merged;
      });
    }
  }, [allScreenSolution]);

  useEffect(() => {
    if (getCategory?.categories) {
      setCategories((prev) => {
        const newCategories = getCategory.categories.map(
          (category: { name: string }) => category.name
        );
        const merged = [...new Set([...prev, ...newCategories])];
        return merged;
      });
    }
  }, [getCategory]);

  // Calculate combo prices using useMemo
  const calculatedPrices = useMemo(() => {
    return calculateComboPrices(formData.components);
  }, [formData.components]);

  // Update form data when calculated prices change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      comboRegularPrice: calculatedPrices.comboRegularPrice,
      comboSalePrice: calculatedPrices.comboSalePrice,
      discountPercentage: calculatedPrices.discountPercentage,
    }));
  }, [calculatedPrices]);

  // Generate slug when name changes
  useEffect(() => {
    if (formData.name && !formData.slug) {
      const generatedSlug = generateSlug(formData.name);
      setFormData((prev) => ({
        ...prev,
        slug: generatedSlug,
      }));
    }
  }, [formData.name]);

  // Handle product search - Updated to use real data
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const simpleProducts = allSimpleProduct?.simpleProducts || [];

    const filtered = simpleProducts.filter((product: any) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        product.name?.toLowerCase().includes(searchLower) ||
        product.sku?.toLowerCase().includes(searchLower) ||
        product.category?.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower)
      );
    });

    const addedProductIds = new Set(
      formData.components.map((comp) => comp.productId)
    );

    const availableProducts = filtered.filter(
      (product: any) => !addedProductIds.has(product._id || product.id)
    );

    // Transform to Product interface format
    const formattedProducts: Product[] = availableProducts.map(
      (product: any) => ({
        id: product._id || product.id,
        name: product.name || "",
        sku: product.sku || "",
        originalPrice: product.regularPrice || product.originalPrice || 0,
        category: product.category || "",
        brand: product.brand || "",
        thumbnail: product.productImage || product.thumbnail || "",
        images: product.images || [],
      })
    );

    setSearchResults(formattedProducts);
  }, [searchQuery, formData.components, allSimpleProduct]);

  // Close tag suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tagsRef.current && !tagsRef.current.contains(event.target as Node)) {
        setShowTagSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: checkbox.checked,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (name === "name") {
        const generatedSlug = generateSlug(value);
        setFormData((prev) => ({
          ...prev,
          slug: generatedSlug,
        }));
      }
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = generateSlug(e.target.value);
    setFormData((prev) => ({
      ...prev,
      slug,
    }));
  };

  const handleComponentChange = (
    id: number,
    field: keyof ComboComponent,
    value: string | number
  ) => {
    setFormData((prev) => {
      const updatedComponents = prev.components.map((comp) =>
        comp.id === id ? { ...comp, [field]: value } : comp
      );

      if (field === "customPrice") {
        const component = updatedComponents.find((c) => c.id === id);
        if (component && Number(value) > component.originalPrice) {
          setPriceErrors((prev) => ({
            ...prev,
            [id]: `Custom price must be lower than original price (৳${component.originalPrice})`,
          }));
        } else {
          setPriceErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[id];
            return newErrors;
          });
        }
      }

      return {
        ...prev,
        components: updatedComponents,
      };
    });
  };

  const handleAddProduct = (product: Product) => {
    const newComponent: ComboComponent = {
      id:
        formData.components.length > 0
          ? Math.max(...formData.components.map((c) => c.id)) + 1
          : 1,
      productId: product.id,
      name: product.name,
      sku: product.sku,
      originalPrice: product.originalPrice,
      customPrice: product.originalPrice,
      quantity: 1,
      bgColor: getRandomBgColor(),
      thumbnail:
        product.thumbnail ||
        product.images?.[0]?.url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          product.name
        )}&background=random&color=fff&size=200`,
    };

    setFormData((prev) => ({
      ...prev,
      components: [...prev.components, newComponent],
    }));

    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleRemoveComponent = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      components: prev.components.filter((comp) => comp.id !== id),
    }));

    setPriceErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  // Category functions
  const handleAddNewCategory = () => {
    if (newCategory.trim()) {
      const trimmedName = newCategory.trim();

      setCategories((prev) => [...prev, trimmedName]);
      setSelectedCategories((prev) => [...prev, trimmedName]);
      setNewCategory("");
      setShowAddCategory(false);
    }
  };

  // Filter categories for display with search
  const filteredCategories = useMemo(() => {
    return categories.filter((categoryName) => {
      if (!categorySearch) return true;
      return categoryName.toLowerCase().includes(categorySearch.toLowerCase());
    });
  }, [categories, categorySearch]);

  // Tag functions
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      setSelectedTags((prev) => [...prev, trimmedTag]);

      if (!availableTags.includes(trimmedTag)) {
        setAvailableTags((prev) => [...prev, trimmedTag]);
      }
    }
    setTagInput("");
    setShowTagSuggestions(false);
  };

  const removeTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const getTagUsageCount = (tag: string): number => {
    const mockCounts: Record<string, number> = {
      cosmetics: 42,
      beauty: 38,
      makeup: 56,
      skincare: 47,
      foundation: 23,
      lipstick: 31,
      mascara: 18,
      eyeshadow: 27,
      brushes: 15,
      glam: 12,
      natural: 34,
      organic: 29,
      vegan: 41,
      "cruelty-free": 36,
      luxury: 19,
      affordable: 25,
    };
    return mockCounts[tag] || Math.floor(Math.random() * 50) + 1;
  };

  // Filter tag suggestions based on input
  const tagSuggestions = availableTags
    .filter(
      (tag) =>
        tag.toLowerCase().includes(tagInput.toLowerCase()) &&
        !selectedTags.includes(tag)
    )
    .slice(0, 10);

  // Handle save combo - API call
  const handleSaveCombo = async () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a combo name.");
      return;
    }

    if (formData.components.length === 0) {
      toast.error("Please add at least one product to the combo.");
      return;
    }

    const hasErrors = Object.keys(priceErrors).length > 0;
    if (hasErrors) {
      toast.error("Please fix price errors before saving.");
      return;
    }

    // try {
      // Prepare data for API
      const comboData = {
        name: formData.name,
        description: formData.description,
        slug: formData.slug,
        components: formData.components.map((comp) => ({
          productId: comp.productId,
          name: comp.name,
          sku: comp.sku,
          originalPrice: comp.originalPrice,
          customPrice: comp.customPrice,
          quantity: comp.quantity,
          thumbnail: comp.thumbnail,
        })),
        comboRegularPrice: formData.comboRegularPrice,
        comboSalePrice: formData.comboSalePrice,
        discountPercentage: formData.discountPercentage,
        limitedTimeOffer: formData.limitedTimeOffer,
        category: selectedCategories.join(", "),
        brand: formData.brand,
        tags: selectedTags,
        visibility: formData.visibility,
        isActive: formData.isActive,
        hasFreeShipping: formData.hasFreeShipping,
        title: formData.title,
        seoDescription: formData.seoDescription,
        bottomContent: formData.bottomContent,
        schemaMarkup: formData.schemaMarkup,
        canonicalUrl: formData.canonicalUrl,
        focusKeywords: formData.focusKeywords,
        screenSolution: formData.screenSolution,
      };

      console.log("Saving combo data:", comboData);

      // API call to save combo
      // const response = await fetch("/api/admin/combos", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(comboData),
      // });

      // const result = await response.json();

    //   if (result.success) {
    //     // toast.success("Combo created successfully!");
    //     // Reset form or redirect
    //     setFormData({
    //       name: "",
    //       description: "",
    //       components: [],
    //       comboRegularPrice: 0,
    //       comboSalePrice: 0,
    //       discountPercentage: 0,
    //       limitedTimeOffer: false,
    //       slug: "",
    //       category: "",
    //       brand: "",
    //       tags: "",
    //       visibility: "Draft",
    //       isActive: true,
    //       hasFreeShipping: true,
    //       image: null,
    //       title: "",
    //       seoDescription: "",
    //       bottomContent: "",
    //       schemaMarkup: "",
    //       canonicalUrl: "",
    //       focusKeywords: "",
    //       screenSolution: "",
    //     });
    //     setSelectedCategories([]);
    //     setSelectedTags([]);
    //     setImagePreview(null);
    //   } else {
    //     toast.error(result.message || "Failed to save combo");
    //   }
    // } catch (error) {
    //   console.error("Error saving combo:", error);
    //   toast.error("An error occurred while saving the combo");
    // }
  };

  return (
    <div className="p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Create Combo Product
          </h1>
          <p className="text-gray-400">
            Create a bundle of multiple products sold together
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href={"/admin/products"}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
          >
            <FaTimes className="mr-2" /> Cancel
          </Link>
          <button
            onClick={handleSaveCombo}
            className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
          >
            <FaSave className="mr-2" /> Save Combo
          </button>
        </div>
      </div>

      {/* Product Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Info & Components */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-white mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Combo Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                  placeholder="Enter combo name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Slug
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleSlugChange}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="product-slug"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Slug will be auto-generated from the name
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-32 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                  placeholder="Describe your combo product..."
                />
              </div>
            </div>
          </div>

          {/* Combo Components */}
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                Combo Components *
              </h2>
              <div className="relative">
                <button
                  onClick={() => setShowSearchResults(!showSearchResults)}
                  className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center"
                >
                  <FaPlus className="mr-2" /> Add Product
                  {showSearchResults ? (
                    <FaChevronUp className="ml-2" />
                  ) : (
                    <FaChevronDown className="ml-2" />
                  )}
                </button>

                {/* Search Dropdown - Updated to show real products */}
                {showSearchResults && (
                  <div className="absolute right-0 mt-2 w-96 bg-gray-800 border border-gray-700 rounded-xl shadow-lg z-10">
                    <div className="p-4">
                      <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-gold"
                          placeholder="Search products by name, SKU, category..."
                          autoFocus
                        />
                      </div>

                      {searchResults.length > 0 ? (
                        <div className="mt-3 max-h-60 overflow-y-auto">
                          {searchResults.map((product) => (
                            <div
                              key={product.id}
                              onClick={() => handleAddProduct(product)}
                              className="p-3 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                            >
                              <div className="flex items-center">
                                {product.thumbnail ? (
                                  <Image
                                    height={100}
                                    width={100}
                                    unoptimized
                                    src={api + product.thumbnail}
                                    alt={product.name}
                                    className="w-10 h-10 rounded-lg object-cover mr-3"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center mr-3">
                                    <FaImage className="text-gray-400" />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="font-medium text-white">
                                        {product.name}
                                      </p>
                                      <p className="text-sm text-gray-400">
                                        SKU: {product.sku} | ৳
                                        {product.originalPrice.toFixed(2)}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm text-gray-400">
                                        {product.category}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {product.brand}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : searchQuery.trim() !== "" ? (
                        <p className="mt-3 text-gray-400 text-center py-4">
                          No products found
                        </p>
                      ) : (
                        <p className="mt-3 text-gray-400 text-center py-4">
                          Start typing to search products
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {formData.components.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-700 rounded-xl">
                <FaPlus className="text-3xl text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400 mb-2">No products added yet</p>
                <p className="text-sm text-gray-500">
                  Click "Add Product" to search and add products to your combo
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.components.map((component) => (
                  <div
                    key={component.id}
                    className="combo-item p-4 rounded-xl bg-gray-800/50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-lg overflow-hidden mr-3">
                          {component.thumbnail ? (
                            <Image
                              height={100}
                              width={100}
                              unoptimized
                              src={api + component.thumbnail}
                              alt={component.name}
                              className="w-10 h-10 rounded-lg object-cover mr-3"
                            />
                          ) : (
                            <div
                              className={`w-full h-full ${component.bgColor} flex items-center justify-center text-white`}
                            >
                              <span className="text-lg font-bold">
                                {component.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {component.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            SKU: {component.sku}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveComponent(component.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <FaTimes />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Original Price
                        </label>
                        <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2">
                          <span className="text-white">
                            ৳{component.originalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Custom Sale Price
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            ৳
                          </span>
                          <input
                            type="number"
                            value={component.customPrice}
                            onChange={(e) =>
                              handleComponentChange(
                                component.id,
                                "customPrice",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            step="0.01"
                            min="0"
                            max={component.originalPrice}
                            className={`bg-gray-900 border ${
                              priceErrors[component.id]
                                ? "border-red-500"
                                : "border-gray-700"
                            } rounded-lg pl-8 pr-3 py-2 w-full focus:outline-none focus:ring-1 ${
                              priceErrors[component.id]
                                ? "focus:ring-red-500"
                                : "focus:ring-rose-gold"
                            }`}
                            placeholder="0.00"
                          />
                        </div>
                        {priceErrors[component.id] && (
                          <p className="text-red-400 text-xs mt-1">
                            {priceErrors[component.id]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          value={component.quantity}
                          onChange={(e) =>
                            handleComponentChange(
                              component.id,
                              "quantity",
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-rose-gold"
                          min="1"
                          placeholder="1"
                        />
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Item Total:</span>
                        <div className="text-right">
                          <span className="text-gray-500 line-through mr-2">
                            ৳
                            {(
                              component.originalPrice * component.quantity
                            ).toFixed(2)}
                          </span>
                          <span className="text-white font-medium">
                            ৳
                            {(
                              component.customPrice * component.quantity
                            ).toFixed(2)}
                          </span>
                          {component.customPrice < component.originalPrice && (
                            <span className="text-green-400 ml-2">
                              (
                              {(
                                ((component.originalPrice -
                                  component.customPrice) /
                                  component.originalPrice) *
                                100
                              ).toFixed(0)}
                              % off)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing Summary */}
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-white mb-4">
              Pricing Summary
            </h2>
            {formData.components.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-400">
                  Add products to see pricing details
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                  <span className="text-gray-400">Combo Regular Price:</span>
                  <span className="text-white font-medium text-lg">
                    ৳{formData.comboRegularPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                  <span className="text-gray-400">Combo Sale Price:</span>
                  <span className="text-rose-gold font-bold text-xl">
                    ৳{formData.comboSalePrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Discount:</span>
                  <div className="text-right">
                    <span className="text-green-400 font-medium">
                      {formData.discountPercentage.toFixed(1)}% off
                    </span>
                    <p className="text-sm text-green-400">
                      Save ৳
                      {(
                        formData.comboRegularPrice - formData.comboSalePrice
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SEO Content Publishing */}
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-white mb-4">SEO Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                  placeholder="Write here SEO title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  name="seoDescription"
                  value={formData.seoDescription}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-32 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                  placeholder="Write here short description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Bottom Content
                </label>
                <textarea
                  name="bottomContent"
                  value={formData.bottomContent}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-40 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                  placeholder="Write here SEO content"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Schema Markup
                </label>
                <textarea
                  name="schemaMarkup"
                  value={formData.schemaMarkup}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-40 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                  placeholder="Write here Schema Markup"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Canonical URL
                </label>
                <input
                  type="url"
                  name="canonicalUrl"
                  value={formData.canonicalUrl}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                  placeholder="Write here Canonical URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Focus Keywords
                </label>
                <input
                  type="text"
                  name="focusKeywords"
                  value={formData.focusKeywords}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                  placeholder="foundation, makeup, shade, finish, cosmetics"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate with commas
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Media & Settings */}
        <div className="space-y-6">
          {/* Combo Image */}
          <div className="glassmorphism flex items-center justify-center flex-col p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-white mb-4">Combo Image</h2>

            <input
              id="comboImageInput"
              type="file"
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
            />

            {imagePreview ? (
              <div className="w-full h-64 relative rounded-xl overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <label
                htmlFor="comboImageInput"
                className="block image-upload-area rounded-xl p-8 text-center cursor-pointer border-2 border-dashed border-gray-700 hover:border-rose-gold transition-colors w-full h-64 flex items-center justify-center flex-col"
              >
                <FaCloudUploadAlt className="text-3xl text-gray-500 mb-3" />
                <p className="text-gray-400 mb-2">
                  Drag & drop combo image here
                </p>
                <p className="text-sm text-gray-500">or</p>
              </label>
            )}

            <label
              htmlFor="comboImageInput"
              className="inline-block bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl mt-3 font-medium transition-all duration-300 cursor-pointer"
            >
              Browse Files
            </label>
          </div>

          {/* Organization */}
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-white mb-4">Organization</h2>
            <div className="space-y-4">
              {/* Product Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Product categories
                </label>

                <div className="mb-4">
                  <input
                    type="text"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    placeholder="Search categories..."
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-rose-gold focus:border-transparent text-sm"
                  />
                </div>

                <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
                  {filteredCategories.map((categoryName, index) => (
                    <label
                      key={index}
                      className="flex items-center p-2 hover:bg-gray-800/50 rounded-lg cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(categoryName)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories((prev) => [
                              ...prev,
                              categoryName,
                            ]);
                          } else {
                            setSelectedCategories((prev) =>
                              prev.filter((c) => c !== categoryName)
                            );
                          }
                        }}
                        className="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500 cursor-pointer"
                      />
                      <span className="ml-3 text-sm text-gray-300">
                        {categoryName}
                      </span>
                    </label>
                  ))}
                </div>

                {selectedCategories.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-400 mb-2">
                      Selected ({selectedCategories.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategories.map((categoryName) => (
                        <span
                          key={categoryName}
                          className="px-3 py-1 rounded-full text-xs flex items-center bg-gray-800 text-gray-300"
                        >
                          {categoryName}
                          <button
                            onClick={() =>
                              setSelectedCategories((prev) =>
                                prev.filter((c) => c !== categoryName)
                              )
                            }
                            className="ml-2 text-xs hover:text-red-400"
                          >
                            <FaTimes className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-700">
                  {showAddCategory ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Enter new category name"
                        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-rose-gold focus:border-transparent text-sm"
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && newCategory.trim()) {
                            handleAddNewCategory();
                          }
                        }}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleAddNewCategory}
                          className="bg-rose-gold hover:bg-pink-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300"
                        >
                          Add Category
                        </button>
                        <button
                          onClick={() => {
                            setShowAddCategory(false);
                            setNewCategory("");
                          }}
                          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddCategory(true)}
                      className="flex items-center text-rose-gold hover:text-pink-600 text-sm font-medium transition-colors"
                    >
                      <FaPlus className="mr-2" /> Add new category
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Brand
                </label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Screen Solutions
                </label>
                <select
                  name="screenSolution"
                  value={formData.screenSolution}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                >
                  <option value="">Select Screen Solutions</option>
                  {screenSolutions.map((solution) => (
                    <option key={solution} value={solution}>
                      {solution}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags Input */}
              <div>
                <label className=" text-sm font-medium text-gray-400 mb-2 flex items-center">
                  <FaTag className="mr-2" /> Tags
                </label>

                <div className="relative" ref={tagsRef}>
                  <div className="flex w-full">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => {
                        setTagInput(e.target.value);
                        if (e.target.value.trim()) {
                          setShowTagSuggestions(true);
                        }
                      }}
                      onFocus={() => {
                        if (tagInput.trim()) {
                          setShowTagSuggestions(true);
                        }
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && tagInput.trim()) {
                          e.preventDefault();
                          addTag(tagInput.trim());
                        }
                        if (e.key === "," && tagInput.trim()) {
                          e.preventDefault();
                          addTag(tagInput.trim().replace(",", ""));
                        }
                      }}
                      className="bg-gray-800 border w-full border-gray-700 rounded-l-xl px-4 py-3 flex-1 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                      placeholder="Type tag and press..."
                    />
                    <button
                      onClick={() => {
                        if (tagInput.trim()) {
                          addTag(tagInput.trim());
                        }
                      }}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-r-xl font-medium transition-all duration-300"
                    >
                      <FaPlus />
                    </button>
                  </div>

                  {showTagSuggestions && tagSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-white">
                            Existing Tags
                          </span>
                          <span className="text-xs text-gray-400">
                            {availableTags.length} total
                          </span>
                        </div>
                      </div>
                      {tagSuggestions.map((tag, index) => (
                        <div
                          key={index}
                          onClick={() => addTag(tag)}
                          className="px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors duration-200 flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <FaTag className="text-rose-gold mr-3" />
                            <span className="text-white">{tag}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-400 mr-2">
                              Used {getTagUsageCount(tag)} times
                            </span>
                            <FaPlus className="text-xs text-green-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {selectedTags.length > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">
                        Selected Tags ({selectedTags.length}):
                      </span>
                      <button
                        onClick={() => {
                          if (window.confirm("Remove all tags?")) {
                            setSelectedTags([]);
                          }
                        }}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 rounded-lg text-sm flex items-center bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 border border-gray-700"
                        >
                          <FaTag className="mr-2 text-rose-gold" />
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-xs hover:text-red-400"
                          >
                            <FaTimes className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-3">
                  <p className="text-sm text-gray-400 mb-2">Popular Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.slice(0, 8).map((tag, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (!selectedTags.includes(tag)) {
                            addTag(tag);
                          }
                        }}
                        disabled={selectedTags.includes(tag)}
                        className={`px-3 py-1 rounded-full text-xs transition-all duration-300 ${
                          selectedTags.includes(tag)
                            ? "bg-rose-gold text-white cursor-default"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                        }`}
                      >
                        {tag}
                        {selectedTags.includes(tag) && (
                          <FaCheck className="inline ml-1" />
                        )}
                      </button>
                    ))}
                    {availableTags.length > 8 && (
                      <span className="text-xs text-gray-500 self-center">
                        + {availableTags.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-white mb-4">Status</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Visibility
                </label>
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                >
                  <option>Draft</option>
                  <option>Published</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500"
                  />
                  <span className="ml-2 text-sm text-gray-400">
                    Active combo
                  </span>
                </label>
              </div>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasFreeShipping"
                    checked={formData.hasFreeShipping}
                    onChange={handleInputChange}
                    className="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500"
                  />
                  <span className="ml-2 text-sm text-gray-400">
                    Free Shipping
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboProductCreationPage;
