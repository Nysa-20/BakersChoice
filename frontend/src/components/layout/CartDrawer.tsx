import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { Button } from '../ui/Button';

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, getTotals } = useCartStore();
  const { subtotal } = getTotals();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 font-poppins">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1F3A18]/10 bg-cream/30">
          <h2 className="font-playfair text-xl font-bold flex items-center gap-2.5 text-[#1F3A18]">
            <ShoppingBag className="w-5 h-5 text-[#1F3A18]" />
            Your Basket
          </h2>
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-2 hover:bg-black/5 rounded-full text-gray-500 hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-16">
              <div className="w-16 h-16 rounded-full bg-cream/60 flex items-center justify-center text-[#1F3A18]/50">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-playfair text-xl font-bold text-[#1F3A18]">Your basket is empty</p>
              <p className="text-xs text-gray-500 max-w-xs">
                Fresh loaves, delicate croissants, and celebration cakes await.
              </p>
              <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                Continue Browsing
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.item.id} className="flex gap-4 p-3 border border-gray-100 rounded-xl bg-cream/20">
                <div className="w-20 h-20 bg-cream/40 rounded-lg overflow-hidden shrink-0 border border-black/5">
                  {item.item.image_urls?.[0] ? (
                    <img src={item.item.image_urls[0]} alt={item.item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-playfair font-bold">BC</div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="font-playfair font-bold text-sm text-[#1F3A18] line-clamp-1">{item.item.name}</h3>
                    <p className="font-bold text-sm text-[#1F3A18]">₹{(item.item.price * item.quantity).toFixed(0)}</p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.item.id, item.quantity - 1)}
                        className="px-2.5 py-1 hover:bg-gray-100 text-xs transition-colors cursor-pointer"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-semibold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.item.id, item.quantity + 1)}
                        className="px-2.5 py-1 hover:bg-gray-100 text-xs transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeItem(item.item.id)}
                      className="text-xs text-red-600 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="border-t border-[#1F3A18]/10 p-5 space-y-4 bg-cream/30">
            <div className="space-y-1.5 text-xs text-gray-600 font-poppins">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (5%)</span>
                <span className="font-semibold text-gray-800">₹{(subtotal * 0.05).toFixed(0)}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-[#1F3A18] pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>₹{(subtotal * 1.05).toFixed(0)}</span>
              </div>
            </div>

            <Button 
              className="w-full shadow-md" 
              size="lg" 
              onClick={() => {
                setIsOpen(false);
                navigate('/checkout');
              }}
            >
              Proceed to Checkout ➔
            </Button>
          </div>
        )}

      </div>
    </>
  );
}
