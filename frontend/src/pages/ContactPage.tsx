import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-cream py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl space-y-12">
        
        {/* Title */}
        <div className="text-center space-y-3">
          <span className="font-poppins text-xs uppercase tracking-widest text-[#1F3A18]/80 font-semibold">
            Visit & Connect
          </span>
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-[#1F3A18]">
            Get In Touch
          </h1>
          <p className="font-poppins text-sm text-[#333333] max-w-md mx-auto">
            Have questions about custom eggless wedding cakes, festive gifting hampers, or morning bread deliveries? Our team is at your service.
          </p>
        </div>

        {/* 2-Column Split: Info & Form */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Info Card */}
          <div className="md:col-span-5 bg-[#1F3A18] text-cream rounded-3xl p-8 shadow-xl border border-white/10 space-y-8">
            <div className="space-y-4">
              <h3 className="font-playfair text-2xl font-bold text-white">The Bakehouse Flagship</h3>
              <p className="font-poppins text-xs text-white/80 leading-relaxed">
                Step into our glass-front atelier in Indiranagar to pick up your pre-ordered morning pav, croissants, and celebration cakes.
              </p>
            </div>

            <div className="space-y-4 font-poppins text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cream shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Location:</strong>
                  <span className="text-white/80">14, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-cream shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Phone:</strong>
                  <span className="text-white/80">+91 98450 72839 / +91 (80) 4920-3921</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-cream shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Direct Email:</strong>
                  <span className="text-white/80">orders@bakerschoice.in</span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-white/10">
                <Clock className="w-5 h-5 text-cream shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Bakehouse Hours:</strong>
                  <span className="text-white/80">Tue – Fri: 7:00 AM – 9:30 PM</span><br />
                  <span className="text-white/80">Sat – Sun: 8:00 AM – 10:00 PM</span><br />
                  <span className="text-white/50">Mon: Closed for Milling & Restock</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-7 bg-white rounded-3xl p-8 shadow-sm border border-[#1F3A18]/10 space-y-6">
            <h3 className="font-playfair text-2xl font-bold text-[#1F3A18]">
              Send Us a Message
            </h3>

            {sent ? (
              <div className="bg-cream/60 border border-[#1F3A18]/20 rounded-2xl p-6 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-[#1F3A18] mx-auto" />
                <h4 className="font-playfair text-lg font-bold text-[#1F3A18]">Inquiry Sent</h4>
                <p className="font-poppins text-xs text-charcoal">
                  Thank you! We have received your note and our concierge will get in touch with you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4 font-poppins text-xs sm:text-sm">
                <div>
                  <label className="block text-[#1F3A18] font-medium mb-1">Your Name</label>
                  <input required type="text" placeholder="e.g. Siddharth Rao" className="w-full px-4 py-2.5 rounded-lg bg-cream/40 border border-[#1F3A18]/20 focus:outline-none focus:ring-2 focus:ring-[#1F3A18]" />
                </div>
                <div>
                  <label className="block text-[#1F3A18] font-medium mb-1">Email or Phone</label>
                  <input required type="text" placeholder="you@example.com or +91 98..." className="w-full px-4 py-2.5 rounded-lg bg-cream/40 border border-[#1F3A18]/20 focus:outline-none focus:ring-2 focus:ring-[#1F3A18]" />
                </div>
                <div>
                  <label className="block text-[#1F3A18] font-medium mb-1">Message</label>
                  <textarea required rows={4} placeholder="How can our pastry chefs assist you?" className="w-full px-4 py-2.5 rounded-lg bg-cream/40 border border-[#1F3A18]/20 focus:outline-none focus:ring-2 focus:ring-[#1F3A18]" />
                </div>
                <Button type="submit" variant="primary" size="md" className="w-full">
                  Send Message
                </Button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
