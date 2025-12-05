"use client";
import Link from 'next/link';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { 
  FaTimes, 
  FaSave, 
  FaPlus, 
  FaCloudUploadAlt,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaTag,
  FaCheck,
  FaImage
} from 'react-icons/fa';

interface Product {
  id: number;
  name: string;
  sku: string;
  originalPrice: number;
  category: string;
  brand: string;
  thumbnail?: string; // Added thumbnail property
}

interface Category {
  id: number;
  name: string;
  parentId: number | null;
  slug: string;
}

interface ComboComponent {
  id: number;
  productId: number;
  name: string;
  sku: string;
  originalPrice: number;
  customPrice: number;
  quantity: number;
  bgColor: string;
  thumbnail: string; // Added thumbnail
}

interface ComboFormData {
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
  image: File | null;
  title: string;
  seoDescription: string;
  bottomContent: string;
  schemaMarkup: string;
  canonicalUrl: string;
  focusKeywords: string;
  screenSolution: string;
}

// Mock product database with thumbnails
const mockProducts: Product[] = [
  { id: 1, name: 'Matte Liquid Lipstick', sku: 'LIP-001', originalPrice: 24.99, category: 'Lipstick', brand: 'Luxe Beauty', thumbnail: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop' },
  { id: 2, name: 'Pro Foundation', sku: 'FOUND-005', originalPrice: 34.00, category: 'Foundation', brand: 'Luxe Beauty', thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop' },
  { id: 3, name: 'Volume Mascara', sku: 'MASC-003', originalPrice: 18.50, category: 'Mascara', brand: 'Luxe Beauty', thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop' },
  { id: 4, name: 'Eye Shadow Palette', sku: 'EYE-012', originalPrice: 42.50, category: 'Eyeshadow', brand: 'Glamour Cosmetics', thumbnail: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w-400&h=400&fit=crop' },
  { id: 5, name: 'Makeup Brush Set', sku: 'BRUSH-008', originalPrice: 29.99, category: 'Tools', brand: 'Luxe Beauty', thumbnail: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=400&h=400&fit=crop' },
  { id: 6, name: 'Setting Spray', sku: 'SPRAY-004', originalPrice: 22.00, category: 'Setting Spray', brand: 'Glamour Cosmetics', thumbnail: 'https://images.unsplash.com/photo-1522338242990-cd400f5826c4?w=400&h=400&fit=crop' },
];

// Mock categories with hierarchy
const mockCategories: Category[] = [
  { id: 1, name: 'Makeup', parentId: null, slug: 'makeup' },
  { id: 2, name: 'Lipstick', parentId: 1, slug: 'lipstick' },
  { id: 3, name: 'Foundation', parentId: 1, slug: 'foundation' },
  { id: 4, name: 'Eyeshadow', parentId: 1, slug: 'eyeshadow' },
  { id: 5, name: 'Mascara', parentId: 1, slug: 'mascara' },
  { id: 6, name: 'Skincare', parentId: null, slug: 'skincare' },
  { id: 7, name: 'Cleanser', parentId: 6, slug: 'cleanser' },
  { id: 8, name: 'Moisturizer', parentId: 6, slug: 'moisturizer' },
  { id: 9, name: 'Haircare', parentId: null, slug: 'haircare' },
  { id: 10, name: 'Shampoo', parentId: 9, slug: 'shampoo' },
  { id: 11, name: 'Conditioner', parentId: 9, slug: 'conditioner' },
];

// Helper function to generate slug from text
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-'); // Remove double hyphens
};

const calculateComboPrices = (components: ComboComponent[]) => {
  const comboRegularPrice = components.reduce(
    (sum, comp) => sum + (comp.originalPrice * comp.quantity), 
    0
  );
  
  const comboSalePrice = components.reduce(
    (sum, comp) => sum + (comp.customPrice * comp.quantity), 
    0
  );
  
  const discountPercentage = comboRegularPrice > 0 
    ? ((comboRegularPrice - comboSalePrice) / comboRegularPrice) * 100 
    : 0;
  
  return { comboRegularPrice, comboSalePrice, discountPercentage };
};

const getRandomBgColor = () => {
  const colors = [
    'bg-gradient-pink',
    'bg-purple-500/20',
    'bg-blue-500/20',
    'bg-green-500/20',
    'bg-yellow-500/20',
    'bg-red-500/20',
    'bg-indigo-500/20'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Helper to get category hierarchy tree
const getCategoryHierarchy = (categories: Category[]) => {
  const categoryMap = new Map<number, Category>();
  const childrenMap = new Map<number, Category[]>();
  
  // Build maps
  categories.forEach(category => {
    categoryMap.set(category.id, category);
    if (category.parentId !== null) {
      if (!childrenMap.has(category.parentId)) {
        childrenMap.set(category.parentId, []);
      }
      childrenMap.get(category.parentId)!.push(category);
    }
  });
  
  // Build tree
  const buildTree = (parentId: number | null): Category[] => {
    const result: Category[] = [];
    const children = parentId === null 
      ? categories.filter(c => c.parentId === null)
      : childrenMap.get(parentId) || [];
    
    children.forEach(child => {
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

const ComboProductCreationPage = () => {
  const [formData, setFormData] = useState<ComboFormData>({
    name: '',
    description: '',
    components: [], 
    comboRegularPrice: 0,
    comboSalePrice: 0,
    discountPercentage: 0,
    allowIndividualPurchase: true,
    limitedTimeOffer: false,
    slug: '',
    category: '',
    brand: '',
    tags: '',
    visibility: 'Draft',
    isActive: true,
    image: null,
    title: '',
    seoDescription: '',
    bottomContent: '',
    schemaMarkup: '',
    canonicalUrl: '',
    focusKeywords: '',
    screenSolution: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [priceErrors, setPriceErrors] = useState<Record<number, string>>({});
  
  // SEO & Organization related states
  const [categoryTab, setCategoryTab] = useState<'all' | 'mostUsed'>('all');
  const [categorySearch, setCategorySearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newCategoryParent, setNewCategoryParent] = useState<number | null>(null);
  
  // Tags related states
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const tagsRef = useRef<HTMLDivElement>(null);

  // Categories from mock data
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const categoryHierarchy = useMemo(() => getCategoryHierarchy(categories), [categories]);

  const [mostUsedCategories, setMostUsedCategories] = useState<string[]>([
    'Makeup',
    'Skincare',
    'Haircare'
  ]);

  const [availableTags, setAvailableTags] = useState<string[]>([
    'cosmetics',
    'beauty',
    'makeup',
    'skincare',
    'foundation',
    'lipstick',
    'mascara',
    'eyeshadow',
    'brushes',
    'glam',
    'natural',
    'organic',
    'vegan',
    'cruelty-free',
    'luxury',
    'affordable'
  ]);

  const [popularTags, setPopularTags] = useState<string[]>([
    'cosmetics',
    'beauty',
    'makeup',
    'skincare',
    'vegan',
    'cruelty-free'
  ]);

  const [brands, setBrands] = useState<string[]>([
    'Luxe Beauty',
    'Glamour Cosmetics',
    'Pure Skin',
    'Eco Beauty',
    'Pro Makeup'
  ]);

  const [screenSolutions, setScreenSolutions] = useState<string[]>([
    'Mobile Optimized',
    'Desktop View',
    'Tablet Friendly',
    'Responsive Design',
    'High Resolution'
  ]);

  // Calculate combo prices using useMemo
  const calculatedPrices = useMemo(() => {
    return calculateComboPrices(formData.components);
  }, [formData.components]);

  // Update form data when calculated prices change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      comboRegularPrice: calculatedPrices.comboRegularPrice,
      comboSalePrice: calculatedPrices.comboSalePrice,
      discountPercentage: calculatedPrices.discountPercentage
    }));
  }, [calculatedPrices]);

  // Generate slug when name changes
  useEffect(() => {
    if (formData.name && !formData.slug) {
      const generatedSlug = generateSlug(formData.name);
      setFormData(prev => ({
        ...prev,
        slug: generatedSlug
      }));
    }
  }, [formData.name]);

  // Handle product search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const filtered = mockProducts.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Filter out products already added to the combo
    const addedProductIds = new Set(formData.components.map(comp => comp.productId));
    const availableProducts = filtered.filter(product => !addedProductIds.has(product.id));
    
    setSearchResults(availableProducts);
  }, [searchQuery, formData.components]);

  // Close tag suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tagsRef.current && !tagsRef.current.contains(event.target as Node)) {
        setShowTagSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Generate slug when name field changes
      if (name === 'name') {
        const generatedSlug = generateSlug(value);
        setFormData(prev => ({
          ...prev,
          slug: generatedSlug
        }));
      }
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = generateSlug(e.target.value);
    setFormData(prev => ({
      ...prev,
      slug
    }));
  };

  const handleComponentChange = (id: number, field: keyof ComboComponent, value: string | number) => {
    setFormData(prev => {
      const updatedComponents = prev.components.map(comp =>
        comp.id === id ? { ...comp, [field]: value } : comp
      );
      
      // Validate custom price
      if (field === 'customPrice') {
        const component = updatedComponents.find(c => c.id === id);
        if (component && value > component.originalPrice) {
          setPriceErrors(prev => ({
            ...prev,
            [id]: `Custom price must be lower than original price (৳${component.originalPrice.toFixed(2)})`
          }));
        } else {
          setPriceErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[id];
            return newErrors;
          });
        }
      }
      
      return {
        ...prev,
        components: updatedComponents
      };
    });
  };

  const handleAddProduct = (product: Product) => {
    const newComponent: ComboComponent = {
      id: formData.components.length > 0 
        ? Math.max(...formData.components.map(c => c.id)) + 1 
        : 1,
      productId: product.id,
      name: product.name,
      sku: product.sku,
      originalPrice: product.originalPrice,
      customPrice: product.originalPrice, // Start with original price, user can adjust down
      quantity: 1,
      bgColor: getRandomBgColor(),
      thumbnail: product.thumbnail || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=random&color=fff&size=200` // Fallback to avatar if no thumbnail
    };
    
    setFormData(prev => ({
      ...prev,
      components: [...prev.components, newComponent]
    }));
    
    // Clear search
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleRemoveComponent = (id: number) => {
    setFormData(prev => ({
      ...prev,
      components: prev.components.filter(comp => comp.id !== id)
    }));
    
    // Clear any error for this component
    setPriceErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  // Category functions
  const handleAddNewCategory = () => {
    if (newCategory.trim()) {
      const trimmedName = newCategory.trim();
      const newId = Math.max(...categories.map(c => c.id)) + 1;
      const newSlug = generateSlug(trimmedName);
      
      const newCategoryItem: Category = {
        id: newId,
        name: trimmedName,
        parentId: newCategoryParent,
        slug: newSlug
      };
      
      setCategories(prev => [...prev, newCategoryItem]);
      setSelectedCategories(prev => [...prev, trimmedName]);
      setNewCategory('');
      setNewCategoryParent(null);
      setShowAddCategory(false);
    }
  };

  // Get parent categories for dropdown
  const parentCategories = useMemo(() => {
    return categories.filter(cat => cat.parentId === null);
  }, [categories]);

  // Get display name with hierarchy
  const getCategoryDisplayName = useCallback((category: Category): string => {
    if (category.parentId === null) {
      return category.name;
    }
    const parent = categories.find(c => c.id === category.parentId);
    return parent ? `${parent.name} → ${category.name}` : category.name;
  }, [categories]);

  // Filter categories for display with search
  const filteredCategories = useMemo(() => {
    return categories.filter(category => {
      if (!categorySearch) return true;
      const displayName = getCategoryDisplayName(category);
      return displayName.toLowerCase().includes(categorySearch.toLowerCase()) ||
             category.name.toLowerCase().includes(categorySearch.toLowerCase());
    });
  }, [categories, categorySearch, getCategoryDisplayName]);

  // Tag functions
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      setSelectedTags(prev => [...prev, trimmedTag]);
      
      // Add to available tags if not already there
      if (!availableTags.includes(trimmedTag)) {
        setAvailableTags(prev => [...prev, trimmedTag]);
      }
    }
    setTagInput('');
    setShowTagSuggestions(false);
  };

  const removeTag = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  const getTagUsageCount = (tag: string): number => {
    // Mock usage count - in a real app, this would come from your backend
    const mockCounts: Record<string, number> = {
      'cosmetics': 42,
      'beauty': 38,
      'makeup': 56,
      'skincare': 47,
      'foundation': 23,
      'lipstick': 31,
      'mascara': 18,
      'eyeshadow': 27,
      'brushes': 15,
      'glam': 12,
      'natural': 34,
      'organic': 29,
      'vegan': 41,
      'cruelty-free': 36,
      'luxury': 19,
      'affordable': 25
    };
    return mockCounts[tag] || Math.floor(Math.random() * 50) + 1;
  };

  // Filter tag suggestions based on input
  const tagSuggestions = availableTags.filter(tag => 
    tag.toLowerCase().includes(tagInput.toLowerCase()) && 
    !selectedTags.includes(tag)
  ).slice(0, 10); // Limit to 10 suggestions

  const handleSaveCombo = () => {
    // Check for required fields
    if (!formData.name.trim()) {
      alert('Please enter a combo name.');
      return;
    }
    
    if (formData.components.length === 0) {
      alert('Please add at least one product to the combo.');
      return;
    }
    
    // Check for price errors before saving
    const hasErrors = Object.keys(priceErrors).length > 0;
    if (hasErrors) {
      alert('Please fix price errors before saving.');
      return;
    }
    
    // Update tags in formData
    const updatedFormData = {
      ...formData,
      tags: selectedTags.join(', '),
      category: selectedCategories.join(', ')
    };
    
    console.log('Saving combo:', updatedFormData);
    // Add your save logic here
    alert('Combo saved successfully!');
  };

  return (
    <div className="p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Create Combo Product</h1>
          <p className="text-gray-400">Create a bundle of multiple products sold together</p>
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
            <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Combo Name *</label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">Slug</label>
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
                <p className="text-xs text-gray-500 mt-1">Slug will be auto-generated from the name</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
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
              <h2 className="text-xl font-bold text-white">Combo Components *</h2>
              <div className="relative">
                <button 
                  onClick={() => setShowSearchResults(!showSearchResults)}
                  className="bg-rose-gold hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center"
                >
                  <FaPlus className="mr-2" /> Add Product
                  {showSearchResults ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
                </button>
                
                {/* Search Dropdown */}
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
                          {searchResults.map(product => (
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
                                      <p className="font-medium text-white">{product.name}</p>
                                      <p className="text-sm text-gray-400">SKU: {product.sku} | ৳{product.originalPrice.toFixed(2)}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm text-gray-400">{product.category}</p>
                                      <p className="text-xs text-gray-500">{product.brand}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : searchQuery.trim() !== '' ? (
                        <p className="mt-3 text-gray-400 text-center py-4">No products found</p>
                      ) : (
                        <p className="mt-3 text-gray-400 text-center py-4">Start typing to search products</p>
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
                <p className="text-sm text-gray-500">Click "Add Product" to search and add products to your combo</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.components.map((component) => (
                  <div key={component.id} className="combo-item p-4 rounded-xl bg-gray-800/50">
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
                            <div className={`w-full h-full ${component.bgColor} flex items-center justify-center text-white`}>
                              <span className="text-lg font-bold">{component.name.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">{component.name}</p>
                          <p className="text-sm text-gray-400">SKU: {component.sku}</p>
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
                        <label className="block text-sm font-medium text-gray-400 mb-1">Original Price</label>
                        <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2">
                          <span className="text-white">৳{component.originalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Custom Sale Price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">৳</span>
                          <input 
                            type="number" 
                            value={component.customPrice}
                            onChange={(e) => handleComponentChange(component.id, 'customPrice', parseFloat(e.target.value) || 0)}
                            step="0.01"
                            min="0"
                            max={component.originalPrice}
                            className={`bg-gray-900 border ${priceErrors[component.id] ? 'border-red-500' : 'border-gray-700'} rounded-lg pl-8 pr-3 py-2 w-full focus:outline-none focus:ring-1 ${priceErrors[component.id] ? 'focus:ring-red-500' : 'focus:ring-rose-gold'}`}
                            placeholder="0.00"
                          />
                        </div>
                        {priceErrors[component.id] && (
                          <p className="text-red-400 text-xs mt-1">{priceErrors[component.id]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Quantity</label>
                        <input 
                          type="number" 
                          value={component.quantity}
                          onChange={(e) => handleComponentChange(component.id, 'quantity', parseInt(e.target.value) || 1)}
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
                            ৳{(component.originalPrice * component.quantity).toFixed(2)}
                          </span>
                          <span className="text-white font-medium">
                            ৳{(component.customPrice * component.quantity).toFixed(2)}
                          </span>
                          {component.customPrice < component.originalPrice && (
                            <span className="text-green-400 ml-2">
                              ({(((component.originalPrice - component.customPrice) / component.originalPrice) * 100).toFixed(0)}% off)
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
            <h2 className="text-xl font-bold text-white mb-4">Pricing Summary</h2>
            {formData.components.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-400">Add products to see pricing details</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                  <span className="text-gray-400">Combo Regular Price:</span>
                  <span className="text-white font-medium text-lg">৳{formData.comboRegularPrice.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                  <span className="text-gray-400">Combo Sale Price:</span>
                  <span className="text-rose-gold font-bold text-xl">৳{formData.comboSalePrice.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Discount:</span>
                  <div className="text-right">
                    <span className="text-green-400 font-medium">
                      {formData.discountPercentage.toFixed(1)}% off
                    </span>
                    <p className="text-sm text-green-400">
                      Save ৳{(formData.comboRegularPrice - formData.comboSalePrice).toFixed(2)}
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
                <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                  name="seoDescription"
                  value={formData.seoDescription}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-32 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                  placeholder="Write here short description"
                />
              </div>

              {/* Rich Text Editor Placeholder */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Bottom Content</label>
                <textarea
                  name="bottomContent"
                  value={formData.bottomContent}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-40 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                  placeholder="Write here SEO content"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Schema Markup</label>
                <textarea
                  name="schemaMarkup"
                  value={formData.schemaMarkup}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full h-40 focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                  placeholder="Write here Schema Markup"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Canonical URL</label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">Focus Keywords</label>
                <input 
                  type="text"
                  name="focusKeywords"
                  value={formData.focusKeywords}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                  placeholder="foundation, makeup, shade, finish, cosmetics"
                />
                <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Media & Settings */}
        <div className="space-y-6">
          {/* Combo Image */}
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-white mb-4">Combo Image</h2>
            <label className="block image-upload-area rounded-xl p-8 text-center cursor-pointer border-2 border-dashed border-gray-700 hover:border-rose-gold transition-colors">
              <input 
                type="file" 
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
              />
              <FaCloudUploadAlt className="text-3xl text-gray-500 mb-3 mx-auto" />
              <p className="text-gray-400 mb-2">Drag & drop combo image here</p>
              <p className="text-sm text-gray-500">or</p>
              <span className="inline-block bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl mt-3 font-medium transition-all duration-300">
                Browse Files
              </span>
            </label>
          </div>

          {/* Organization */}
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-white mb-4">Organization</h2>
            <div className="space-y-4">
              {/* Product Categories - Enhanced */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">Product categories</label>
                
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
                  {filteredCategories
                    .map((category) => (
                      <label 
                        key={category.id} 
                        className="flex items-center p-2 hover:bg-gray-800/50 rounded-lg cursor-pointer transition-colors"
                      >
                        <input 
                          type="checkbox"
                          checked={selectedCategories.includes(category.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategories(prev => [...prev, category.name]);
                            } else {
                              setSelectedCategories(prev => prev.filter(c => c !== category.name));
                            }
                          }}
                          className="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500 cursor-pointer"
                        />
                        <span className="ml-3 text-sm text-gray-300">
                          {getCategoryDisplayName(category)}
                        </span>
                      </label>
                    ))
                  }
                  
                  {/* Most Used Categories (if tab selected) */}
                  {categoryTab === 'mostUsed' && mostUsedCategories.length > 0 && (
                    <>
                      <div className="text-xs text-gray-500 mt-4 mb-2 px-2">Frequently used:</div>
                      {mostUsedCategories.map((categoryName) => {
                        const category = categories.find(c => c.name === categoryName);
                        return category ? (
                          <label 
                            key={category.id} 
                            className="flex items-center p-2 hover:bg-gray-800/50 rounded-lg cursor-pointer transition-colors"
                          >
                            <input 
                              type="checkbox"
                              checked={selectedCategories.includes(category.name)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCategories(prev => [...prev, category.name]);
                                } else {
                                  setSelectedCategories(prev => prev.filter(c => c !== category.name));
                                }
                              }}
                              className="rounded bg-gray-700 border-gray-600 text-rose-gold focus:ring-rose-500 cursor-pointer"
                            />
                            <span className="ml-3 text-sm text-gray-300">
                              {getCategoryDisplayName(category)}
                            </span>
                          </label>
                        ) : null;
                      })}
                    </>
                  )}
                </div>

                {/* Selected Categories Badges */}
                {selectedCategories.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-400 mb-2">Selected ({selectedCategories.length}):</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategories.map((categoryName) => (
                        <span 
                          key={categoryName} 
                          className="px-3 py-1 rounded-full text-xs flex items-center bg-gray-800 text-gray-300"
                        >
                          {categoryName}
                          <button 
                            onClick={() => setSelectedCategories(prev => prev.filter(c => c !== categoryName))}
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
                          if (e.key === 'Enter' && newCategory.trim()) {
                            handleAddNewCategory();
                          }
                        }}
                      />
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                          Parent Category (Optional)
                        </label>
                        <select
                          value={newCategoryParent || ''}
                          onChange={(e) => setNewCategoryParent(e.target.value ? parseInt(e.target.value) : null)}
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
                            setNewCategory('');
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
                <label className="block text-sm font-medium text-gray-400 mb-2">Brand</label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Screen Solutions</label>
                <select
                  name="screenSolution"
                  value={formData.screenSolution}
                  onChange={handleInputChange}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                >
                  <option value="">Select Screen Solutions</option>
                  {screenSolutions.map((solution) => (
                    <option key={solution} value={solution}>{solution}</option>
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
                        if (e.key === 'Enter' && tagInput.trim()) {
                          e.preventDefault();
                          addTag(tagInput.trim());
                        }
                        if (e.key === ',' && tagInput.trim()) {
                          e.preventDefault();
                          addTag(tagInput.trim().replace(',', ''));
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
                          <span className="text-sm font-medium text-white">Existing Tags</span>
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
                          if (window.confirm('Remove all tags?')) {
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
                
                {/* Popular Tags */}
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
                        className={`px-3 py-1 rounded-full text-xs transition-all duration-300 ${selectedTags.includes(tag) 
                          ? 'bg-rose-gold text-white cursor-default' 
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
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
                <label className="block text-sm font-medium text-gray-400 mb-2">Visibility</label>
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
                  <span className="ml-2 text-sm text-gray-400">Active combo</span>
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