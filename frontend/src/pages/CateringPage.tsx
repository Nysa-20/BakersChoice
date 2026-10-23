import { useState } from 'react';
import { BAKERY_IMAGES } from '../constants/images';
import { ChevronList } from '../components/ui/ChevronList';
import { Button } from '../components/ui/Button';
import { Calendar, Users, Cake, CheckCircle } from 'lucide-react';

export default function CateringPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-cream py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-5xl space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="font-poppins text-xs uppercase tracking-widest text-[#1F3A18]/80 font-semibold">
            Celebration & Wedding Experiences
          </span>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F3A18]">
            Curated Patisserie Catering
          </h1>
          <p className="font-poppins text-base text-[#333333] leading-relaxed">
            Elevate your unforgettable gatherings with custom tiered cakes, artisanal viennoiserie displays, and delicate Parisian dessert canapés.
          </p>
        </div>

        {/* Hero Visual */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 aspect-[16/9] sm:aspect-[21/9]">
          <img src={BAKERY_IMAGES.catering} alt="Catering spread" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 text-white space-y-1">
            <h3 className="font-playfair text-2xl font-bold text-cream">Grand Banquets & Intimate Brunches</h3>
            <p className="font-poppins text-xs sm:text-sm text-white/90">Accommodating celebrations from 20 to 500 guests with bespoke menu pairings.</p>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="space-y-8">
          <h2 className="font-playfair text-3xl font-bold text-center text-[#1F3A18]">
            Signature Catering Packages
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Package 1 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#1F3A18]/10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-full bg-[#1F3A18]/10 flex items-center justify-center text-[#1F3A18]">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-playfair text-2xl font-bold text-[#1F3A18]">The Morning Atelier</h3>
                <p className="font-poppins text-xs text-[#666666] leading-relaxed">
                  Ideal for bridal party breakfasts, corporate retreats, and brunch receptions.
                </p>
                <div className="font-poppins font-bold text-xl text-[#1F3A18]">$18 <span className="text-xs font-normal text-gray-500">/ guest</span></div>
                <ChevronList 
                  items={[
                    "Assorted miniature French croissants & pain au chocolat",
                    "Wild berry vanille tartlets & savory brioche bites",
                    "Stone-ground sourdough bread platter with whipped cultured butter",
                    "Organic cold brew and artisanal tea service"
                  ]}
                />
              </div>
              <Button variant="secondary" className="w-full">Select Package</Button>
            </div>

            {/* Package 2 (Featured) */}
            <div className="bg-[#1F3A18] text-cream rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-cream/30 flex flex-col justify-between space-y-6 relative">
              <span className="absolute -top-3 right-6 px-3 py-1 bg-cream text-[#1F3A18] text-[10px] font-bold uppercase tracking-widest rounded-full shadow">
                Most Popular
              </span>
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center text-cream">
                  <Cake className="w-5 h-5" />
                </div>
                <h3 className="font-playfair text-2xl font-bold text-white">The Couture Wedding Table</h3>
                <p className="font-poppins text-xs text-white/80 leading-relaxed">
                  A breathtaking dessert focal point paired with a custom centerpiece wedding cake.
                </p>
                <div className="font-poppins font-bold text-xl text-cream">$32 <span className="text-xs font-normal text-white/60">/ guest</span></div>
                <ul className="space-y-3 font-poppins text-xs sm:text-sm text-white/90">
                  <li className="flex items-center gap-2"><span className="text-cream font-bold">‹</span> Tiered wedding cake with custom buttercream flora</li>
                  <li className="flex items-center gap-2"><span className="text-cream font-bold">‹</span> Macaron pyramid tower (120 macarons, custom palette)</li>
                  <li className="flex items-center gap-2"><span className="text-cream font-bold">‹</span> Dark chocolate truffle bars & lemon meringue tartlets</li>
                  <li className="flex items-center gap-2"><span className="text-cream font-bold">‹</span> Full setup, stand rentals & dedicated display stylist</li>
                </ul>
              </div>
              <Button variant="cream" className="w-full">Request Wedding Tasting</Button>
            </div>

            {/* Package 3 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#1F3A18]/10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-full bg-[#1F3A18]/10 flex items-center justify-center text-[#1F3A18]">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-playfair text-2xl font-bold text-[#1F3A18]">Artisan Gift Favors</h3>
                <p className="font-poppins text-xs text-[#666666] leading-relaxed">
                  Individual heirloom keepsake boxes containing delicate confections for your attendees.
                </p>
                <div className="font-poppins font-bold text-xl text-[#1F3A18]">$12 <span className="text-xs font-normal text-gray-500">/ favor box</span></div>
                <ChevronList 
                  items={[
                    "Embossed luxury gift boxes with customized wax seal",
                    "Choice of 4 macarons or handmade praline truffles",
                    "Personalized calligraphed thank you card",
                    "Available in vegan and gluten-free dietary variations"
                  ]}
                />
              </div>
              <Button variant="secondary" className="w-full">Select Favors</Button>
            </div>

          </div>
        </div>

        {/* Catering Inquiry Form */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-[#1F3A18]/10 max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-[#1F3A18]">
              Reserve Your Date & Private Tasting
            </h3>
            <p className="font-poppins text-xs sm:text-sm text-[#666666]">
              Share your celebration details with our master pastry chef. We reply within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="bg-cream/60 border border-[#1F3A18]/20 rounded-2xl p-8 text-center space-y-3">
              <CheckCircle className="w-10 h-10 text-[#1F3A18] mx-auto" />
              <h4 className="font-playfair text-xl font-bold text-[#1F3A18]">Inquiry Received</h4>
              <p className="font-poppins text-xs sm:text-sm text-charcoal">
                Thank you! Our head patissier will review your event details and reach out to schedule your private tasting consultation.
              </p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4 font-poppins text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1F3A18] font-medium mb-1">Your Name</label>
                  <input required type="text" placeholder="e.g. Charlotte Hayes" className="w-full px-4 py-2.5 rounded-lg bg-cream/40 border border-[#1F3A18]/20 focus:outline-none focus:ring-2 focus:ring-[#1F3A18]" />
                </div>
                <div>
                  <label className="block text-[#1F3A18] font-medium mb-1">Email Address</label>
                  <input required type="email" placeholder="charlotte@example.com" className="w-full px-4 py-2.5 rounded-lg bg-cream/40 border border-[#1F3A18]/20 focus:outline-none focus:ring-2 focus:ring-[#1F3A18]" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1F3A18] font-medium mb-1">Event Date</label>
                  <input required type="date" className="w-full px-4 py-2.5 rounded-lg bg-cream/40 border border-[#1F3A18]/20 focus:outline-none focus:ring-2 focus:ring-[#1F3A18]" />
                </div>
                <div>
                  <label className="block text-[#1F3A18] font-medium mb-1">Estimated Guest Count</label>
                  <input required type="number" placeholder="50" min="10" className="w-full px-4 py-2.5 rounded-lg bg-cream/40 border border-[#1F3A18]/20 focus:outline-none focus:ring-2 focus:ring-[#1F3A18]" />
                </div>
              </div>

              <div>
                <label className="block text-[#1F3A18] font-medium mb-1">Celebration Vision & Special Requests</label>
                <textarea rows={3} placeholder="Tell us about your celebration style, dietary preferences, or custom cake themes..." className="w-full px-4 py-2.5 rounded-lg bg-cream/40 border border-[#1F3A18]/20 focus:outline-none focus:ring-2 focus:ring-[#1F3A18]" />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full">
                Submit Catering Request ➔
              </Button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
