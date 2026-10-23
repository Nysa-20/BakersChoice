import { useAuthStore } from '../store/authStore';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { Download, CheckCircle2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AccountPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const points = user?.points_balance ?? 150;

  const mockOrders = [
    {
      id: "BC-IN-938210",
      date: "Oct 22, 2026",
      status: "Fulfilled",
      total: 1280.00,
      pointsEarned: 12,
      items: [
        { name: "Belgian Dark Truffle Cake (Eggless)", qty: 1, price: 950.00 },
        { name: "Cardamom & Saffron Mawa Cake", qty: 1, price: 320.00 }
      ]
    },
    {
      id: "BC-IN-827192",
      date: "Oct 15, 2026",
      status: "Fulfilled",
      total: 580.00,
      pointsEarned: 5,
      items: [
        { name: "Country Sourdough Loaf", qty: 1, price: 280.00 },
        { name: "Classic Butter Croissant", qty: 1, price: 180.00 },
        { name: "Brioche Sourdough Pav (Pack of 6)", qty: 1, price: 120.00 }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-cream py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-5xl space-y-12">
        
        {/* Profile Header with StatCard for Points (02-design.md Section 7.5) */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-[#1F3A18]/10 flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#1F3A18] text-cream flex items-center justify-center font-playfair text-2xl font-bold shadow-md">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div className="space-y-1">
              <span className="font-poppins text-xs uppercase tracking-widest text-[#1F3A18] font-semibold">
                Member Profile
              </span>
              <h1 className="font-playfair text-3xl font-bold text-[#1F3A18]">
                {user?.name || "Ananya Sharma"}
              </h1>
              <p className="font-poppins text-xs text-gray-500">
                {user?.email || "ananya.sharma@example.com"}
              </p>
            </div>
          </div>

          {/* Points Balance displayed as a Stat-Card-style badge */}
          <div className="flex items-center gap-4">
            <StatCard number={String(points)} label="Available Loyalty Points" />
            <button 
              onClick={handleLogout}
              className="p-3 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Loyalty Points Perks Strip */}
        <div className="bg-[#1F3A18] text-cream rounded-2xl p-6 shadow-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-poppins text-xs sm:text-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-playfair text-lg text-white font-bold">Patron Rewards Tier: Gold Member</h3>
            <p className="text-white/80">Every ₹100 spent earns 1 loyalty point. 1 point = ₹1 discount on any future checkout.</p>
          </div>
          <span className="px-4 py-2 bg-cream text-[#1F3A18] font-bold rounded-lg shrink-0">
            Reward Wallet: ₹{points}
          </span>
        </div>

        {/* Order History Table */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#1F3A18]">
              Past Orders & GST Tax Invoices
            </h2>
            <span className="font-poppins text-xs text-gray-500">
              Showing {mockOrders.length} transactions
            </span>
          </div>

          <div className="space-y-4">
            {mockOrders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-2xl p-6 shadow-sm border border-[#1F3A18]/10 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                  <div className="space-y-0.5">
                    <span className="font-poppins text-xs font-semibold text-[#1F3A18]">
                      Order #{order.id}
                    </span>
                    <p className="font-poppins text-xs text-gray-400">Placed on {order.date}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-poppins font-medium bg-green-50 text-green-700 border border-green-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {order.status}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1.5 text-xs"
                      onClick={() => alert(`Downloading GST Invoice PDF for Order ${order.id}...`)}
                    >
                      <Download className="w-3.5 h-3.5" /> GST Invoice PDF
                    </Button>
                  </div>
                </div>

                {/* Items in order */}
                <div className="space-y-2 font-poppins text-xs sm:text-sm">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-gray-700">
                      <span>{item.qty}x {item.name}</span>
                      <span className="font-medium text-[#1F3A18]">₹{item.price.toFixed(0)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t flex justify-between items-center font-poppins text-xs">
                  <span className="text-gray-500">
                    Earned <strong className="text-[#1F3A18]">+{order.pointsEarned} loyalty points</strong>
                  </span>
                  <div className="text-sm font-bold text-[#1F3A18]">
                    Total Paid: ₹{order.total.toFixed(0)}
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
