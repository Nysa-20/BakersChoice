import { BAKERY_IMAGES } from '../constants/images';
import { ChevronList } from '../components/ui/ChevronList';
import { StatCard } from '../components/ui/StatCard';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-5xl space-y-20">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="font-poppins text-xs uppercase tracking-widest text-[#1F3A18]/80 font-semibold">
            Our Story & Heritage
          </span>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F3A18]">
            Where Every Slice Matters
          </h1>
          <p className="font-poppins text-base text-[#333333] leading-relaxed">
            Bridging European classical pastry technique with India's heirloom grains, ancient stone-milled Sharbati wheat, and rich mawa baking traditions.
          </p>
        </div>

        {/* Feature Split 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 aspect-[4/3]">
              <img src={BAKERY_IMAGES.story1} alt="Baking bread" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-4 z-10">
              <StatCard number="100%" label="Organic Heritage Wheat" />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1F3A18]">
              The Sacred 36-Hour Sourdough Fermentation
            </h2>
            <p className="font-poppins text-[#333333] leading-relaxed text-sm sm:text-base">
              Great bread cannot be rushed with chemical dough conditioners or commercial yeast. Each of our sourdough country loaves and brioche pav undergoes a 36-hour natural cold fermentation, breaking down phytic acid and unlocking complex earthy aromas with a feather-light crumb.
            </p>
            <ChevronList 
              items={[
                "Wild active culture sourdough mother fed twice daily with spring water",
                "Stone-ground organic Sharbati & Khapli grains sourced directly from Indian farm co-ops",
                "High-hydration dough baked on searing stone hearth decks for blistered ears",
                "100% pure vegetarian & naturally vegan breads with no artificial preservatives"
              ]}
            />
          </div>
        </div>

        {/* Feature Split 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1 space-y-6">
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1F3A18]">
              French Viennoiserie & Cultured Butter
            </h2>
            <p className="font-poppins text-[#333333] leading-relaxed text-sm sm:text-base">
              The secret behind our croissants and flaky puffs lies in our butter: we churn fresh cream into pure 84% butterfat cultured butter. Folded across 27 precise laminations in our temperature-regulated pastry studio, the resulting layers shatter delicately with a rich, nutty finish.
            </p>
            <div className="pt-2">
              <Link to="/cakes">
                <Button variant="primary" size="md">
                  Taste the Daily Menu
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 aspect-[4/3]">
              <img src={BAKERY_IMAGES.story2} alt="Pastry lamination" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-4 z-10">
              <StatCard number="27" label="Golden Crisp Layers" />
            </div>
          </div>
        </div>

        {/* Callout Box */}
        <div className="bg-[#1F3A18] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl border border-white/10">
          <h3 className="font-playfair text-3xl sm:text-4xl font-bold text-cream">
            Experience the Warmth of Our Bengaluru Bakehouse
          </h3>
          <p className="font-poppins text-sm sm:text-base text-white/80 max-w-xl mx-auto leading-relaxed">
            Fresh loaves, soft sourdough pav, and mawa cakes emerge from our stone ovens at 7:00 AM every Tuesday through Sunday. Visit our Indiranagar flagship store or order online for same-day delivery.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/cakes">
              <Button variant="cream" size="lg">
                Explore Today's Bakes (₹)
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
