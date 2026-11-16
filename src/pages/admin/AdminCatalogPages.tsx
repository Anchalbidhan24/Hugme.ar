import React, { useState } from 'react';
import { Edit2, Minus, Plus, Search, Trash2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { IMG } from '../../data/mockCatalog';
import { Category, Product } from '../../types/store';
import { SafeImage } from '../../components/SafeImage';

export const AdminProductsPage: React.FC = () => {
  const { products, categories, deleteProduct, navigate, formatPrice } = useStore();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');

  const filtered = products.filter((p) => {
    const matchCat = catFilter === 'All' || p.category === catFilter;
    const matchQ =
      !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#765B55]">
            Product Management
          </h1>
          <p className="font-body text-sm text-[#765B55]/75">
            Add, edit, or remove plushies in your HUGME.AR catalog.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('admin-product-form')}
          className="px-4 py-2.5 rounded-xl bg-[#C98F9D] hover:bg-[#b87b8a] text-white font-ui text-xs font-medium cursor-pointer"
        >
          + Add New Product
        </button>
      </div>

      <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="w-4 h-4 text-[#C98F9D] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or ID..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs"
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs font-ui text-[#765B55]"
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#765B55]/10 bg-[#FFF8EF]/70 text-[11px] font-ui uppercase text-[#765B55]/70">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4 text-right">Stock</th>
                <th className="py-3 px-4">Flags</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#765B55]/8 text-xs font-body">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[#FFF8EF]/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <SafeImage
                        src={p.images[0]}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div>
                        <p className="font-ui font-medium text-[#765B55]">{p.name}</p>
                        <p className="text-[11px] text-[#765B55]/60">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{p.category}</td>
                  <td className="py-3 px-4 text-right font-ui font-medium tabular-nums">
                    {formatPrice(p.price)}
                  </td>
                  <td className="py-3 px-4 text-right font-ui tabular-nums">
                    {p.stock} ({p.stockStatus})
                  </td>
                  <td className="py-3 px-4 font-ui text-[11px] text-[#765B55]/75">
                    {[p.isBestseller && 'Bestseller', p.isNewArrival && 'New']
                      .filter(Boolean)
                      .join(' · ') || 'Standard'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => navigate('admin-product-form', { productId: p.id })}
                        className="p-1.5 rounded-lg bg-[#FFF8EF] text-[#765B55] hover:text-[#C98F9D] cursor-pointer"
                        aria-label={`Edit ${p.name}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProduct(p.id)}
                        className="p-1.5 rounded-lg bg-[#FFF8EF] text-[#765B55]/70 hover:text-[#C98F9D] cursor-pointer"
                        aria-label={`Delete ${p.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const AdminProductFormPage: React.FC = () => {
  const { products, categories, routeParams, saveProduct, navigate } = useStore();
  const existing = products.find((p) => p.id === routeParams.productId);

  const [name, setName] = useState(existing?.name || '');
  const [category, setCategory] = useState(existing?.category || categories[0]?.slug || 'Teddy Bears');
  const [price, setPrice] = useState(existing?.price || 1199);
  const [originalPrice, setOriginalPrice] = useState(existing?.originalPrice || 1499);
  const [stock, setStock] = useState(existing?.stock ?? 20);
  const [shortDesc, setShortDesc] = useState(existing?.shortDescription || '');
  const [fullDesc, setFullDesc] = useState(existing?.fullDescription || '');
  const [material, setMaterial] = useState(
    existing?.material || 'CloudSoft Micro-Plush & Hypoallergenic Fill'
  );
  const [dimensions, setDimensions] = useState(existing?.dimensions || '28 cm × 20 cm × 16 cm');
  const [selectedImage, setSelectedImage] = useState(existing?.images[0] || IMG.teddy);
  const [isNewArrival, setIsNewArrival] = useState(existing?.isNewArrival ?? true);
  const [isBestseller, setIsBestseller] = useState(existing?.isBestseller ?? false);

  const imageChoices = [
    { label: 'Classic Teddy', url: IMG.teddy },
    { label: 'Blush Bunny', url: IMG.bunny },
    { label: 'Capybara', url: IMG.capybara },
    { label: 'Calico Cat', url: IMG.cat },
    { label: 'Corgi Pup', url: IMG.corgi },
    { label: 'Boba & Croissant', url: IMG.food },
    { label: 'Giant Bear', url: IMG.giant },
    { label: 'Lavender Lamb', url: IMG.lamb },
    { label: 'Red Panda', url: IMG.redPanda },
    { label: 'Couple Bears', url: IMG.couple },
    { label: 'Strawberry Frog', url: IMG.frog },
    { label: 'Gift Hamper', url: IMG.giftHamper },
    { label: 'Mini Charms', url: IMG.miniCharm },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const discount =
      originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;
    const stockStatus: Product['stockStatus'] =
      stock === 0 ? 'Out of Stock' : stock <= 10 ? 'Low Stock' : 'In Stock';

    const product: Product = {
      id: existing?.id || `HM-${Math.floor(200 + Math.random() * 799)}`,
      name: name.trim() || 'New HUGME.AR Plushie',
      category,
      shortDescription: shortDesc.trim() || 'Soft plushie companion made for everyday hugs.',
      fullDescription:
        fullDesc.trim() || 'Crafted from cloud-soft plush fleece with gentle embroidered smiles.',
      images: [selectedImage, IMG.hero],
      price: Number(price),
      originalPrice: Number(originalPrice),
      discount,
      rating: existing?.rating || 4.9,
      reviewCount: existing?.reviewCount || 12,
      sizes: existing?.sizes || ['25 cm', '35 cm'],
      defaultSize: existing?.defaultSize || '25 cm',
      material,
      colors: existing?.colors || [
        { name: 'Soft Cream', hex: '#F6E8D7' },
        { name: 'Blush Pink', hex: '#F4DDE3' },
      ],
      defaultColor: existing?.defaultColor || 'Soft Cream',
      stock: Number(stock),
      stockStatus,
      isNewArrival,
      isBestseller,
      careInstructions: existing?.careInstructions || 'Spot clean gently and air dry.',
      dimensions,
    };

    saveProduct(product);
    navigate('admin-products');
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-[#765B55]">
          {existing ? `Edit ${existing.name}` : 'Add New Plushie'}
        </h1>
        <button
          type="button"
          onClick={() => navigate('admin-products')}
          className="font-ui text-xs text-[#C98F9D] hover:underline cursor-pointer"
        >
          ← Back to Products
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-6 sm:p-8 space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-ui text-xs text-[#765B55] mb-1">Product Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm"
            />
          </div>
          <div>
            <label className="block font-ui text-xs text-[#765B55] mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-ui text-xs text-[#765B55] mb-1">Selling Price (INR)</label>
            <input
              type="number"
              required
              min={99}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm tabular-nums"
            />
          </div>
          <div>
            <label className="block font-ui text-xs text-[#765B55] mb-1">Original Price (INR)</label>
            <input
              type="number"
              min={99}
              value={originalPrice}
              onChange={(e) => setOriginalPrice(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm tabular-nums"
            />
          </div>
          <div>
            <label className="block font-ui text-xs text-[#765B55] mb-1">Stock Count</label>
            <input
              type="number"
              min={0}
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm tabular-nums"
            />
          </div>
          <div>
            <label className="block font-ui text-xs text-[#765B55] mb-1">Product Studio Image</label>
            <select
              value={selectedImage}
              onChange={(e) => setSelectedImage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm"
            >
              {imageChoices.map((img) => (
                <option key={img.label} value={img.url}>
                  {img.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-ui text-xs text-[#765B55] mb-1">Short Description</label>
          <input
            type="text"
            required
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm"
          />
        </div>

        <div>
          <label className="block font-ui text-xs text-[#765B55] mb-1">Full Description</label>
          <textarea
            rows={3}
            value={fullDesc}
            onChange={(e) => setFullDesc(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-ui text-xs text-[#765B55] mb-1">Material</label>
            <input
              type="text"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm"
            />
          </div>
          <div>
            <label className="block font-ui text-xs text-[#765B55] mb-1">Dimensions</label>
            <input
              type="text"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6 pt-2">
          <label className="inline-flex items-center gap-2 text-xs font-ui text-[#765B55] cursor-pointer">
            <input
              type="checkbox"
              checked={isNewArrival}
              onChange={(e) => setIsNewArrival(e.target.checked)}
              className="accent-[#C98F9D]"
            />
            <span>Mark as New Arrival</span>
          </label>
          <label className="inline-flex items-center gap-2 text-xs font-ui text-[#765B55] cursor-pointer">
            <input
              type="checkbox"
              checked={isBestseller}
              onChange={(e) => setIsBestseller(e.target.checked)}
              className="accent-[#C98F9D]"
            />
            <span>Mark as Bestseller</span>
          </label>
        </div>

        <div className="pt-2 flex gap-3">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#C98F9D] hover:bg-[#b87b8a] text-white font-ui text-xs font-medium cursor-pointer"
          >
            {existing ? 'Update Product' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('admin-products')}
            className="px-6 py-3 rounded-xl border border-[#765B55]/15 text-[#765B55] font-ui text-xs font-medium cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export const AdminCategoriesPage: React.FC = () => {
  const { categories, products, saveCategory, deleteCategory } = useStore();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const cat: Category = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      slug: name.trim(),
      description: desc.trim() || 'Soft curated plushie collection.',
      image: IMG.teddy,
      accentColor: '#F4DDE3',
      featured: true,
    };
    saveCategory(cat);
    setName('');
    setDesc('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#765B55]">
          Category Management
        </h1>
        <p className="font-body text-sm text-[#765B55]/75">
          Organize storefront shelves and plushie collections.
        </p>
      </div>

      <form
        onSubmit={handleAdd}
        className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-5 flex flex-col sm:flex-row gap-3"
      >
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs flex-1"
        />
        <input
          type="text"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Short description"
          className="px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs flex-1"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#C98F9D] text-white font-ui text-xs font-medium cursor-pointer shrink-0"
        >
          + Add Category
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-4 flex items-center gap-3.5"
          >
            <SafeImage
              src={cat.image}
              alt={cat.name}
              className="w-16 h-16 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-lg font-semibold text-[#765B55] truncate">
                {cat.name}
              </h3>
              <p className="font-body text-xs text-[#765B55]/70 line-clamp-1">{cat.description}</p>
              <p className="font-ui text-[11px] text-[#C98F9D] mt-1 tabular-nums">
                {products.filter((p) => p.category === cat.slug).length} products
              </p>
            </div>
            <button
              type="button"
              onClick={() => deleteCategory(cat.id)}
              className="p-2 text-[#765B55]/50 hover:text-[#C98F9D] cursor-pointer"
              aria-label={`Delete ${cat.name}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminInventoryPage: React.FC = () => {
  const { products, updateProductStock } = useStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#765B55]">
          Inventory Management
        </h1>
        <p className="font-body text-sm text-[#765B55]/75">
          Adjust inventory counts directly; updates reflect across the storefront immediately.
        </p>
      </div>

      <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#765B55]/10 bg-[#FFF8EF]/70 text-[11px] font-ui uppercase text-[#765B55]/70">
                <th className="py-3 px-4">Plushie</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Stock Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#765B55]/8 text-xs font-body">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="py-3 px-4 font-ui font-medium text-[#765B55]">{p.name}</td>
                  <td className="py-3 px-4">{p.category}</td>
                  <td className="py-3 px-4 font-ui">
                    <span
                      className={
                        p.stock === 0
                          ? 'text-[#DC2626] font-medium'
                          : p.stock <= 10
                            ? 'text-[#C98F9D] font-medium'
                            : 'text-[#765B55]'
                      }
                    >
                      {p.stockStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateProductStock(p.id, p.stock - 1)}
                        className="p-1.5 rounded-lg bg-[#FFF8EF] border border-[#765B55]/15 cursor-pointer"
                        aria-label="Decrease stock"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-10 text-center font-ui font-semibold tabular-nums">
                        {p.stock}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateProductStock(p.id, p.stock + 1)}
                        className="p-1.5 rounded-lg bg-[#FFF8EF] border border-[#765B55]/15 cursor-pointer"
                        aria-label="Increase stock"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
