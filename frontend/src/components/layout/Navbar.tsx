import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Wheat } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';

export function Navbar() {
  const { items, setIsOpen } = useCartStore();
  const { user } = useAuthStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Cakes', path: '/cakes' },
    { label: 'Catering', path: '/catering' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-cream/95 backdrop-blur-md border-b border-[#1F3A18]/10 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* Left: Circular Badge-style Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1F3A18] flex items-center justify-center text-cream shadow-md transition-transform group-hover:scale-105">
            <Wheat className="w-5 h-5 sm:w-6 sm:h-6 text-[#F1E4A6]" />
          </div>
          <div className="flex flex-col">
            <span className="font-playfair text-xl sm:text-2xl font-bold tracking-tight text-[#1F3A18] leading-none">
              Baker's Choice
            </span>
            <span className="font-poppins text-[10px] uppercase tracking-widest text-[#1F3A18]/70 mt-1">
              Artisanal Patisserie
            </span>
          </div>
        </Link>

        {/* Center: Horizontal Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path}
                to={link.path} 
                className={`font-poppins text-sm font-medium transition-colors hover:text-[#1F3A18] ${
                  isActive ? 'text-[#1F3A18] font-semibold' : 'text-[#333333]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: "Online Order" CTA, Account, Cart, Mobile toggle */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Underlined Distinct "Online Order" Text Link */}
          <Link 
            to="/cakes" 
            className="hidden sm:inline-block font-poppins text-sm font-semibold text-[#1F3A18] underline underline-offset-8 decoration-2 decoration-[#1F3A18] hover:text-[#264A1E] transition-colors"
          >
            Online Order
          </Link>

          {/* User Account / Admin Badge */}
          <Link 
            to={user ? (user.role === 'admin' ? "/admin" : "/account") : "/login"} 
            className="flex items-center gap-1.5 text-[#333333] hover:text-[#1F3A18] transition-colors p-1"
            title={user ? (user.role === 'admin' ? "Admin Portal" : "My Account") : "Sign In"}
          >
            <User className="h-5 w-5" />
            {user && (
              <span className="hidden md:inline text-xs font-medium font-poppins text-[#1F3A18]">
                {user.role === 'admin' ? 'Admin' : (user.name || 'Account')}
              </span>
            )}
          </Link>

          {/* Cart with Live Count */}
          <button 
            className="relative p-2 text-[#333333] hover:text-[#1F3A18] transition-colors cursor-pointer"
            onClick={() => setIsOpen(true)}
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute 0 top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1F3A18] text-[9px] font-bold text-cream animate-in zoom-in-50">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button 
            className="lg:hidden p-2 text-[#333333] hover:text-[#1F3A18] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1F3A18]/10 bg-cream px-4 pt-4 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block font-poppins text-base font-medium text-[#333333] hover:text-[#1F3A18] py-2"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-[#1F3A18]/10">
            <Link
              to="/cakes"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-poppins font-semibold text-[#1F3A18] underline underline-offset-4 py-2"
            >
              Online Order ➔
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
