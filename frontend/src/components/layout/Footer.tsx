import { Link } from 'react-router-dom';
import { Wheat, Phone, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';

export function Footer() {
  return (
    <footer className="bg-[#1F3A18] text-white pt-16 pb-10 border-t border-[#264A1E]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-[#1F3A18]">
                <Wheat className="w-5 h-5 text-[#1F3A18]" />
              </div>
              <span className="font-playfair text-2xl font-bold text-cream">
                Baker's Choice
              </span>
            </div>
            <p className="font-poppins text-sm text-white/80 leading-relaxed max-w-sm">
              Artisanal patisserie crafting heirloom sourdough pav, delicate French croissants, and festive eggless celebration cakes with pure organic heritage grains.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 font-poppins">
            <h4 className="font-playfair text-lg text-cream font-semibold">Explore</h4>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li><Link to="/cakes" className="hover:text-cream transition-colors">Daily Menu & Bakes (₹)</Link></li>
              <li><Link to="/about" className="hover:text-cream transition-colors">Our Story & Craft</Link></li>
              <li><Link to="/catering" className="hover:text-cream transition-colors">Event & Wedding Catering</Link></li>
              <li><Link to="/account" className="hover:text-cream transition-colors">Loyalty Rewards Club</Link></li>
              <li><Link to="/contact" className="hover:text-cream transition-colors">Store Locator & Pickup</Link></li>
            </ul>
          </div>

          {/* Opening Hours & Contact */}
          <div className="space-y-4 font-poppins">
            <h4 className="font-playfair text-lg text-cream font-semibold">Bakehouse Hours</h4>
            <div className="space-y-2 text-sm text-white/80">
              <p><strong className="text-cream">Tuesday – Friday:</strong> 7:00 AM – 9:30 PM</p>
              <p><strong className="text-cream">Saturday – Sunday:</strong> 8:00 AM – 10:00 PM</p>
              <p><strong className="text-cream">Monday:</strong> Closed for Flour Mill Prep</p>
            </div>
            <div className="pt-2 space-y-1 text-xs text-white/70">
              <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-cream" /> 14, 100 Feet Rd, Indiranagar, Bengaluru</p>
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-cream" /> +91 98450 72839</p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4 font-poppins">
            <h4 className="font-playfair text-lg text-cream font-semibold">The Baker's Note</h4>
            <p className="text-xs text-white/80 leading-relaxed">
              Subscribe for weekly seasonal menu drops, Diwali festival hampers, and 50 bonus loyalty points.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-4 py-2.5 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-cream" 
              />
              <Button variant="cream" size="sm" className="w-full">
                Subscribe
              </Button>
            </form>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-poppins text-xs text-white/60">
          <p>© {new Date().getFullYear()} Baker's Choice Patisserie India Pvt Ltd. All rights reserved. GST Compliant.</p>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:underline">Privacy Policy</a>
            <a href="#terms" className="hover:underline">Terms of Service</a>
            <a href="#fssai" className="hover:underline">FSSAI Lic. #11223344556677</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
