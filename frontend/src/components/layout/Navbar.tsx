import { Link } from 'react-router-dom';
import { ShoppingBag, User, Menu } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';

export function Navbar() {
  const { items, setIsOpen } = useCartStore();
  const { user } = useAuthStore();
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-playfair text-2xl font-bold tracking-tight text-deep-green">
              Baker's Choice
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link to="/products" className="text-sm font-medium text-gray-700 hover:text-deep-green">Shop</Link>
            <Link to="/about" className="text-sm font-medium text-gray-700 hover:text-deep-green">Our Story</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link to={user ? "/profile" : "/login"} className="text-gray-700 hover:text-deep-green">
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Link>
          <button 
            className="relative text-gray-700 hover:text-deep-green"
            onClick={() => setIsOpen(true)}
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-deep-green text-[10px] text-cream">
                {itemCount}
              </span>
            )}
            <span className="sr-only">Cart</span>
          </button>
          <button className="md:hidden text-gray-700 hover:text-deep-green">
            <Menu className="h-5 w-5" />
          </button>
        </div>

      </div>
    </header>
  );
}
