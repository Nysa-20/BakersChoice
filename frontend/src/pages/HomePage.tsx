import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { client } from '../api/client';
import type { components } from '../api/schema';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import { ChevronList } from '../components/ui/ChevronList';
import { DiagonalTickerRibbon } from '../components/ui/DiagonalTickerRibbon';
import { ScallopedDivider } from '../components/ui/ScallopedDivider';
import { useCartStore } from '../store/cartStore';
import { BAKERY_IMAGES } from '../constants/images';
import { ShoppingBag, Star, Sparkles } from 'lucide-react';

type Item = components['schemas']['Item'];

// Curated starter items with Indian flavor profiles and INR prices
const FALLBACK_ITEMS: Item[] = [
  {
    id: "f1-croissant",
    name: "Classic Butter Croissant",
    description: "Flaky 27-layered French viennoiserie made with 84% cultured butter. Golden and crisp.",
    price: 180.00,
    stock_quantity: 40,
    low_stock_threshold: 10,
    status: "active",
    image_urls: [BAKERY_IMAGES.items.croissant]
  },
  {
    id: "f2-sourdough",
    name: "Artisan Sourdough Loaf",
    description: "36-hour naturally fermented country bread baked with stone-milled organic Sharbati wheat.",
    price: 280.00,
    stock_quantity: 18,
    low_stock_threshold: 10,
    status: "active",
    image_urls: [BAKERY_IMAGES.items.sourdough]
  },
  {
    id: "f3-truffle-cake",
    name: "Belgian Dark Truffle Cake (Eggless)",
    description: "Decadent 70% dark chocolate sponge layered with silky Valrhona ganache. 100% vegetarian.",
    price: 950.00,
    stock_quantity: 6,
    low_stock_threshold: 5,
    status: "active",
    image_urls: [BAKERY_IMAGES.items.chocolateCake]
  },
  {
    id: "f4-mawa-cake",
    name: "Cardamom & Saffron Mawa Cake",
    description: "Heritage Irani cafe tea cake enriched with slow-cooked mawa, green cardamom, and pistachios.",
    price: 320.00,
    stock_quantity: 24,
    low_stock_threshold: 10,
    status: "active",
    image_urls: [BAKERY_IMAGES.items.almondCroissant]
  }
];

export default function HomePage() {
  const [items, setItems] = useState<Item[]>(FALLBACK_ITEMS);
  const { addItem } = useCartStore();
  const [testimonialIndex, setTestimonialIndex] = useState(3);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await client.GET('/api/products/');
        if (data && data.length > 0) {
          setItems(data);
        }
      } catch (err) {
        console.log("Using cached curated items");
      }
    }
    fetchProducts();
  }, []);

  const testimonials = [
    {
      quote: "The Belgian Dark Truffle Cake was the centerpiece of our Diwali celebration. Rich, luxurious, and completely eggless without compromising on a single crumb of texture.",
      author: "Ananya & Rohan Sharma",
      occasion: "Celebration Cake Order • Indiranagar, Bengaluru"
    },
    {
      quote: "Every morning starts with their sourdough loaf and brioche pav. You can taste the slow fermentation and stone-milled Sharbati flour in every bite.",
      author: "Priya Venkatesh",
      occasion: "Daily Bread Subscriber • Bandra, Mumbai"
    },
    {
      quote: "Their wedding dessert table at our Goa reception exceeded all expectations. The mini kesar tarts and flaky croissants were an instant hit with all our guests.",
      author: "Kavita & Aditya Roy",
      occasion: "Wedding Catering • Destination Banquet"
    },
    {
      quote: "Where every bite feels genuinely special. The marriage of French viennoiserie technique with India's rich mawa and spice heritage is truly masterclass.",
      author: "Chef Sanjeev Mehra",
      occasion: "Culinary Director & Food Critic"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-cream">

      {/* ========================================================
          4.2 HERO SECTION
          Two-column split: Left = Text & Scalloped Thumbnails, Right = Hero Photo & Caption
          ======================================================== */}
      <section className="relative px-4 sm:px-6 pt-8 pb-16 lg:py-20 overflow-hidden">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headlines, Subhead, CTA, Scalloped Teasers */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F3A18]/10 text-[#1F3A18] text-xs font-poppins font-semibold">
                  <Sparkles className="w-3.5 h-3.5" /> 100% Pure Vegetarian & Eggless Options Available
                </div>
                <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1F3A18] leading-[1.15]">
                  Where Every Bite <br className="hidden sm:inline" />
                  <span className="italic font-normal">Feels Special.</span>
                </h1>
                <p className="font-poppins text-[#333333] text-base sm:text-lg leading-relaxed max-w-xl">
                  Handcrafted artisanal pastries, slow-fermented sourdough loaves, and bespoke celebration cakes baked fresh every morning with organic heritage grains and pure cultured butter.
                </p>
              </div>

              {/* Primary CTA */}
              <div className="flex items-center gap-4">
                <Link to="/cakes">
                  <Button size="lg" className="shadow-md">
                    Order Now
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="ghost" size="lg" className="font-poppins text-sm font-semibold">
                    Our Heritage & Craft ➔
                  </Button>
                </Link>
              </div>

              {/* Teaser Thumbnails bottom-cropped with scalloped wave cut */}
              <div className="pt-4 space-y-2">
                <span className="font-poppins text-xs uppercase tracking-widest text-[#1F3A18]/70 font-semibold block">
                  Morning Bakehouse Highlights
                </span>
                <div className="flex gap-4 sm:gap-6">
                  {/* Thumbnail 1 */}
                  <div className="relative group w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shadow-md border-2 border-white/50">
                    <img 
                      src={BAKERY_IMAGES.heroTeaser1} 
                      alt="Morning Croissant" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-x-0 bottom-0">
                      <ScallopedDivider color="#F1E4A6" />
                    </div>
                  </div>

                  {/* Thumbnail 2 */}
                  <div className="relative group w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shadow-md border-2 border-white/50">
                    <img 
                      src={BAKERY_IMAGES.heroTeaser2} 
                      alt="Artisan Sourdough" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-x-0 bottom-0">
                      <ScallopedDivider color="#F1E4A6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Showpiece Photo with Scalloped Base & Overlaid Caption */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/40 aspect-[4/5] sm:aspect-[4/4.5]">
                  <img 
                    src={BAKERY_IMAGES.heroMain} 
                    alt="Artisanal Celebration Cake" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0">
                    <ScallopedDivider color="#F1E4A6" />
                  </div>

                  {/* Floating Caption Card on bottom-right (Green at 85% opacity) */}
                  <div className="absolute bottom-8 right-6 left-6 sm:left-auto sm:max-w-xs bg-[#1F3A18]/85 backdrop-blur-md text-white p-5 rounded-2xl shadow-xl border border-white/15 space-y-1.5">
                    <span className="font-playfair text-lg font-bold text-cream block leading-tight">
                      Explore Our World
                    </span>
                    <p className="font-poppins text-xs text-white/90 leading-relaxed">
                      Custom Celebration Cakes, French Viennoiserie & Bespoke Wedding Catering.
                    </p>
                    <Link to="/cakes" className="inline-flex items-center text-[11px] font-semibold text-cream underline underline-offset-4 mt-1 hover:text-white">
                      Discover Menu ➔
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          4.3 INTRO / STATS STRIP
          Centered heading + Alternating 2-column with chevron bullets & Overlapping Stat Cards
          ======================================================== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-cream">
        <div className="container mx-auto max-w-6xl">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F3A18]">
              Discover About Our Cake
            </h2>
            <p className="font-poppins text-sm sm:text-base text-[#333333]">
              Rooted in classical European traditions, elevated with India's finest spices and pure ingredients.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-[#1F3A18]">
                Every Layer Crafted with Purpose & Pure Ingredients
              </h3>
              <p className="font-poppins text-[#333333] leading-relaxed text-sm sm:text-base">
                We believe exceptional bakery products originate from uncompromised raw materials: 84% butterfat European cultured butter, single-origin stone-ground wheat from Madhya Pradesh, Kashmiri saffron, and organic dairy from local farms.
              </p>

              <ChevronList 
                items={[
                  "100% Organic, Stone-Milled Sharbati Wheat with Zero Additives",
                  "36-Hour Natural Sourdough Fermentation for Superior Digestion",
                  "Extensive Range of 100% Eggless (Pure Veg) Gourmet Cakes",
                  "Signature Custom Cakes Designed to Your Exact Celebratory Vision"
                ]} 
              />

              <div className="pt-2">
                <Link to="/cakes">
                  <Button variant="primary" size="md">
                    View Collection
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative pt-10">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/40 aspect-[4/3] sm:aspect-[16/11]">
                <img 
                  src={BAKERY_IMAGES.introCraft} 
                  alt="Artisan Craftsmanship" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlapping Floating Stat Cards */}
              <div className="absolute -top-4 sm:-top-6 left-4 sm:left-8 z-10 flex gap-4">
                <StatCard number="80+" label="Delivery Pin Codes" />
                <StatCard number="95+" label="Daily Fresh Bakes" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          4.4 DIAGONAL TAG RIBBON
          ======================================================== */}
      <DiagonalTickerRibbon />

      {/* ========================================================
          4.5 PRODUCT GRID ("Best Selling Delights") with RUPEES (₹)
          ======================================================== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-cream">
        <div className="container mx-auto max-w-6xl">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F3A18]">
              Best Selling Delights
            </h2>
            <p className="font-poppins text-sm sm:text-base text-[#333333]">
              From crisp morning viennoiserie to eggless celebration centerpieces, hand-baked today.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.slice(0, 4).map((item) => (
              <div 
                key={item.id} 
                className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-black/5"
              >
                <div className="relative aspect-square overflow-hidden bg-cream/30">
                  <img 
                    src={item.image_urls?.[0] || BAKERY_IMAGES.items.croissant} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  {item.stock_quantity < 10 && item.stock_quantity > 0 && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 bg-[#1F3A18] text-cream text-[11px] font-semibold rounded-full shadow">
                      Only {item.stock_quantity} left
                    </span>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full border border-green-600 flex items-center justify-center p-[1px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-600 block"></span>
                      </span>
                      <h4 className="font-playfair text-lg font-bold text-[#1F3A18] group-hover:text-[#264A1E] transition-colors line-clamp-1">
                        {item.name}
                      </h4>
                    </div>
                    <p className="font-poppins text-xs text-charcoal-muted line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <span className="font-poppins text-lg font-bold text-[#1F3A18]">
                      ₹{item.price.toFixed(0)}
                    </span>
                    <Button 
                      size="sm" 
                      variant="primary"
                      onClick={() => addItem(item)}
                      className="gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-cream" />
                      Add to Cart
                    </Button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          <div className="text-center pt-12">
            <Link to="/cakes">
              <Button variant="secondary" size="lg" className="shadow-sm">
                View Full Menu (₹) ➔
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================
          4.6 FEATURE / SERVICE SECTION (Catering)
          ======================================================== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-cream/70 border-y border-[#1F3A18]/10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 order-2 lg:order-1 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 aspect-[4/3] sm:aspect-[16/11]">
                <img 
                  src={BAKERY_IMAGES.catering} 
                  alt="Patisserie Catering Service" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <div className="space-y-3">
                <span className="font-poppins text-xs font-semibold uppercase tracking-widest text-[#1F3A18]/80">
                  Weddings, Sangeets & Corporate Events
                </span>
                <h3 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1F3A18]">
                  Curated Catering for Indian Celebrations
                </h3>
              </div>

              <p className="font-poppins text-[#333333] leading-relaxed text-sm sm:text-base">
                Whether you are hosting an intimate mehendi brunch, a grand wedding reception, or corporate gifting for Diwali, our chefs curate tiered wedding cakes, delicate tartlets, and customized gift favor boxes.
              </p>

              <ChevronList 
                items={[
                  "Customized Multi-Tiered Wedding Cakes & Floral Displays",
                  "Viennoiserie & High-Tea Canapés for Up to 500 Guests",
                  "Festive Mithai & French Fusion Luxury Hampers",
                  "Dedicated Private Tasting Consultations with Our Executive Pastry Chef"
                ]} 
              />

              <div className="pt-2">
                <Link to="/catering">
                  <Button variant="primary" size="md">
                    Explore Catering Packages
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          4.7 MISSION / BRAND STORY SECTION
          ======================================================== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-cream">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="font-poppins text-xs font-semibold uppercase tracking-widest text-[#1F3A18]/80">
                Our Heirloom Philosophy
              </span>
              <h3 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1F3A18]">
                Baking as a Living, Breathable Art Form
              </h3>
              <p className="font-poppins text-[#333333] leading-relaxed text-sm sm:text-base">
                Baker's Choice started with a single sourdough starter fed with spring water and stone-milled whole grains. Today, we bring you the finest European baking tradition paired with India's rich palate — cardamom, slow-simmered mawa, Kashmiri saffron, and pure cultured white butter.
              </p>
              <p className="font-poppins text-[#333333] leading-relaxed text-sm sm:text-base">
                No chemical dough conditioners, no preservatives, and no shortcuts. Every morning, our hearth decks bake bread and pastries that nourish and delight.
              </p>
              <div className="pt-2">
                <Link to="/about">
                  <Button variant="outline" size="md">
                    Read Our Full Story
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-white/60 aspect-[3/4]">
                  <img src={BAKERY_IMAGES.story1} alt="Stone oven loaf" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6 pt-8 sm:pt-12">
                <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-white/60 aspect-[3/4]">
                  <img src={BAKERY_IMAGES.story2} alt="Pastry detailing" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          4.8 TESTIMONIAL / GALLERY SECTION
          ======================================================== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden bg-[#1F3A18]">
        <div className="absolute inset-0 z-0">
          <img 
            src={BAKERY_IMAGES.testimonialBg} 
            alt="Bakery background" 
            className="w-full h-full object-cover opacity-20 filter blur-[1px]" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1F3A18]/90 via-[#1F3A18]/80 to-[#1F3A18]/95" />
        </div>

        <div className="container relative z-10 mx-auto max-w-4xl text-center text-white space-y-8">
          
          <div className="flex justify-center gap-1 text-cream/90">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-cream text-cream" />
            ))}
          </div>

          <blockquote className="font-playfair text-2xl sm:text-3xl lg:text-4xl italic font-normal leading-relaxed text-cream max-w-3xl mx-auto">
            "{testimonials[testimonialIndex % testimonials.length].quote}"
          </blockquote>

          <div className="space-y-1 font-poppins">
            <p className="text-lg font-bold tracking-wide text-white">
              {testimonials[testimonialIndex % testimonials.length].author}
            </p>
            <p className="text-xs uppercase tracking-widest text-cream/70">
              {testimonials[testimonialIndex % testimonials.length].occasion}
            </p>
          </div>

          <div className="pt-6 flex flex-col items-center gap-3">
            <div className="flex items-center gap-4 text-xs font-poppins tracking-widest text-cream/80">
              <button 
                onClick={() => setTestimonialIndex(prev => (prev > 0 ? prev - 1 : testimonials.length - 1))}
                className="hover:text-white transition-colors cursor-pointer px-2"
              >
                ‹ Prev
              </button>
              <span className="font-bold">
                0{((testimonialIndex % testimonials.length) + 1)} / 0{testimonials.length}
              </span>
              <button 
                onClick={() => setTestimonialIndex(prev => (prev + 1) % testimonials.length)}
                className="hover:text-white transition-colors cursor-pointer px-2"
              >
                Next ›
              </button>
            </div>
            
            <div className="w-32 h-0.5 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cream transition-all duration-300"
                style={{ width: `${(((testimonialIndex % testimonials.length) + 1) / testimonials.length) * 100}%` }}
              />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
