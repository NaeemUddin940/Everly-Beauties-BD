"use client";

import { useBrandStore } from "@/ZustandStore/useBrandStore";
import { useCategoryStore } from "@/ZustandStore/useCategoryStore";
import { useSimpleProductStore } from "@/ZustandStore/useSimpleProductStore";
import { useTagStore } from "@/ZustandStore/useTagStore";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  FaSpinner,
  FaTag,
  FaTimes,
} from "react-icons/fa";

// Interfaces
export interface Product {
  id: number;
  name: string;
  sku: string;
  originalPrice: number;
  category: string;
  brand: string;
  thumbnail?: string;
  description?: string;
  stock?: number;
}

export interface Category {
  id: number;
  name: string;
  parentId: number | null;
  slug: string;
}

export interface ComboComponent {
  id: number;
  productId: number;
  name: string;
  sku: string;
  originalPrice: number;
  customPrice: number;
  quantity: number;
  bgColor: string;
  thumbnail: string;
  stock?: number;
}

export interface ComboFormData {
  id?: number | string;
  name: string;
  description: string;
  slug: string;
  components: ComboComponent[];
  comboRegularPrice: number;
  comboSalePrice: number;
  discountPercentage: number;
  allowIndividualPurchase: boolean;
  limitedTimeOffer: boolean;
  category: string;
  brand: string;
  tags: string;
  visibility: string;
  isActive: boolean;
  hasFreeShipping: boolean;
  image: File | string | null;
  title: string;
  seoDescription: string;
  bottomContent: string;
  schemaMarkup: string;
  canonicalUrl: string;
  focusKeywords: string;
  screenSolution: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ComboProductEditorProps {
  mode: "create" | "edit";
  initialData?: Partial<ComboFormData>;
  productId?: string | number;
  onSave?: (data: ComboFormData) => Promise<void>;
  onCancel?: () => void;
  // API endpoints
  apiEndpoints?: {
    fetchProducts: string;
    fetchCategories: string;
    fetchTags: string;
    fetchBrands: string;
    fetchCombo?: string;
    saveCombo: string;
  };
}

// Helper functions
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

const getCategoryHierarchy = (categories: Category[]) => {
  const categoryMap = new Map<number, Category>();
  const childrenMap = new Map<number, Category[]>();

  categories.forEach((category) => {
    categoryMap.set(category.id, category);
    if (category.parentId !== null) {
      if (!childrenMap.has(category.parentId)) {
        childrenMap.set(category.parentId, []);
      }
      childrenMap.get(category.parentId)!.push(category);
    }
  });

  const buildTree = (parentId: number | null): Category[] => {
    const result: Category[] = [];
    const children =
      parentId === null
        ? categories.filter((c) => c.parentId === null)
        : childrenMap.get(parentId) || [];

    children.forEach((child) => {
      const node = { ...child };
      const childNodes = buildTree(child.id);
      if (childNodes.length > 0) {
        // For display, we'll use a flat structure with indentation
      }
      result.push(node);
    });

    return result;
  };

  return buildTree(null);
};

// Reusable Arrow Components
const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="absolute z-10 left-[-16px] md:left-[-20px] top-1/2 transform -translate-y-1/2 bg-white shadow-md bg-opacity-70 rounded-full flex items-center justify-center w-8 h-8 md:w-10 md:h-10 cursor-pointer hover:bg-opacity-90 transition-all"
  >
    <FaChevronDown className="text-pink-500 text-lg md:text-xl rotate-90" />
  </button>
);

const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="absolute z-10 right-[-16px] md:right-[-20px] top-1/2 transform -translate-y-1/2 bg-white shadow-md bg-opacity-70 rounded-full flex items-center justify-center w-8 h-8 md:w-10 md:h-10 cursor-pointer hover:bg-opacity-90 transition-all"
  >
    <FaChevronDown className="text-pink-500 text-lg md:text-xl -rotate-90" />
  </button>
);

// Main Component
const ComboProductEditor: React.FC<ComboProductEditorProps> = ({
  mode,
  initialData = {},
  productId,
  onSave,
  onCancel,
  apiEndpoints,
}) => {
  const router = useRouter();
  const { allBrands, getAllBrands } = useBrandStore();
  const { allTags, getAllTags } = useTagStore();
  const { getCategory, getAllCategory } = useCategoryStore();
  const { allSimpleProduct, getAllSimpleProduct } = useSimpleProductStore();

  // Default API endpoints
  const defaultEndpoints = {
    fetchProducts: "/api/products",
    fetchCategories: "/api/categories",
    fetchTags: "/api/tags",
    fetchBrands: "/api/brands",
    // fetchCombo: "/api/combos",
    // saveCombo: "/api/combos",
  };

  const endpoints = { ...defaultEndpoints, ...apiEndpoints };

  // Initial form data
  const initialFormData: ComboFormData = {
    name: "",
    description: "",
    slug: "",
    components: [],
    comboRegularPrice: 0,
    comboSalePrice: 0,
    discountPercentage: 0,
    allowIndividualPurchase: true,
    limitedTimeOffer: false,
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
    ...initialData,
  };

  const [formData, setFormData] = useState<ComboFormData>(initialFormData);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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
  ]);
  const [brands, setBrands] = useState<string[]>([
    "Luxe Beauty",
    "Glamour Cosmetics",
    "Pure Skin",
    "Eco Beauty",
    "Pro Makeup",
  ]);
  const [screenSolutions] = useState<string[]>([
    "Mobile Optimized",
    "Desktop View",
    "Tablet Friendly",
    "Responsive Design",
    "High Resolution",
  ]);

  // UI States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [priceErrors, setPriceErrors] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Category states
  const [categorySearch, setCategorySearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryParent, setNewCategoryParent] = useState<number | null>(
    null
  );

  // Tag states
  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const tagsRef = useRef<HTMLDivElement>(null);

  // Calculate prices
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

  // Handle product search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const addedProductIds = new Set(
      formData.components.map((comp) => comp.productId)
    );
    const availableProducts = filtered.filter(
      (product) => !addedProductIds.has(product.id)
    );

    setSearchResults(availableProducts);
  }, [searchQuery, formData.components, products]);

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

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        // Load products
        getAllSimpleProduct()
        // const productsRes = await fetch(endpoints.fetchProducts);
        // if (productsRes.ok) {
          // const productsData = await productsRes.json();
          setProducts(allSimpleProduct);
        // }

        getAllCategory()
        // Load categories
        // const categoriesRes = await fetch(endpoints.fetchCategories);
        // if (categoriesRes.ok) {
          // const categoriesData = await categoriesRes.json();
          setCategories(getCategory);
        // }

        getAllTags();
        // Load tags
        // const tagsRes = await fetch(endpoints.fetchTags);
        // if (tagsRes.ok) {
        //   const tagsData = await tagsRes.json();
        console.log(allTags)
        setAvailableTags(allTags);
        // }
        getAllBrands();
        // Load brands
        // const brandsRes = await fetch(endpoints.fetchBrands);
        // if (brandsRes.ok) {
        //   const brandsData = await brandsRes.json();
        setBrands(allBrands?.allBrand);
        // }

        // If edit mode, load combo data
        if (mode === "edit" && productId && endpoints.fetchCombo) {
          const comboRes = await fetch(`${endpoints.fetchCombo}/${productId}`);
          if (comboRes.ok) {
            const comboData = await comboRes.json();

            // Parse tags
            if (comboData.tags) {
              setSelectedTags(
                comboData.tags
                  .split(",")
                  .map((tag: string) => tag.trim())
                  .filter((tag: string) => tag)
              );
            }

            // Parse categories
            if (comboData.category) {
              setSelectedCategories(
                comboData.category
                  .split(",")
                  .map((cat: string) => cat.trim())
                  .filter((cat: string) => cat)
              );
            }

            // Set image preview if exists
            if (comboData.image && typeof comboData.image === "string") {
              setImagePreview(comboData.image);
            }

            setFormData((prev) => ({
              ...prev,
              ...comboData,
            }));
          }
        }

        // Parse initial data tags and categories
        if (initialData.tags) {
          setSelectedTags(
            initialData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag)
          );
        }
        if (initialData.category) {
          setSelectedCategories(
            initialData.category
              .split(",")
              .map((cat) => cat.trim())
              .filter((cat) => cat)
          );
        }
        if (initialData.image && typeof initialData.image === "string") {
          setImagePreview(initialData.image);
        }
      } catch (error) {
        console.error("Error initializing data:", error);
        toast.error("Failed to load initial data");
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [mode, productId, initialData, endpoints]);

  // Form handlers
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

      // Generate slug when name field changes
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

      // Validate custom price
      if (field === "customPrice") {
        const component = updatedComponents.find((c) => c.id === id);
        if (component && value > component.originalPrice) {
          setPriceErrors((prev) => ({
            ...prev,
            [id]: `Custom price must be lower than original price (৳${component.originalPrice.toFixed(
              2
            )})`,
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
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          product.name
        )}&background=random&color=fff&size=200`,
      stock: product.stock,
    };

    setFormData((prev) => ({
      ...prev,
      components: [...prev.components, newComponent],
    }));

    // Clear search
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleRemoveComponent = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      components: prev.components.filter((comp) => comp.id !== id),
    }));

    // Clear any error for this component
    setPriceErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if it's an image
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
  };

  // Category functions
  const handleAddNewCategory = () => {
    if (newCategory.trim()) {
      const trimmedName = newCategory.trim();
      const newId = Math.max(...categories.map((c) => c.id)) + 1;
      const newSlug = generateSlug(trimmedName);

      const newCategoryItem: Category = {
        id: newId,
        name: trimmedName,
        parentId: newCategoryParent,
        slug: newSlug,
      };

      setCategories((prev) => [...prev, newCategoryItem]);
      setSelectedCategories((prev) => [...prev, trimmedName]);
      setNewCategory("");
      setNewCategoryParent(null);
      setShowAddCategory(false);
      toast.success("Category added successfully");
    }
  };

  // Get parent categories for dropdown
  const parentCategories = useMemo(() => {
    return categories.filter((cat) => cat.parentId === null);
  }, [categories]);

  // Get display name with hierarchy
  const getCategoryDisplayName = useCallback(
    (category: Category): string => {
      if (category.parentId === null) {
        return category.name;
      }
      const parent = categories.find((c) => c.id === category.parentId);
      return parent ? `${parent.name} → ${category.name}` : category.name;
    },
    [categories]
  );

  // Filter categories for display with search
  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      if (!categorySearch) return true;
      const displayName = getCategoryDisplayName(category);
      return (
        displayName.toLowerCase().includes(categorySearch.toLowerCase()) ||
        category.name.toLowerCase().includes(categorySearch.toLowerCase())
      );
    });
  }, [categories, categorySearch, getCategoryDisplayName]);

  // Tag functions
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      setSelectedTags((prev) => [...prev, trimmedTag]);

      // Add to available tags if not already there
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
    };
    return mockCounts[tag] || Math.floor(Math.random() * 50) + 1;
  };

  // Filter tag suggestions based on input
  const tagSuggestions = availableTags?.filter(
      (tag) =>
        tag.toLowerCase().includes(tagInput.toLowerCase()) &&
        !selectedTags.includes(tag)
    )?.slice(0, 10);

  const popularTags = availableTags?.slice(0, 6);

  // Save handler
  const handleSaveCombo = async () => {
    // Validation
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

    setIsSaving(true);

    try {
      // Prepare data for save
      const dataToSave: ComboFormData = {
        ...formData,
        tags: selectedTags.join(", "),
        category: selectedCategories.join(", "),
      };

      // Handle image upload if it's a file
      if (formData.image && typeof formData.image !== "string") {
        // In a real app, you would upload the image to your server
        // For now, we'll just include it as a base64 string (not recommended for production)
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Image = reader.result as string;
          dataToSave.image = base64Image;
          await saveData(dataToSave);
        };
        reader.readAsDataURL(formData.image);
      } else {
        await saveData(dataToSave);
      }
    } catch (error) {
      console.error("Error saving combo:", error);
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const saveData = async (dataToSave: ComboFormData) => {
    if (onSave) {
      // Use custom save handler
      await onSave(dataToSave);
      toast.success(
        `Combo ${mode === "create" ? "created" : "updated"} successfully!`
      );
    } else {
      // Use default API
      const url =
        mode === "create"
          ? endpoints.saveCombo
          : `${endpoints.saveCombo}/${productId}`;

      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSave),
      });

      if (response.ok) {
        toast.success(
          `Combo ${mode === "create" ? "created" : "updated"} successfully!`
        );

        if (mode === "create") {
          // Reset form for new entry
          setFormData(initialFormData);
          setSelectedTags([]);
          setSelectedCategories([]);
          setImagePreview(null);
        } else {
          // Redirect or stay on edit page
          router.refresh();
        }
      } else {
        toast.error(
          `Failed to ${mode === "create" ? "create" : "update"} combo`
        );
      }
    }
  };

  // Loading state
  if (isLoading && mode === "edit") {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-rose-gold mx-auto mb-4" />
            <p className="text-gray-400">Loading combo data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {mode === "create" ? "Create Combo Product" : "Edit Combo Product"}
          </h1>
          <p className="text-gray-400">
            {mode === "create"
              ? "Create a bundle of multiple products sold together"
              : `Editing: ${formData.name || "Combo Product"}`}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onCancel || (() => router.push("/admin/products"))}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
          >
            <FaTimes className="mr-2" /> Cancel
          </button>
          <button
            onClick={handleSaveCombo}
            disabled={isSaving}
            className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="mr-2" />
                {mode === "create" ? "Save Combo" : "Update Combo"}
              </>
            )}
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

                {/* Search Dropdown */}
                {showSearchResults && (
                  <div className="absolute right-0 mt-2 w-96 bg-gray-800 border border-gray-700 rounded-xl shadow-lg z-50">
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
                                  <img
                                    src={product.thumbnail}
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
                            <img
                              src={component.thumbnail}
                              alt={component.name}
                              className="w-full h-full object-cover"
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
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-white mb-4">Combo Image</h2>
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Combo preview"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <label className="block image-upload-area rounded-xl p-8 text-center cursor-pointer border-2 border-dashed border-gray-700 hover:border-rose-gold transition-colors">
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                  <FaCloudUploadAlt className="text-3xl text-gray-500 mb-3 mx-auto" />
                  <p className="text-gray-400 mb-2">
                    Drag & drop combo image here
                  </p>
                  <p className="text-sm text-gray-500">or</p>
                  <span className="inline-block bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl mt-3 font-medium transition-all duration-300">
                    Browse Files
                  </span>
                </label>
              )}
              <p className="text-xs text-gray-500 text-center">
                Recommended size: 800x800px, Max size: 5MB
              </p>
            </div>
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

                {/* Search Categories */}
                <div className="mb-4">
                  <input
                    type="text"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    placeholder="Search categories..."
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-rose-gold focus:border-transparent text-sm"
                  />
                </div>

                {/* Categories List with Scroll */}
                <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
                  {filteredCategories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center p-2 hover:bg-gray-800/50 rounded-lg cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories((prev) => [
                              ...prev,
                              category.name,
                            ]);
                          } else {
                            setSelectedCategories((prev) =>
                              prev.filter((c) => c !== category.name)
                            );
                          }
                        }}
                        className="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500 cursor-pointer"
                      />
                      <span className="ml-3 text-sm text-gray-300">
                        {getCategoryDisplayName(category)}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Selected Categories Badges */}
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

                {/* Add New Category */}
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

                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                          Parent Category (Optional)
                        </label>
                        <select
                          value={newCategoryParent || ""}
                          onChange={(e) =>
                            setNewCategoryParent(
                              e.target.value ? parseInt(e.target.value) : null
                            )
                          }
                          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-rose-gold focus:border-transparent text-sm"
                        >
                          <option value="">None (Root Category)</option>
                          {parentCategories.map((parent) => (
                            <option key={parent.id} value={parent.id}>
                              {parent.name}
                            </option>
                          ))}
                        </select>
                      </div>

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
                            setNewCategoryParent(null);
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
                  {brands?.map((brand) => (
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
                  {screenSolutions?.map((solution) => (
                    <option key={solution} value={solution}>
                      {solution}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags Input with Search and Suggestions */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                  <FaTag className="mr-2" /> Tags
                </label>

                {/* Tags Input with Search */}
                <div className="relative" ref={tagsRef}>
                  <div className="flex">
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
                      className="bg-gray-800 border border-gray-700 rounded-l-xl px-4 py-3 flex-1 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                      placeholder="Type tag and press Enter or search existing tags..."
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

                  {/* Tag Suggestions Dropdown */}
                  {showTagSuggestions && tagSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-lg max-h-30 overflow-y-auto">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-white">
                            Existing Tags
                          </span>
                          <span className="text-xs text-gray-400">
                            {availableTags?.length} total
                          </span>
                        </div>
                      </div>
                      {tagSuggestions?.map((tag, index) => (
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

                {/* Selected Tags Display */}
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
                      {selectedTags?.map((tag, index) => (
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

                {/* Popular Tags */}
                <div className="mt-3">
                  <p className="text-sm text-gray-400 mb-2">Popular Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {popularTags?.map((tag, index) => (
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
                    {availableTags?.length > 6 && (
                      <span className="text-xs text-gray-500 self-center">
                        + {availableTags?.length - 6} more
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
                    name="allowIndividualPurchase"
                    checked={formData.allowIndividualPurchase}
                    onChange={handleInputChange}
                    className="custom-checkbox"
                  />
                  <span className="ml-2 text-sm text-gray-400">
                    Allow Individual Purchase
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="limitedTimeOffer"
                    checked={formData.limitedTimeOffer}
                    onChange={handleInputChange}
                    className="custom-checkbox"
                  />
                  <span className="ml-2 text-sm text-gray-400">
                    Limited Time Offer
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="custom-checkbox"
                  />
                  <span className="ml-2 text-sm text-gray-400">
                    Active combo
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasFreeShipping"
                    checked={formData.hasFreeShipping}
                    onChange={handleInputChange}
                    className="custom-checkbox"
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

export default ComboProductEditor;
