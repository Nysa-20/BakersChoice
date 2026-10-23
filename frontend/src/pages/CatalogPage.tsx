import { useState, useEffect } from 'react';
import { client } from '../api/client';
import type { components } from '../api/schema';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../store/cartStore';
import { BAKERY_IMAGES } from '../constants/images';
import { ShoppingBag, Search, Filter, Sparkles } from 'lucide-react';

type Item = components['schemas']['Item'];

const CATALOG_ITEMS: Item[] = [
  {
    id: "c1-croissant",
    name: "Classic Butter Croissant",
    description: "Flaky, 27-layered French viennoiserie made with 84% cultured butter. Golden and crisp.",
    price: 180.00,
    stock_quantity: 40,
    low_stock_threshold: 10,
    status: "active",
    image_urls: [BAKERY_IMAGES.items.croissant],
    tags: ["French", "Breakfast", "Cultured Butter"]
  },
  {
    id: "c2-sourdough",
    name: "Country Sourdough Loaf",
    description: "36-hour slow cold fermentation with organic Sharbati stone-milled wheat and natural wild yeast.",
    price: 280.00,
    stock_quantity: 15,
    low_stock_threshold: 10,
    status: "active",
    image_urls: [BAKERY_IMAGES.items.sourdough],
    tags: ["100% Eggless", "Vegan", "Organic", "Sourdough"]
  },
  {
    id: "c3-truffle-cake",
    name: "Belgian Dark Truffle Cake (Eggless)",
    description: "Four layers of rich cocoa sponge enrobed in dark chocolate mirror glaze with roasted cocoa nibs. 100% veg.",
    price: 950.00,
    stock_quantity: 5,
    low_stock_threshold: 5,
    status: "active",
    image_urls: [BAKERY_IMAGES.items.chocolateCake],
    tags: ["100% Eggless", "Celebration", "Chocolate"]
  },
  {
    id: "c4-mawa-cake",
    name: "Cardamom & Saffron Mawa Cake",
    description: "Heritage Irani cafe tea cake enriched with slow-cooked mawa, green cardamom, and California pistachios.",
    price: 320.00,
    stock_quantity: 20,
    low_stock_threshold: 10,
    status: "active",
    image_urls: [BAKERY_IMAGES.items.almondCroissant],
    tags: ["Heritage", "Tea Cake", "Mawa"]
  },
  {
    id: "c5-paneer-puff",
    name: "Smoked Paneer Tikka Puff",
    description: "Crisp multi-layered pastry pouch stuffed with tandoori-spiced malai paneer, bell peppers, and mint chutney.",
    price: 140.00,
    stock_quantity: 18,
    low_stock_threshold: 10,
    status: "active",
    image_urls: [BAKERY_IMAGES.items.berryTart],
    tags: ["100% Eggless", "Hot Savory", "Snack"]
  },
  {
    id: "c6-rasmalai-gateau",
    name: "Rasmalai Tres Leches Gateau",
    description: "Cardamom-soaked sponge cake steeped in rich kesar rabdi, topped with fresh malai rosettes and silver vark.",
    price: 1100.00,
    stock_quantity: 4,
    low_stock_threshold: 5,
    status: "active",
    image_urls: [BAKERY_IMAGES.items.cinnamonRoll],
    tags: ["100% Eggless", "Fusion", "Celebration"]
  },
  {
    id: "c7-sourdough-pav",
    name: "Brioche Sourdough Pav (Pack of 6)",
    description: "Pillowy soft artisanal pav baked with cultured white butter and slow sourdough starter. Ideal for bun maska.",
    price: 120.00,
    stock_quantity: 30,
    low_stock_threshold: 10,
    status: "active",
    image_urls: [BAKERY_IMAGES.items.baguette],
    tags: ["100% Eggless", "Daily Pav", "Cultured Butter"]
  },
  {
    id: "c8-nankhatai",
    name: "Almond Nankhatai Shortbread Tin",
    description: "Melt-in-your-mouth spiced shortbread baked with pure desi ghee, crushed almonds, and nutmeg.",
    price: 450.00,
    stock_quantity: 0, // Demonstrates out-of-stock badge
    low_stock_threshold: 10,
    status: "out_of_stock",
    image_urls: [BAKERY_IMAGES.items.macarons],
    tags: ["100% Eggless", "Desi Ghee", "Festive Gift"]
  }
];

export default function CatalogPage() {
  const [items, setItems] = useState<Item[]>(CATALOG_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { addItem } = useCartStore();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await client.GET('/api/products/');
        if (data && data.length > 0) {
          setItems(data);
        }
      } catch (e) {
        // Fallback already in place
      }
    }
    fetchProducts();
  }, []);

  const categories = [
    "All", 
    "Celebration Cakes", 
    "Artisanal Breads & Pav", 
    "Puffs & Viennoiserie", 
    "Tea Cakes & Mithai Fusion"
  ];
  const tags = ["100% Eggless", "Organic", "Vegan", "Desi Ghee", "Celebration"];

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? item.tags?.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-cream py-10 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl space-y-10">
        
        {/* Header Title */}
        <div className="text-center space-y-3">
          <span className="font-poppins text-xs uppercase tracking-widest text-[#1F3A18]/80 font-semibold">
            Bakehouse Catalog
          </span>
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-[#1F3A18]">
            Artisanal Bakes & Celebration Cakes
          </h1>
          <p className="font-poppins text-sm text-[#333333] max-w-lg mx-auto">
            Order for same-day local bakehouse pickup or next-morning doorstep delivery across India. Baked fresh daily.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-sm border border-[#1F3A18]/10 space-y-4">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-poppins font-medium transition-all cursor-pointer ${
                    selectedCategory === cat 
                      ? 'bg-[#1F3A18] text-white shadow-sm' 
                      : 'bg-cream/50 text-[#333333] hover:bg-cream'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Keyword Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#1F3A18]/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mawa cakes, sourdough pav, puffs..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-cream/40 border border-[#1F3A18]/20 font-poppins text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3A18]"
              />
            </div>
          </div>

          {/* Dietary Filter Tags */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100 overflow-x-auto">
            <span className="text-xs font-poppins font-semibold text-[#1F3A18]/80 shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Dietary:
            </span>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-3 py-1 rounded-full text-xs font-poppins transition-colors cursor-pointer shrink-0 ${
                  selectedTag === tag 
                    ? 'bg-[#264A1E] text-white' 
                    : 'bg-cream/40 text-charcoal hover:bg-cream'
                }`}
              >
                {tag}
              </button>
            ))}
            {selectedTag && (
              <button 
                onClick={() => setSelectedTag(null)}
                className="text-xs text-[#1F3A18] underline ml-2 cursor-pointer"
              >
                Clear filter
              </button>
            )}
          </div>

        </div>

        {/* Product Grid with RUPEE (₹) symbols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredItems.map((item) => {
            const isOutOfStock = item.stock_quantity === 0 || item.status === 'out_of_stock';
            const isVeg = item.tags?.includes('100% Eggless') || !item.name.toLowerCase().includes('bacon');

            return (
              <div 
                key={item.id} 
                className={`group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-black/5 ${
                  isOutOfStock ? 'opacity-75' : ''
                }`}
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-cream/30">
                  <img 
                    src={item.image_urls?.[0] || BAKERY_IMAGES.items.croissant} 
                    alt={item.name} 
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      isOutOfStock ? 'grayscale-[40%]' : 'group-hover:scale-105'
                    }`} 
                  />
                  {isOutOfStock ? (
                    <span className="absolute top-3 right-3 px-3 py-1 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full uppercase tracking-wider">
                      Sold Out
                    </span>
                  ) : item.stock_quantity < 10 ? (
                    <span className="absolute top-3 right-3 px-2.5 py-1 bg-[#1F3A18] text-cream text-[11px] font-semibold rounded-full shadow">
                      Only {item.stock_quantity} left
                    </span>
                  ) : null}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      {/* Green Veg Indicator */}
                      {isVeg && (
                        <span className="w-3 h-3 rounded-sm border border-green-600 flex items-center justify-center p-[1px] shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600 block"></span>
                        </span>
                      )}
                      <h3 className="font-playfair text-lg font-bold text-[#1F3A18] line-clamp-1">
                        {item.name}
                      </h3>
                    </div>
                    <p className="font-poppins text-xs text-charcoal-muted line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="font-poppins text-lg font-bold text-[#1F3A18]">
                      ₹{item.price.toFixed(0)}
                    </span>
                    <Button 
                      size="sm" 
                      variant={isOutOfStock ? "outline" : "primary"}
                      disabled={isOutOfStock}
                      onClick={() => addItem(item)}
                      className="gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                    </Button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Loyalty Reward Callout Banner (India Spec) */}
        <div className="bg-[#1F3A18] text-cream rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-white/10">
          <div className="space-y-2 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-poppins font-semibold uppercase tracking-widest text-[#F1E4A6]/80">
              <Sparkles className="w-4 h-4 text-cream" /> Baker's Loyalty Rewards
            </span>
            <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white">
              Earn 1 Point for Every ₹100 Spent
            </h3>
            <p className="font-poppins text-xs sm:text-sm text-white/80 max-w-xl">
              Redeem loyalty points for up to 50% discount on celebration cakes and daily bread. Tracked directly in your account.
            </p>
          </div>
          <Button variant="cream" size="md" className="shrink-0">
            Join & Get 50 Bonus Points
          </Button>
        </div>

      </div>
    </div>
  );
}
