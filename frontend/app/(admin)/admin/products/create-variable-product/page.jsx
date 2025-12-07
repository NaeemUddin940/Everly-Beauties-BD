"use client";
import { useBrandStore } from "@/ZustandStore/useBrandStore";
import { useCategoryStore } from "@/ZustandStore/useCategoryStore";
import { useScreenSolutionStore } from "@/ZustandStore/useScreenSolutionStore";
import { useTagStore } from "@/ZustandStore/useTagStore";
import { useVariableProduct } from "@/ZustandStore/useVariableProduct";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  FaBox,
  FaCheck,
  FaCheckCircle,
  FaCloudUploadAlt,
  FaImage,
  FaImages,
  FaLayerGroup,
  FaMagic,
  FaPalette,
  FaPlus,
  FaSave,
  FaSearch,
  FaSortAlphaDown,
  FaTag,
  FaTimes,
  FaTrash,
} from "react-icons/fa";

const CreateVariableProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    slug: "",
    description: "",
    ingredients: "",
    usageGuide: "",
    title: "",
    seoDescription: "",
    bottomContent: "",
    schemaMarkup: "",
    canonicalUrl: "",
    focusKeywords: "",
    mainImage: null,
    galleryImages: [],
    category: "",
    brand: "",
    screenSolution: "",
    tags: "",
    visibility: "published",
    isActive: true,
  });

  // Global attribute repository
  const [globalAttributes, setGlobalAttributes] = useState([
    {
      id: 1,
      name: "Shade",
      values: ["Porcelain", "Ivory", "Sand", "Honey", "Cocoa", "Beige"],
    },
    {
      id: 2,
      name: "Finish",
      values: ["Matte", "Natural", "Dewy", "Satin", "Glossy"],
    },
    {
      id: 3,
      name: "Size",
      values: ["10ml", "30ml", "50ml", "100ml", "Travel Size", "Full Size"],
    },
    {
      id: 4,
      name: "Coverage",
      values: ["Sheer", "Light", "Medium", "Full", "Buildable"],
    },
    {
      id: 5,
      name: "Skin Type",
      values: ["Normal", "Dry", "Oily", "Combination", "Sensitive"],
    },
    { id: 6, name: "SPF", values: ["SPF 15", "SPF 30", "SPF 50", "No SPF"] },
    {
      id: 7,
      name: "Color",
      values: ["Red", "Pink", "Purple", "Blue", "Green", "Brown", "Nude"],
    },
    {
      id: 8,
      name: "Intensity",
      values: ["Light", "Medium", "Bold", "Deep", "Vibrant"],
    },
  ]);

  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [availableTags, setAvailableTags] = useState([
    "cosmetics",
    "makeup",
    "beauty",
    "skincare",
    "foundation",
    "lipstick",
    "eyeshadow",
    "blush",
    "highlighter",
    "mascara",
    "eyeliner",
    "concealer",
    "natural",
    "organic",
    "vegan",
    "cruelty-free",
    "long-lasting",
    "waterproof",
    "matte",
    "glossy",
    "satin",
    "dewy",
    "full-coverage",
    "lightweight",
    "sensitive-skin",
    "oil-free",
    "hydrating",
    "anti-aging",
    "spf",
    "primer",
  ]);

  const tagsRef = useRef(null);
  const { createVariableProduct, updateVariableProduct } = useVariableProduct();
  const { getAllBrands, allBrands } = useBrandStore();
  const { getAllCategory, getCategory } = useCategoryStore();
  const { allTags, getAllTags } = useTagStore();
  const { getAllScreenSolution, allScreenSolution } = useScreenSolutionStore();

  // এই স্টেটগুলো শুধুমাত্র UI preview-এর জন্য
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [galleryImagesPreview, setGalleryImagesPreview] = useState([]);

  // এই স্টেটগুলো সার্ভারে পাঠানোর জন্য (File objects)
  const [mainImageFile, setMainImageFile] = useState(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState([]);
  const [variationImageFiles, setVariationImageFiles] = useState({});

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryTab, setCategoryTab] = useState("all");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [variations, setVariations] = useState([]);

  const [attributeSearch, setAttributeSearch] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [newAttributeName, setNewAttributeName] = useState("");
  const [newAttributeValues, setNewAttributeValues] = useState([]);
  const [newAttributeValueInput, setNewAttributeValueInput] = useState("");
  const [valueSuggestions, setValueSuggestions] = useState([]);

  const [activeAttributeId, setActiveAttributeId] = useState(null);
  const [
    showValueSuggestionsForAttribute,
    setShowValueSuggestionsForAttribute,
  ] = useState(null);
  const [valueInputForAttribute, setValueInputForAttribute] = useState({});

  const searchRef = useRef(null);
  const valueInputRef = useRef(null);

  const screenSolutions = [
    "Oily Skin",
    "Dry Skin",
    "Combination Skin",
    "Sensitive Skin",
    "Acne-Prone Skin",
    "Aging Solutions",
    "Dark Spots",
    "Hyperpigmentation",
  ];

  const categories = [
    "Combo",
    "Hair Care Shop",
    "Hair Mask",
    "Hair Oil",
    "Hair Serum",
    "Shampoo",
    "Tools",
    "Makeup shop",
  ];

  // const [mostUsedCategories, setMostUsedCategories] = useState([
  //   "Shampoo",
  //   "Hair Oil",
  //   "Makeup shop",
  // ]);

  const [showAllTags, setShowAllTags] = useState(false);

  const displayedTags = showAllTags ? allTags?.tags : allTags?.tags.slice(0, 5);

  // Filter tag suggestions based on input
  const tagSuggestions = availableTags
    .filter(
      (tag) =>
        tag.toLowerCase().includes(tagInput.toLowerCase()) &&
        !selectedTags.includes(tag)
    )
    .slice(0, 8);

  // Function to add a tag
  const addTag = (tag) => {
    const cleanTag = tag.trim().toLowerCase();
    if (cleanTag && !selectedTags.includes(cleanTag)) {
      setSelectedTags((prev) => [...prev, cleanTag]);

      if (!availableTags.includes(cleanTag)) {
        setAvailableTags((prev) => [...prev, cleanTag]);
      }
    }
    setTagInput("");
    setShowTagSuggestions(false);
  };

  // Function to remove a tag
  const removeTag = (tagToRemove) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  // Get tag usage count
  const getTagUsageCount = (tag) => {
    const counts = {
      makeup: 156,
      cosmetics: 142,
      beauty: 128,
      skincare: 115,
      natural: 98,
      vegan: 87,
      foundation: 76,
      lipstick: 72,
    };
    return counts[tag] || Math.floor(Math.random() * 50) + 1;
  };

  // Function to handle tag input from comma-separated string
  const handleTagsInputChange = (e) => {
    const value = e.target.value;
    setTagInput(value);

    if (value.endsWith(",")) {
      const tag = value.slice(0, -1).trim();
      if (tag) {
        addTag(tag);
      }
    }
  };

  // Function to add new category
  const handleAddNewCategory = () => {
    if (newCategory.trim()) {
      const categoryName = newCategory.trim();
      if (!selectedCategories.includes(categoryName)) {
        setSelectedCategories((prev) => [...prev, categoryName]);
      }
      setNewCategory("");
      setShowAddCategory(false);
    }
  };

  // Add to useEffect to close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (
        valueInputRef.current &&
        !valueInputRef.current.contains(event.target)
      ) {
        setValueSuggestions([]);
      }

      if (!event.target.closest(".attribute-item")) {
        setActiveAttributeId(null);
      }

      if (tagsRef.current && !tagsRef.current.contains(event.target)) {
        setShowTagSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update search suggestions when search term changes
  useEffect(() => {
    if (attributeSearch.trim()) {
      const searchTerm = attributeSearch.toLowerCase();
      const suggestions = globalAttributes
        .filter(
          (attr) =>
            attr.name.toLowerCase().includes(searchTerm) ||
            attr.values.some((value) =>
              value.toLowerCase().includes(searchTerm)
            )
        )
        .map((attr) => ({
          ...attr,
          matchType: attr.name.toLowerCase().includes(searchTerm)
            ? "name"
            : "value",
        }))
        .slice(0, 8);

      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [attributeSearch, globalAttributes]);

  // Get suggestions for existing attribute values
  const getValueSuggestionsForAttribute = (attributeId, inputValue) => {
    if (!inputValue.trim()) return [];

    const attribute = globalAttributes.find((attr) => attr.id === attributeId);
    if (!attribute) return [];

    const searchTerm = inputValue.toLowerCase();

    const selectedAttr = selectedAttributes.find(
      (attr) => attr.id === attributeId
    );
    const selectedValues = selectedAttr ? selectedAttr.values : [];

    return attribute.values
      .filter(
        (value) =>
          value.toLowerCase().includes(searchTerm) &&
          !selectedValues.includes(value)
      )
      .slice(0, 5);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setProductData((prev) => ({
      ...prev,
      name,
      slug,
    }));
  };

  const handleImageUpload = (e, type) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (type === "mainImage") {
      // 1. সার্ভারে পাঠানোর জন্য File object সেভ করুন
      setMainImageFile(files[0]);

      // 2. UI preview-এর জন্য base64 তৈরি করুন
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    } else if (type === "galleryImages") {
      // 1. সার্ভারে পাঠানোর জন্য File objects সেভ করুন
      setGalleryImageFiles((prev) => [...prev, ...files]);

      // 2. UI preview-এর জন্য base64 তৈরি করুন
      const readers = files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then((results) => {
        setGalleryImagesPreview((prev) => [...prev, ...results]);
      });
    }
  };

  const handleVariationImageUpload = (variationId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. সার্ভারে পাঠানোর জন্য File object সেভ করুন
    setVariationImageFiles((prev) => ({
      ...prev,
      [variationId]: file,
    }));

    // 2. UI preview-এর জন্য base64 তৈরি করুন
    const reader = new FileReader();
    reader.onloadend = () => {
      setVariations((prev) =>
        prev.map((variation) =>
          variation.id === variationId
            ? { ...variation, image: reader.result }
            : variation
        )
      );
    };
    reader.readAsDataURL(file);
  };

  const removeGalleryImage = (index) => {
    // UI preview রিমুভ করুন
    setGalleryImagesPreview((prev) => prev.filter((_, i) => i !== index));

    // File object রিমুভ করুন
    setGalleryImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // UPDATED handleSave function - FormData ব্যবহার করুন
  // UPDATED handleSave function
  const handleSave = async () => {
    try {
      const formData = new FormData();

      // Basic product data যোগ করুন
      formData.append("name", productData.name);
      formData.append("slug", productData.slug);
      formData.append("description", productData.description);
      formData.append("ingredients", productData.ingredients);
      formData.append("usageGuide", productData.usageGuide);
      formData.append("productType", "variable");

      // Attributes
      const attributesData = selectedAttributes.map((attr) => ({
        name: attr.name,
        values: attr.values,
        usedForVariations: attr.usedForVariations || true,
      }));
      formData.append("attributes", JSON.stringify(attributesData));

      // Variations
      const variationsForServer = variations.map((variation) => ({
        attributes: variation.attributes,
        sku: variation.sku,
        price: variation.price,
        stock: variation.stock,
        isActive: true,
      }));
      formData.append("variations", JSON.stringify(variationsForServer));

      // Main image
      if (mainImageFile) formData.append("mainImage", mainImageFile);
      else formData.append("mainImage", "");

      // Gallery images
      if (galleryImageFiles.length > 0) {
        galleryImageFiles.forEach((file) =>
          formData.append("galleryImages", file)
        );
      } else {
        formData.append("galleryImages", "");
      }

      // Variation images
      Object.entries(variationImageFiles).forEach(([variationId, file]) => {
        formData.append(`variationImages[${variationId}]`, file);
      });

      // Other fields
      formData.append("categories", JSON.stringify(selectedCategories));
      formData.append("brand", productData.brand);
      formData.append("tags", JSON.stringify(selectedTags));
      formData.append("screenSolution", productData.screenSolution);

      // SEO
      const seoData = {
        title: productData.title,
        description: productData.seoDescription,
        keywords: productData.focusKeywords
          ? productData.focusKeywords.split(",").map((k) => k.trim())
          : [],
        canonicalUrl: productData.canonicalUrl,
        schemaMarkup: productData.schemaMarkup,
        focusKeywords: productData.focusKeywords
          ? productData.focusKeywords.split(",").map((k) => k.trim())
          : [],
      };
      formData.append("seo", JSON.stringify(seoData));

      formData.append("bottomContent", productData.bottomContent);
      formData.append(
        "status",
        productData.visibility === "published"
          ? "published"
          : productData.visibility === "draft"
          ? "draft"
          : "hidden"
      );
      formData.append("isActive", productData.isActive.toString());
      formData.append("visibility", productData.visibility);

      // Debugging
      console.log("=== FormData Contents ===");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Submit FormData
      await createVariableProduct(formData);

      // === Clear all state after submission ===
      setProductData({
        name: "",
        slug: "",
        description: "",
        ingredients: "",
        usageGuide: "",
        brand: "",
        mainImage: null,
        screenSolution: "",
        title: "",
        seoDescription: "",
        focusKeywords: "",
        canonicalUrl: "",
        schemaMarkup: "",
        bottomContent: "",
        visibility: "draft",
        isActive: true,
      });
      setSelectedCategories([]);
      setSelectedAttributes([]);
      setVariations([]);
      setSelectedTags([]);
      setMainImagePreview(null);
      setGalleryImagesPreview([]);
      setMainImageFile(null);
      setGalleryImageFiles([]);
      setVariationImageFiles({});

      console.log("Form cleared successfully!");
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // Select existing attribute from search suggestions
  const selectExistingAttribute = (attribute) => {
    if (selectedAttributes.find((attr) => attr.id === attribute.id)) {
      setAttributeSearch("");
      return;
    }

    const newSelectedAttribute = {
      id: attribute.id,
      name: attribute.name,
      values: [],
      usedForVariations: true,
      visible: true,
      isNew: false,
    };

    setSelectedAttributes((prev) => [...prev, newSelectedAttribute]);
    setAttributeSearch("");
    setShowSuggestions(false);
    setActiveAttributeId(attribute.id);
  };

  // Create new attribute
  const createNewAttribute = () => {
    if (!newAttributeName.trim()) {
      alert("Please enter an attribute name");
      return;
    }

    if (newAttributeValues.length === 0) {
      alert("Please add at least one value for the attribute");
      return;
    }

    const existingAttribute = globalAttributes.find(
      (attr) =>
        attr.name.toLowerCase() === newAttributeName.trim().toLowerCase()
    );

    let attributeId;
    let finalAttribute;

    if (existingAttribute) {
      attributeId = existingAttribute.id;

      const mergedValues = [
        ...new Set([...existingAttribute.values, ...newAttributeValues]),
      ];

      setGlobalAttributes((prev) =>
        prev.map((attr) =>
          attr.id === attributeId ? { ...attr, values: mergedValues } : attr
        )
      );

      finalAttribute = {
        id: attributeId,
        name: existingAttribute.name,
        values: mergedValues,
      };
    } else {
      attributeId =
        globalAttributes.length > 0
          ? Math.max(...globalAttributes.map((a) => a.id)) + 1
          : 1;

      const newAttribute = {
        id: attributeId,
        name: newAttributeName.trim(),
        values: newAttributeValues,
      };

      setGlobalAttributes((prev) => [...prev, newAttribute]);
      finalAttribute = newAttribute;
    }

    const newSelectedAttribute = {
      id: attributeId,
      name: finalAttribute.name,
      values: newAttributeValues,
      usedForVariations: true,
      visible: true,
      isNew: true,
    };

    setSelectedAttributes((prev) => [...prev, newSelectedAttribute]);
    setActiveAttributeId(attributeId);

    setNewAttributeName("");
    setNewAttributeValues([]);
    setNewAttributeValueInput("");
  };

  // Add value to new attribute
  const addNewAttributeValue = () => {
    const value = newAttributeValueInput.trim();
    if (!value) return;

    if (!newAttributeValues.includes(value)) {
      setNewAttributeValues((prev) => [...prev, value]);
    }

    setNewAttributeValueInput("");
    setValueSuggestions([]);
  };

  // Remove value from new attribute
  const removeNewAttributeValue = (valueToRemove) => {
    setNewAttributeValues((prev) =>
      prev.filter((value) => value !== valueToRemove)
    );
  };

  // Select value suggestion for new attribute
  const selectValueSuggestion = (value) => {
    if (!newAttributeValues.includes(value)) {
      setNewAttributeValues((prev) => [...prev, value]);
    }
    setNewAttributeValueInput("");
    setValueSuggestions([]);
  };

  // Remove selected attribute
  const removeSelectedAttribute = (attributeId) => {
    setSelectedAttributes((prev) =>
      prev.filter((attr) => attr.id !== attributeId)
    );
    if (activeAttributeId === attributeId) {
      setActiveAttributeId(null);
    }
  };

  // Add value to selected attribute with suggestions
  const addValueToSelectedAttribute = (attributeId, value) => {
    if (!value.trim()) return;

    const selectedAttr = selectedAttributes.find(
      (attr) => attr.id === attributeId
    );
    if (selectedAttr && selectedAttr.values.includes(value.trim())) {
      return;
    }

    setSelectedAttributes((prev) =>
      prev.map((attr) => {
        if (attr.id === attributeId) {
          const newValues = [...attr.values, value.trim()];

          if (!attr.isNew) {
            const globalAttr = globalAttributes.find(
              (a) => a.id === attributeId
            );
            if (globalAttr && !globalAttr.values.includes(value.trim())) {
              setGlobalAttributes((prev) =>
                prev.map((a) =>
                  a.id === attributeId
                    ? { ...a, values: [...a.values, value.trim()] }
                    : a
                )
              );
            }
          }

          return { ...attr, values: newValues };
        }
        return attr;
      })
    );

    setValueInputForAttribute((prev) => ({ ...prev, [attributeId]: "" }));
    setShowValueSuggestionsForAttribute(null);
  };

  // Remove value from selected attribute
  const removeValueFromSelectedAttribute = (attributeId, valueToRemove) => {
    setSelectedAttributes((prev) =>
      prev.map((attr) => {
        if (attr.id === attributeId) {
          return {
            ...attr,
            values: attr.values.filter((value) => value !== valueToRemove),
          };
        }
        return attr;
      })
    );
  };

  // Toggle attribute use for variations
  const toggleAttributeUse = (attributeId) => {
    setSelectedAttributes((prev) =>
      prev.map((attr) =>
        attr.id === attributeId
          ? { ...attr, usedForVariations: !attr.usedForVariations }
          : attr
      )
    );
  };

  const handleVariationChange = (variationId, field, value) => {
    setVariations((prev) =>
      prev.map((variation) =>
        variation.id === variationId
          ? { ...variation, [field]: value }
          : variation
      )
    );
  };

  const addVariation = () => {
    const newId =
      variations.length > 0 ? Math.max(...variations.map((v) => v.id)) + 1 : 1;

    const defaultAttributes = {};
    selectedAttributes.forEach((attr) => {
      if (attr.usedForVariations && attr.values.length > 0) {
        defaultAttributes[attr.name] = attr.values[0];
      }
    });

    setVariations((prev) => [
      ...prev,
      {
        id: newId,
        attributes: defaultAttributes,
        sku: "",
        price: 0,
        stock: 0,
        image: null,
      },
    ]);
  };

  const removeVariation = (variationId) => {
    setVariations((prev) => prev.filter((v) => v.id !== variationId));

    // Variation image-ও রিমুভ করুন
    setVariationImageFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[variationId];
      return newFiles;
    });
  };

  const generateAllVariations = () => {
    if (selectedAttributes.length === 0) {
      alert("Please add attributes first");
      return;
    }

    const variationAttributes = selectedAttributes.filter(
      (attr) => attr.usedForVariations && attr.values.length > 0
    );

    if (variationAttributes.length === 0) {
      alert('No attributes with values are marked "Used for variations"');
      return;
    }

    let combinations = [[]];

    for (const attr of variationAttributes) {
      const newCombinations = [];
      for (const combination of combinations) {
        for (const value of attr.values) {
          newCombinations.push([...combination, { name: attr.name, value }]);
        }
      }
      combinations = newCombinations;
    }

    const newVariations = combinations.map((combination, index) => {
      const attributesObj = {};
      combination.forEach((item) => {
        attributesObj[item.name] = item.value;
      });

      const existingVariation = variations.find(
        (v) => JSON.stringify(v.attributes) === JSON.stringify(attributesObj)
      );

      if (existingVariation) {
        return existingVariation;
      }

      const newId =
        variations.length > 0
          ? Math.max(...variations.map((v) => v.id)) + index + 1
          : index + 1;

      const skuPrefix = productData.name
        ? productData.name.substring(0, 3).toUpperCase()
        : "VAR";
      const attributeInitials = combination
        .map((item) => item.value.substring(0, 2).toUpperCase())
        .join("");

      return {
        id: newId,
        attributes: attributesObj,
        sku: `${skuPrefix}-${attributeInitials}-${newId}`,
        price: 0,
        stock: 0,
        image: null,
      };
    });

    setVariations(newVariations);
  };

  const getAttributeColor = (attributeName, value) => {
    const colorMap = {
      Porcelain: "#fecdd3",
      Ivory: "#fde68a",
      Sand: "#d4a574",
      Honey: "#fda4af",
      Cocoa: "#8b4513",
      Beige: "#d1a782",
      Matte: "#666666",
      Natural: "#a8a29e",
      Dewy: "#f0abfc",
      Satin: "#d4d4d4",
      Glossy: "#fef3c7",
      Red: "#ef4444",
      Pink: "#ec4899",
      Purple: "#8b5cf6",
      Blue: "#3b82f6",
      Green: "#10b981",
      Brown: "#92400e",
      Nude: "#d6d3d1",
      "10ml": "#93c5fd",
      "30ml": "#60a5fa",
      "50ml": "#3b82f6",
      "100ml": "#1d4ed8",
      "Travel Size": "#a5b4fc",
      "Full Size": "#818cf8",
      Normal: "#86efac",
      Dry: "#fde68a",
      Oily: "#fca5a5",
      Combination: "#c4b5fd",
      Sensitive: "#f9a8d4",
      Black: "#000000",
      White: "#ffffff",
    };

    return colorMap[value] || "#cccccc";
  };

  const getVariationColor = (variation) => {
    for (const [key, value] of Object.entries(variation.attributes)) {
      const color = getAttributeColor(key, value);
      if (color !== "#cccccc") {
        return color;
      }
    }
    return "#cccccc";
  };

  // Add value from suggestion
  const addValueFromSuggestion = (attributeId, value) => {
    addValueToSelectedAttribute(attributeId, value);
  };

  useEffect(() => {
    getAllBrands();
    getAllCategory();
    getAllTags();
    getAllScreenSolution();
  }, [getAllBrands, getAllCategory, getAllTags, getAllScreenSolution]);
  // console.log(allScreenSolution);

  return (
    <div className="flex-1 p-8">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Add Variable Product
          </h1>
          <p className="text-gray-400">
            Create a product with variations using attributes
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
            onClick={handleSave}
            className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center"
          >
            <FaSave className="mr-2" /> Save Product
          </button>
        </div>
      </div>

      {/* Product Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Info & Attributes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <FaLayerGroup className="mr-2" /> Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={productData.name}
                  onChange={handleNameChange}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={productData.slug}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                  placeholder="product-slug"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={productData.description}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-32 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                  placeholder="Enter product description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Ingredients
                </label>
                <textarea
                  name="ingredients"
                  value={productData.ingredients}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-32 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                  placeholder="Enter product ingredients"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Usage Guide
                </label>
                <textarea
                  name="usageGuide"
                  value={productData.usageGuide}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-32 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                  placeholder="Enter product usage guide"
                />
              </div>
            </div>
          </div>

          {/* Attributes Section */}
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <FaPalette className="mr-2" /> Attributes Management
            </h2>

            {/* Search Existing Attributes */}
            <div className="mb-6" ref={searchRef}>
              <h3 className="font-medium text-white mb-3">
                Quick Add Attributes
              </h3>
              <div className="relative">
                <div className="flex">
                  <input
                    type="text"
                    value={attributeSearch}
                    onChange={(e) => setAttributeSearch(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    className="bg-gray-800 border border-gray-700 rounded-l-xl px-4 py-3 flex-1 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="Search existing attributes..."
                  />
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-r-xl font-medium transition-all duration-300">
                    <FaSearch />
                  </button>
                </div>

                {/* Enhanced Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-lg max-h-80 overflow-y-auto">
                    {searchSuggestions.map((attribute) => (
                      <div
                        key={attribute.id}
                        onClick={() => selectExistingAttribute(attribute)}
                        className={`px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors duration-200 border-b border-gray-700 last:border-b-0 ${
                          selectedAttributes.find(
                            (attr) => attr.id === attribute.id
                          )
                            ? "opacity-60"
                            : ""
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="text-white font-medium">
                              {attribute.name}
                            </span>
                            {attribute.matchType === "value" && (
                              <span className="ml-2 px-1.5 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded">
                                Value Match
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">
                            {attribute.values.length} values available
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1 flex items-center">
                          <FaSortAlphaDown className="mr-1" />
                          Values: {attribute.values.slice(0, 3).join(", ")}
                          {attribute.values.length > 3 && "..."}
                        </div>
                        <div className="text-xs text-rose-gold mt-1">
                          Click to add attribute (no values by default)
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Search by attribute name or value. Click to add with all
                existing values.
              </p>
            </div>

            {/* Create New Attribute */}
            <div className="mb-6">
              <h3 className="font-medium text-white mb-3">
                Create Custom Attribute
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Attribute Name
                  </label>
                  <input
                    type="text"
                    value={newAttributeName}
                    onChange={(e) => setNewAttributeName(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                    placeholder="e.g., Material, Scent, Length"
                  />
                </div>

                <div ref={valueInputRef}>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Add Values
                  </label>
                  <div className="relative">
                    <div className="flex">
                      <input
                        type="text"
                        value={newAttributeValueInput}
                        onChange={(e) =>
                          setNewAttributeValueInput(e.target.value)
                        }
                        className="bg-gray-800 border border-gray-700 rounded-l-xl px-4 py-3 flex-1 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                        placeholder="Type value and press Enter or click +"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addNewAttributeValue();
                          }
                        }}
                      />
                      <button
                        onClick={addNewAttributeValue}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-r-xl font-medium transition-all duration-300"
                      >
                        <FaPlus />
                      </button>
                    </div>

                    {/* Value Suggestions */}
                    {valueSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-lg">
                        <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-700">
                          Existing values from other attributes
                        </div>
                        {valueSuggestions.map((value, index) => (
                          <div
                            key={index}
                            onClick={() => selectValueSuggestion(value)}
                            className="px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors duration-200 flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <FaCheck className="text-green-400 mr-2 text-sm" />
                              <span className="text-white">{value}</span>
                            </div>
                            <span className="text-xs text-gray-400">
                              Click to add
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Values Preview */}
                {newAttributeValues.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">
                      Selected Values:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {newAttributeValues.map((value, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-sm flex items-center bg-gray-700 text-gray-300"
                        >
                          {value}
                          <button
                            onClick={() => removeNewAttributeValue(value)}
                            className="ml-2 text-xs hover:text-red-400"
                          >
                            <FaTrash className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={createNewAttribute}
                  disabled={
                    !newAttributeName.trim() || newAttributeValues.length === 0
                  }
                  className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPlus className="mr-2" /> Create Attribute
                </button>
              </div>
            </div>

            {/* Selected Attributes */}
            {selectedAttributes.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-white">
                    Selected Attributes ({selectedAttributes.length})
                  </h3>
                  <button
                    onClick={generateAllVariations}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center"
                  >
                    <FaMagic className="mr-2" /> Generate Variations
                  </button>
                </div>
                <div className="space-y-4">
                  {selectedAttributes.map((attribute) => {
                    const globalAttr = globalAttributes.find(
                      (a) => a.id === attribute.id
                    );
                    const availableValues = globalAttr
                      ? globalAttr.values.filter(
                          (v) => !attribute.values.includes(v)
                        )
                      : [];

                    return (
                      <div
                        key={attribute.id}
                        className={`attribute-item p-4 border rounded-xl transition-all duration-300 ${
                          activeAttributeId === attribute.id
                            ? "border-rose-gold bg-gray-800/50"
                            : "border-gray-700"
                        }`}
                        onClick={() =>
                          setActiveAttributeId(
                            activeAttributeId === attribute.id
                              ? null
                              : attribute.id
                          )
                        }
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center">
                            <h4 className="font-medium text-white">
                              {attribute.name}
                            </h4>
                            <span
                              className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                attribute.isNew
                                  ? "bg-purple-500/20 text-purple-300"
                                  : "bg-blue-500/20 text-blue-300"
                              }`}
                            >
                              {attribute.isNew ? "New" : "Existing"}
                            </span>
                            <span className="ml-2 text-sm text-gray-400">
                              ({attribute.values.length} of{" "}
                              {globalAttr?.values.length || 0} values selected)
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={attribute.usedForVariations}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  toggleAttributeUse(attribute.id);
                                }}
                                className="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500 cursor-pointer"
                              />
                              <span className="ml-2 text-sm text-gray-400">
                                Use in variations
                              </span>
                            </label>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeSelectedAttribute(attribute.id);
                              }}
                              className="text-red-400 hover:text-red-300"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>

                        {/* Enhanced Value Management */}
                        <div className="mb-3">
                          <div className="relative mb-2">
                            <div className="flex">
                              <input
                                type="text"
                                value={
                                  valueInputForAttribute[attribute.id] || ""
                                }
                                onChange={(e) => {
                                  setValueInputForAttribute((prev) => ({
                                    ...prev,
                                    [attribute.id]: e.target.value,
                                  }));
                                  if (e.target.value.trim()) {
                                    setShowValueSuggestionsForAttribute(
                                      attribute.id
                                    );
                                  }
                                }}
                                onFocus={() => {
                                  if (
                                    valueInputForAttribute[attribute.id]?.trim()
                                  ) {
                                    setShowValueSuggestionsForAttribute(
                                      attribute.id
                                    );
                                  }
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-gray-800 border border-gray-700 rounded-l-lg px-3 py-2 flex-1 text-sm focus:outline-none focus:ring-1 focus:ring-rose-gold focus:border-transparent"
                                placeholder={`Add value to ${attribute.name}`}
                                onKeyPress={(e) => {
                                  if (
                                    e.key === "Enter" &&
                                    e.target.value.trim()
                                  ) {
                                    addValueToSelectedAttribute(
                                      attribute.id,
                                      e.target.value
                                    );
                                  }
                                }}
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const value =
                                    valueInputForAttribute[attribute.id];
                                  if (value?.trim()) {
                                    addValueToSelectedAttribute(
                                      attribute.id,
                                      value
                                    );
                                  }
                                }}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-r-lg text-sm font-medium transition-all duration-300"
                              >
                                Add
                              </button>
                            </div>

                            {/* Value Suggestions for Existing Attribute */}
                            {showValueSuggestionsForAttribute ===
                              attribute.id &&
                              valueInputForAttribute[attribute.id]?.trim() && (
                                <div className="absolute z-20 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                                  <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-700">
                                    Suggestions from existing values
                                  </div>
                                  {getValueSuggestionsForAttribute(
                                    attribute.id,
                                    valueInputForAttribute[attribute.id]
                                  ).map((value, index) => (
                                    <div
                                      key={index}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        addValueFromSuggestion(
                                          attribute.id,
                                          value
                                        );
                                      }}
                                      className="px-3 py-2 hover:bg-gray-700 cursor-pointer transition-colors duration-200 text-sm flex items-center justify-between"
                                    >
                                      <div className="flex items-center">
                                        <FaCheck className="text-green-400 mr-2" />
                                        <span className="text-white">
                                          {value}
                                        </span>
                                      </div>
                                      <span className="text-xs text-gray-400">
                                        Click to add
                                      </span>
                                    </div>
                                  ))}
                                  {getValueSuggestionsForAttribute(
                                    attribute.id,
                                    valueInputForAttribute[attribute.id]
                                  ).length === 0 && (
                                    <div className="px-3 py-2 text-sm text-gray-400 text-center">
                                      No matching values found
                                    </div>
                                  )}
                                </div>
                              )}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mb-2">
                            <FaSearch className="mr-1" />
                            <span>Type to search existing values</span>
                            {!attribute.isNew && (
                              <span className="ml-auto">
                                {availableValues.length} values available in
                                global
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Attribute Values with Colors */}
                        {attribute.values.length > 0 && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-sm text-gray-400">
                                Selected Values ({attribute.values.length}):
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {attribute.values.map((value, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1.5 rounded-lg text-sm flex items-center bg-gray-800 text-gray-300 border border-gray-700"
                                >
                                  <div
                                    className="w-3 h-3 rounded-full mr-2 border border-gray-600"
                                    style={{
                                      backgroundColor: getAttributeColor(
                                        attribute.name,
                                        value
                                      ),
                                    }}
                                  />
                                  {value}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeValueFromSelectedAttribute(
                                        attribute.id,
                                        value
                                      );
                                    }}
                                    className="ml-2 text-xs hover:text-red-400"
                                  >
                                    <FaTrash className="w-3 h-3" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Variations */}
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <FaBox className="mr-2" /> Variations ({variations.length})
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={addVariation}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center"
                >
                  <FaPlus className="mr-2" /> Add Manual
                </button>
              </div>
            </div>

            {/* Variations Table */}
            {variations.length === 0 ? (
              <div className="text-center py-8">
                <FaBox className="text-4xl text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">No variations created yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  Add attributes with values and click "Auto Generate" or "Add
                  Manual"
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-3 px-4 text-left">Variation</th>
                      <th className="py-3 px-4 text-left">SKU</th>
                      <th className="py-3 px-4 text-left">Price ($)</th>
                      <th className="py-3 px-4 text-left">Stock</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variations.map((variation) => (
                      <tr
                        key={variation.id}
                        className="variation-row border-b border-gray-800 transition-all duration-300 hover:bg-gray-800/30"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div
                              className="w-8 h-8 rounded mr-3 border border-gray-600"
                              style={{
                                backgroundColor: getVariationColor(variation),
                              }}
                            />
                            <div className="min-w-0">
                              <p className="font-medium text-white text-sm">
                                {Object.entries(variation.attributes).map(
                                  ([key, value]) => (
                                    <span
                                      key={key}
                                      className="mr-2 inline-block"
                                    >
                                      <span className="text-gray-400">
                                        {key}:{" "}
                                      </span>
                                      <span className="text-white">
                                        {value}
                                      </span>
                                    </span>
                                  )
                                )}
                              </p>
                              {variation.image && (
                                <span className="text-xs text-green-400 flex items-center mt-1">
                                  <FaImage className="mr-1" /> Has Image
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <input
                            type="text"
                            value={variation.sku}
                            onChange={(e) =>
                              handleVariationChange(
                                variation.id,
                                "sku",
                                e.target.value
                              )
                            }
                            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 w-28 focus:outline-none focus:ring-1 focus:ring-rose-gold text-sm"
                            placeholder="SKU"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                              $
                            </span>
                            <input
                              type="number"
                              value={variation.price}
                              onChange={(e) =>
                                handleVariationChange(
                                  variation.id,
                                  "price",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              step="0.01"
                              min="0"
                              className="bg-gray-800 border border-gray-700 rounded-lg pl-7 pr-3 py-1.5 w-24 focus:outline-none focus:ring-1 focus:ring-rose-gold text-sm"
                              placeholder="0.00"
                            />
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <input
                            type="number"
                            value={variation.stock}
                            onChange={(e) =>
                              handleVariationChange(
                                variation.id,
                                "stock",
                                parseInt(e.target.value) || 0
                              )
                            }
                            min="0"
                            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 w-20 focus:outline-none focus:ring-1 focus:ring-rose-gold text-sm"
                            placeholder="0"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => removeVariation(variation.id)}
                            className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-400/10 transition-colors"
                            title="Remove variation"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                  value={productData.title}
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
                  value={productData.seoDescription}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-32 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                  placeholder="Write here short description"
                />
              </div>

              {/* Rich Text Editor Placeholder */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Bottom Content
                </label>
                <textarea
                  name="bottomContent"
                  value={productData.bottomContent}
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
                  value={productData.schemaMarkup}
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
                  value={productData.canonicalUrl}
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
                  value={productData.focusKeywords}
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

        {/* Right Column - Media & Organization */}
        <div className="space-y-6">
          {/* Product Image */}
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-white mb-4">Product Image</h2>
            <div className="image-upload-area rounded-xl p-8 text-center cursor-pointer border-2 border-dashed border-gray-700 hover:border-rose-gold transition-colors">
              {mainImagePreview ? (
                <div className="mb-4">
                  <Image
                    height={128}
                    width={128}
                    src={mainImagePreview}
                    alt="Product main preview"
                    className="w-32 h-32 object-cover rounded-xl mx-auto border-2 border-gray-600"
                  />
                  <button
                    onClick={() => {
                      setMainImagePreview(null);
                      setMainImageFile(null);
                    }}
                    className="text-red-400 hover:text-red-300 text-sm mt-2 flex items-center justify-center mx-auto"
                  >
                    <FaTrash className="mr-1" /> Remove Image
                  </button>
                </div>
              ) : (
                <>
                  <FaCloudUploadAlt className="text-3xl text-rose-gold mb-3 mx-auto" />
                  <p className="text-gray-400 mb-2">
                    Drag & drop main product image here
                  </p>
                  <p className="text-sm text-gray-500">or</p>
                </>
              )}
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "mainImage")}
                  className="hidden"
                />
                <div className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl mt-3 font-medium transition-all duration-300 inline-block">
                  Browse Files
                </div>
              </label>
            </div>
          </div>

          {/* Product Gallery Images */}
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <FaImages className="mr-2" /> Product Gallery
            </h3>
            <div className="image-upload-area rounded-xl p-6 text-center cursor-pointer mb-4 border-2 border-dashed border-gray-700 hover:border-gray-600 transition-colors">
              <FaImages className="text-2xl text-rose-gold mb-2 mx-auto" />
              <p className="text-gray-400 mb-2">Add product gallery images</p>
              <p className="text-sm text-gray-500">or</p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e, "galleryImages")}
                  className="hidden"
                />
                <div className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl mt-2 font-medium transition-all duration-300 inline-block">
                  Browse Files
                </div>
              </label>
            </div>

            {/* Gallery Preview */}
            {galleryImagesPreview.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-400">
                    Gallery Images ({galleryImagesPreview.length}):
                  </p>
                  <button
                    onClick={() => {
                      setGalleryImagesPreview([]);
                      setGalleryImageFiles([]);
                    }}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Clear All
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {galleryImagesPreview.map((image, index) => (
                    <div key={index} className="relative group">
                      <Image
                        height={100}
                        width={100}
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-700 group-hover:border-rose-gold transition-colors"
                      />
                      <button
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-2 text-center">
              Add multiple images to showcase your product from different angles
            </p>
          </div>

          {/* Organization */}
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-white mb-4">Organization</h2>
            <div className="space-y-4">
              {/* Product Categories - Enhanced */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Product categories
                </label>

                {/* Category Tabs */}
                <div className="flex border-b border-gray-700 mb-4">
                  <button
                    onClick={() => setCategoryTab("all")}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      categoryTab === "all"
                        ? "text-white border-b-2 border-rose-gold"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    All categories
                  </button>
                  <button
                    onClick={() => setCategoryTab("mostUsed")}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      categoryTab === "mostUsed"
                        ? "text-white border-b-2 border-rose-gold"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Most Used
                  </button>
                </div>

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
                  {getCategory?.categories
                    ?.filter((category) => {
                      if (!categorySearch) return true;
                      return category?.name
                        .toLowerCase()
                        .includes(categorySearch.toLowerCase());
                    })
                    .map((category) => (
                      <label
                        key={category._id}
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
                                prev.filter((c) => c.name !== category.name)
                              );
                            }
                          }}
                          className="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500 cursor-pointer"
                        />
                        <span className="ml-3 text-sm text-gray-300">
                          {category.name}
                        </span>
                      </label>
                    ))}

                  {/* Most Used Categories (if tab selected) */}
                  {categoryTab === "mostUsed" && categories.length > 0 && (
                    <>
                      <div className="text-xs text-gray-500 mt-4 mb-2 px-2">
                        Frequently used:
                      </div>
                      {categories.map((category) => (
                        <label
                          key={category}
                          className="flex items-center p-2 hover:bg-gray-800/50 rounded-lg cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCategories((prev) => [
                                  ...prev,
                                  category,
                                ]);
                              } else {
                                setSelectedCategories((prev) =>
                                  prev.filter((c) => c !== category)
                                );
                              }
                            }}
                            className="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500 cursor-pointer"
                          />
                          <span className="ml-3 text-sm text-gray-300">
                            {category}
                          </span>
                        </label>
                      ))}
                    </>
                  )}
                </div>

                {/* Selected Categories Badges */}
                {selectedCategories.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-400 mb-2">
                      Selected ({selectedCategories.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategories.map((category) => (
                        <span
                          key={category}
                          className="px-3 py-1 rounded-full text-xs flex items-center bg-gray-800 text-gray-300"
                        >
                          {category}
                          <button
                            onClick={() =>
                              setSelectedCategories((prev) =>
                                prev.filter((c) => c !== category)
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
                    <div className="space-y-2">
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
                  value={productData.brand}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                >
                  <option value="">Select Brand</option>
                  {allBrands?.allBrands?.map((brand) => (
                    <option key={brand._id} value={brand.name}>
                      {brand.name}
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
                  value={productData.screenSolution}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                >
                  <option value="">Select Screen Solutions</option>
                  {allScreenSolution?.allScreenSolution?.map((solution) => (
                    <option key={solution._id} value={solution.name}>
                      {solution.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags Input with Search and Suggestions */}
              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 flex items-center">
                  <FaTag className="mr-2" /> Tags
                </label>

                {/* Tags Input with Search */}
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
                      className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
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
                      {selectedTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 rounded-lg text-sm flex items-center bg-linear-to-r from-gray-800 to-gray-900 text-gray-300 border border-gray-700"
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
                    {displayedTags?.map((tag) => (
                      <button
                        key={tag._id}
                        onClick={() => {
                          if (!selectedTags.includes(tag.name)) {
                            addTag(tag.name);
                          }
                        }}
                        disabled={selectedTags.includes(tag.name)}
                        className={`px-3 py-1 rounded-full text-xs transition-all duration-300 ${
                          selectedTags.includes(tag.name.toLowerCase())
                            ? "bg-rose-gold text-white cursor-default"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                        }`}
                      >
                        {tag.name.toLowerCase()}
                        {selectedTags.includes(tag.name) && (
                          <FaCheck className="inline ml-1" />
                        )}
                      </button>
                    ))}

                    {/* + more button */}
                    {!showAllTags && allTags?.totalTags > 5 && (
                      <button
                        onClick={() => setShowAllTags(true)}
                        className="text-xs text-gray-500 underline hover:text-white"
                      >
                        + {allTags?.totalTags - 5} more
                      </button>
                    )}

                    {/* Show Less button */}
                    {showAllTags && allTags?.totalTags > 5 && (
                      <button
                        onClick={() => setShowAllTags(false)}
                        className="text-xs text-gray-500 underline hover:text-white"
                      >
                        Show Less
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <FaCheckCircle className="mr-2" /> Status
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Visibility
                </label>
                <select
                  name="visibility"
                  value={productData.visibility}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
              <div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={productData.isActive}
                    onChange={handleInputChange}
                    className="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500 cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-400">
                    Active product
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Variation Images */}
          {variations.length > 0 && (
            <div className="glassmorphism p-6 rounded-2xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <FaImage className="mr-2" /> Variation Images (
                  {variations.length})
                </h2>
                <div className="text-sm text-gray-400">
                  {variations.filter((v) => v.image).length} of{" "}
                  {variations.length} have images
                </div>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {variations.map((variation) => (
                  <div
                    key={variation.id}
                    className="flex items-center justify-between p-3 border border-gray-700 rounded-xl hover:border-rose-gold transition-colors group"
                  >
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="relative mr-3">
                        {variation.image ? (
                          <div className="relative">
                            <img
                              src={variation.image}
                              alt="Variation"
                              className="w-12 h-12 rounded-lg object-cover border border-gray-600"
                            />
                            <button
                              onClick={() => {
                                setVariations((prev) =>
                                  prev.map((v) =>
                                    v.id === variation.id
                                      ? { ...v, image: null }
                                      : v
                                  )
                                );
                                // Variation image file-ও রিমুভ করুন
                                setVariationImageFiles((prev) => {
                                  const newFiles = { ...prev };
                                  delete newFiles[variation.id];
                                  return newFiles;
                                });
                              }}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove image"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center border border-gray-600 group-hover:border-rose-gold transition-colors"
                            style={{
                              backgroundColor: getVariationColor(variation),
                            }}
                            title="No image set"
                          >
                            <FaImage className="text-gray-400 text-lg" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center mb-1">
                          <p className="text-sm text-white truncate font-medium">
                            {Object.entries(variation.attributes).map(
                              ([key, value]) => (
                                <span key={key} className="mr-2">
                                  <span className="text-gray-400 text-xs">
                                    {key}:
                                  </span>
                                  <span className="ml-1">{value}</span>
                                </span>
                              )
                            )}
                          </p>
                          {variation.image && (
                            <span className="ml-2 px-1.5 py-0.5 bg-green-500/20 text-green-300 text-xs rounded-full">
                              Image
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-xs text-gray-400 space-x-3">
                          <span
                            className="truncate"
                            title={`SKU: ${variation.sku || "Not set"}`}
                          >
                            SKU: {variation.sku || "—"}
                          </span>
                          <span>•</span>
                          <span>${variation.price.toFixed(2)}</span>
                          <span>•</span>
                          <span>Stock: {variation.stock}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0 ml-3">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleVariationImageUpload(variation.id, e)
                          }
                          className="hidden"
                        />
                        <span className="text-rose-gold hover:text-pink-600 text-sm flex items-center bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                          <FaImage className="mr-1" />{" "}
                          {variation.image ? "Change" : "Add"}
                        </span>
                      </label>
                      <button
                        onClick={() => {
                          const attrs = Object.entries(variation.attributes)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(", ");
                          navigator.clipboard.writeText(attrs);
                        }}
                        className="text-gray-400 hover:text-gray-300 p-1.5"
                        title="Copy attributes"
                      >
                        <FaTag />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bulk Actions */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">
                    Add images to make variations visually distinct
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.onchange = (e) => {
                          const file = e.target.files[0];
                          if (!file) return;

                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setVariations((prev) =>
                              prev.map((variation) =>
                                !variation.image
                                  ? { ...variation, image: reader.result }
                                  : variation
                              )
                            );
                          };
                          reader.readAsDataURL(file);
                        };
                        input.click();
                      }}
                      className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Add to All Missing
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Clear all variation images?")) {
                          setVariations((prev) =>
                            prev.map((v) => ({ ...v, image: null }))
                          );
                          setVariationImageFiles({});
                        }
                      }}
                      className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Preview */}
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-white mb-4">
              Product Preview
            </h2>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 bg-linear-to-br from-rose-gold to-pink-600 flex items-center justify-center">
                  {mainImagePreview ? (
                    <Image
                      height={48}
                      width={48}
                      src={mainImagePreview}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaBox className="text-white text-xl" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-white truncate">
                    {productData.name || "Variable Product"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedAttributes.length} attributes • {variations.length}{" "}
                    variations
                  </p>
                </div>
              </div>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Attributes:</span>
                  <span className="text-rose-gold">
                    {selectedAttributes.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Variations:</span>
                  <span className="text-purple-400">{variations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">With Images:</span>
                  <span
                    className={`${
                      variations.filter((v) => v.image).length > 0
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {variations.filter((v) => v.image).length} of{" "}
                    {variations.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span
                    className={
                      productData.isActive ? "text-green-400" : "text-red-400"
                    }
                  >
                    {productData.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                {variations.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price Range:</span>
                    <span className="text-white font-medium">
                      ${Math.min(...variations.map((v) => v.price)).toFixed(2)}{" "}
                      - $
                      {Math.max(...variations.map((v) => v.price)).toFixed(2)}
                    </span>
                  </div>
                )}
                {variations.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Stock:</span>
                    <span className="text-white font-medium">
                      {variations.reduce((sum, v) => sum + (v.stock || 0), 0)}{" "}
                      units
                    </span>
                  </div>
                )}
              </div>
              {variations.length > 0 && selectedAttributes.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-400 mb-2">
                    Attribute Summary:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedAttributes.map((attr, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300"
                      >
                        {attr.name}: {attr.values.length}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateVariableProduct;
