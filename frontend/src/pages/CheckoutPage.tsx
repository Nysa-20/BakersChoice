import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { ShoppingBag, Sparkles, CheckCircle, ArrowLeft, Smartphone } from 'lucide-react';

export default function CheckoutPage() {
  const { items, getTotals, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [address, setAddress] = useState({
    line1: 'Flat 402, Shanti Vihar, 100 Feet Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    postal_code: '560038'
  });
  const [paymentType, setPaymentType] = useState<'upi' | 'card'>('upi');
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  const { subtotal } = getTotals();
  const gst = subtotal * 0.05; // 5% GST on bakery goods
  
  // PRD FR-11 & FR-13: 1 Point = ₹1 discount. Capped at 50% of subtotal.
  const userPoints = user?.points_balance || 50; 
  const maxRedeemablePoints = Math.min(userPoints, Math.floor(subtotal * 0.5));
  const pointsDiscount = Math.min(redeemPoints, maxRedeemablePoints);
  const deliveryCharge = deliveryMethod === 'delivery' ? 50 : 0;
  const finalTotal = Math.max(0, subtotal + gst + deliveryCharge - pointsDiscount);

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const generatedOrderId = "BC-IN-" + Math.floor(100000 + Math.random() * 900000);
      setOrderComplete(generatedOrderId);
      clearCart();
    }, 1200);
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center py-20 px-4 text-center space-y-4">
        <ShoppingBag className="w-16 h-16 text-[#1F3A18]/40" />
        <h2 className="font-playfair text-3xl font-bold text-[#1F3A18]">Your Basket is Empty</h2>
        <p className="font-poppins text-sm text-[#666666] max-w-sm">
          Browse our daily selection of mawa cakes, sourdough pav, and Belgian truffle cakes.
        </p>
        <Link to="/cakes">
          <Button variant="primary" size="md">
            Explore Daily Bakes
          </Button>
        </Link>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-cream py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-lg bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-[#1F3A18]/10 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#1F3A18]/10 flex items-center justify-center text-[#1F3A18] mx-auto">
            <CheckCircle className="w-8 h-8 text-[#1F3A18]" />
          </div>
          <div className="space-y-2">
            <span className="font-poppins text-xs font-semibold uppercase tracking-widest text-[#1F3A18]">Order Confirmed</span>
            <h1 className="font-playfair text-3xl font-bold text-[#1F3A18]">Baking Has Begun!</h1>
            <p className="font-poppins text-xs sm:text-sm text-[#666666]">
              Order Reference: <strong className="text-[#1F3A18]">{orderComplete}</strong>
            </p>
          </div>

          <div className="bg-cream/40 rounded-2xl p-4 text-left font-poppins text-xs space-y-2 border border-[#1F3A18]/10">
            <div className="flex justify-between text-[#333333]">
              <span>Fulfillment Method:</span>
              <strong className="capitalize text-[#1F3A18]">{deliveryMethod === 'delivery' ? 'Doorstep Delivery' : 'Bakehouse Store Pickup'}</strong>
            </div>
            <div className="flex justify-between text-[#333333]">
              <span>Loyalty Points Earned:</span>
              <strong className="text-[#1F3A18]">+{Math.floor(finalTotal / 100)} Points</strong>
            </div>
            <div className="flex justify-between text-[#333333]">
              <span>Tax Invoice (GST Compliant):</span>
              <strong className="text-[#1F3A18]">Ready for Download</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link to="/account" className="flex-1">
              <Button variant="primary" size="md" className="w-full">
                View in My Account
              </Button>
            </Link>
            <Link to="/cakes" className="flex-1">
              <Button variant="secondary" size="md" className="w-full">
                Order More Bakes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-10 px-4 sm:px-6">
      <div className="container mx-auto max-w-5xl space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/cakes" className="inline-flex items-center gap-2 text-xs font-poppins font-medium text-[#1F3A18] hover:underline">
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
          <span className="font-playfair text-xl font-bold text-[#1F3A18]">Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Delivery / Pickup Selector */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#1F3A18]/10 space-y-4">
              <h3 className="font-playfair text-xl font-bold text-[#1F3A18]">Fulfillment Preference</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`p-4 rounded-xl text-left border font-poppins transition-all cursor-pointer ${
                    deliveryMethod === 'pickup' 
                      ? 'border-[#1F3A18] bg-cream/40 ring-1 ring-[#1F3A18]' 
                      : 'border-gray-200 hover:border-[#1F3A18]/40'
                  }`}
                >
                  <strong className="block text-sm text-[#1F3A18]">Bakehouse Pickup</strong>
                  <span className="text-xs text-gray-500">Indiranagar Store, Bengaluru (Free)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`p-4 rounded-xl text-left border font-poppins transition-all cursor-pointer ${
                    deliveryMethod === 'delivery' 
                      ? 'border-[#1F3A18] bg-cream/40 ring-1 ring-[#1F3A18]' 
                      : 'border-gray-200 hover:border-[#1F3A18]/40'
                  }`}
                >
                  <strong className="block text-sm text-[#1F3A18]">Doorstep Delivery</strong>
                  <span className="text-xs text-gray-500">Morning courier box (₹50)</span>
                </button>
              </div>

              {deliveryMethod === 'delivery' && (
                <div className="pt-3 border-t border-gray-100 space-y-3 font-poppins text-xs sm:text-sm">
                  <div>
                    <label className="block text-[#1F3A18] font-medium mb-1">Street Address</label>
                    <input 
                      type="text" 
                      value={address.line1} 
                      onChange={(e) => setAddress({...address, line1: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg bg-cream/40 border border-[#1F3A18]/20 focus:outline-none focus:ring-2 focus:ring-[#1F3A18]" 
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[#1F3A18] font-medium mb-1">City</label>
                      <input 
                        type="text" 
                        value={address.city} 
                        onChange={(e) => setAddress({...address, city: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg bg-cream/40 border border-[#1F3A18]/20 focus:outline-none focus:ring-2 focus:ring-[#1F3A18]" 
                      />
                    </div>
                    <div>
                      <label className="block text-[#1F3A18] font-medium mb-1">State</label>
                      <input 
                        type="text" 
                        value={address.state} 
                        onChange={(e) => setAddress({...address, state: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg bg-cream/40 border border-[#1F3A18]/20 focus:outline-none focus:ring-2 focus:ring-[#1F3A18]" 
                      />
                    </div>
                    <div>
                      <label className="block text-[#1F3A18] font-medium mb-1">PIN Code</label>
                      <input 
                        type="text" 
                        value={address.postal_code} 
                        onChange={(e) => setAddress({...address, postal_code: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg bg-cream/40 border border-[#1F3A18]/20 focus:outline-none focus:ring-2 focus:ring-[#1F3A18]" 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Loyalty Points Redemption Widget (02-design.md Section 7.4) */}
            <div className="bg-[#1F3A18] text-cream rounded-2xl p-6 shadow-xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cream" />
                  <h4 className="font-playfair text-lg font-bold text-white">Loyalty Points Redemption</h4>
                </div>
                <span className="text-xs font-poppins font-semibold px-2.5 py-1 bg-white/10 rounded-full text-cream">
                  Balance: {userPoints} pts (Worth ₹{userPoints})
                </span>
              </div>

              <p className="font-poppins text-xs text-white/80 leading-relaxed">
                Apply your available points for an instant discount (1 pt = ₹1 discount, capped at 50% order value).
              </p>

              <div className="space-y-2 font-poppins text-xs">
                <div className="flex justify-between text-white/80">
                  <span>Redeem: <strong>{redeemPoints} points</strong></span>
                  <span>Instant Discount: <strong className="text-cream">-₹{pointsDiscount}</strong></span>
                </div>
                <input 
                  type="range" 
                  min={0} 
                  max={maxRedeemablePoints} 
                  step={5}
                  value={redeemPoints} 
                  onChange={(e) => setRedeemPoints(Number(e.target.value))}
                  className="w-full accent-[#F1E4A6] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-white/50">
                  <span>0 pts (₹0)</span>
                  <span>Max Allowable: {maxRedeemablePoints} pts (-₹{maxRedeemablePoints})</span>
                </div>
              </div>
            </div>

            {/* Indian Payment Options: UPI / Cards */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#1F3A18]/10 space-y-4">
              <h3 className="font-playfair text-xl font-bold text-[#1F3A18]">Payment Method</h3>
              
              <div className="grid grid-cols-2 gap-3 font-poppins text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentType('upi')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                    paymentType === 'upi' ? 'border-[#1F3A18] bg-cream/40 ring-1 ring-[#1F3A18]' : 'border-gray-200'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-[#1F3A18]" />
                  <span className="font-semibold text-[#1F3A18]">UPI (GPay, PhonePe, Paytm)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentType('card')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                    paymentType === 'card' ? 'border-[#1F3A18] bg-cream/40 ring-1 ring-[#1F3A18]' : 'border-gray-200'
                  }`}
                >
                  <span className="font-semibold text-[#1F3A18]">Credit / Debit Card / NetBanking</span>
                </button>
              </div>

              {paymentType === 'upi' ? (
                <div className="space-y-2 font-poppins text-xs">
                  <label className="block text-[#1F3A18] font-medium">Virtual Payment Address (VPA / UPI ID)</label>
                  <input type="text" defaultValue="customer@okhdfcbank" className="w-full px-4 py-2.5 rounded-lg bg-cream/40 border border-[#1F3A18]/20 focus:outline-none focus:ring-2 focus:ring-[#1F3A18]" />
                  <p className="text-[11px] text-gray-500">A payment collect request will be pushed to your UPI app.</p>
                </div>
              ) : (
                <div className="space-y-3 font-poppins text-xs">
                  <div>
                    <label className="block text-[#1F3A18] font-medium mb-1">Card Number</label>
                    <input type="text" defaultValue="•••• •••• •••• 4242" className="w-full px-4 py-2 rounded-lg bg-cream/40 border border-[#1F3A18]/20 focus:outline-none focus:ring-2 focus:ring-[#1F3A18]" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#1F3A18] font-medium mb-1">Valid Thru</label>
                      <input type="text" defaultValue="12/28" className="w-full px-4 py-2 rounded-lg bg-cream/40 border border-[#1F3A18]/20 focus:outline-none focus:ring-2 focus:ring-[#1F3A18]" />
                    </div>
                    <div>
                      <label className="block text-[#1F3A18] font-medium mb-1">CVV</label>
                      <input type="text" defaultValue="888" className="w-full px-4 py-2 rounded-lg bg-cream/40 border border-[#1F3A18]/20 focus:outline-none focus:ring-2 focus:ring-[#1F3A18]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#1F3A18]/10 space-y-6">
            <h3 className="font-playfair text-2xl font-bold text-[#1F3A18] border-b pb-4">
              Order Summary
            </h3>

            {/* Items List */}
            <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.item.id} className="flex items-center justify-between text-xs font-poppins">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-cream/50 shrink-0">
                      <img src={item.item.image_urls?.[0]} alt={item.item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <strong className="text-[#1F3A18] block">{item.item.name}</strong>
                      <span className="text-gray-500">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-semibold text-[#1F3A18]">
                    ₹{(item.item.price * item.quantity).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="pt-4 border-t space-y-2 font-poppins text-xs sm:text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (5%)</span>
                <span>₹{gst.toFixed(0)}</span>
              </div>
              {pointsDiscount > 0 && (
                <div className="flex justify-between text-[#1F3A18] font-medium">
                  <span>Loyalty Discount ({redeemPoints} pts)</span>
                  <span>-₹{pointsDiscount.toFixed(0)}</span>
                </div>
              )}
              {deliveryMethod === 'delivery' && (
                <div className="flex justify-between text-gray-600">
                  <span>Doorstep Courier Delivery</span>
                  <span>₹50</span>
                </div>
              )}
              <div className="flex justify-between text-base sm:text-lg font-bold text-[#1F3A18] pt-3 border-t">
                <span>Total Payable</span>
                <span>₹{finalTotal.toFixed(0)}</span>
              </div>
            </div>

            <Button 
              size="lg" 
              variant="primary" 
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full shadow-md"
            >
              {isProcessing ? "Processing Payment..." : `Pay ₹${finalTotal.toFixed(0)} Securely`}
            </Button>

            <p className="font-poppins text-[10px] text-center text-gray-400">
              Payments are 100% secure via Razorpay / UPI sandbox. GST invoice issued automatically.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
