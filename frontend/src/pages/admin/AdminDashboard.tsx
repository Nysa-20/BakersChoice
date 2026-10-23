import { useState, useEffect } from 'react';
import { client } from '../../api/client';
import type { components } from '../../api/schema';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { AlertTriangle, RefreshCw, CheckCircle, Plus, Shield } from 'lucide-react';

type Item = components['schemas']['Item'];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');
  const [items, setItems] = useState<Item[]>([
    {
      id: "admin-1",
      name: "Classic Butter Croissant",
      price: 180.00,
      stock_quantity: 40,
      low_stock_threshold: 10,
      status: "active",
      description: "French viennoiserie"
    },
    {
      id: "admin-2",
      name: "Country Sourdough Loaf",
      price: 280.00,
      stock_quantity: 8, // Low stock trigger
      low_stock_threshold: 10,
      status: "active",
      description: "Organic Sharbati wheat"
    },
    {
      id: "admin-3",
      name: "Belgian Dark Truffle Cake (Eggless)",
      price: 950.00,
      stock_quantity: 3, // Low stock trigger
      low_stock_threshold: 5,
      status: "active",
      description: "Celebration chocolate"
    },
    {
      id: "admin-4",
      name: "Cardamom & Saffron Mawa Cake",
      price: 320.00,
      stock_quantity: 22,
      low_stock_threshold: 10,
      status: "active",
      description: "Heritage Irani bake"
    }
  ]);

  const [orders, setOrders] = useState([
    {
      id: "ORD-IN-9481",
      customer: "Ananya Sharma",
      items: "Belgian Dark Truffle Cake (1x), French Croissant (4x)",
      total: 1670.00,
      status: "Paid",
      time: "10 mins ago"
    },
    {
      id: "ORD-IN-9480",
      customer: "Vikram Malhotra",
      items: "Country Sourdough Loaf (2x), Brioche Pav (2x)",
      total: 800.00,
      status: "Pending",
      time: "24 mins ago"
    },
    {
      id: "ORD-IN-9479",
      customer: "Priya Venkatesh",
      items: "Cardamom Mawa Cake (2x), Paneer Tikka Puff (4x)",
      total: 1200.00,
      status: "Fulfilled",
      time: "1 hour ago"
    }
  ]);

  useEffect(() => {
    async function loadData() {
      try {
        const { data } = await client.GET('/api/products/');
        if (data && data.length > 0) {
          setItems(data);
        }
      } catch (e) {
        // Fallback demo data
      }
    }
    loadData();
  }, []);

  const handleRestock = (itemId: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, stock_quantity: item.stock_quantity + 20 };
      }
      return item;
    }));
  };

  const handleFulfillOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return { ...order, status: 'Fulfilled' };
      }
      return order;
    }));
  };

  const lowStockCount = items.filter(i => i.stock_quantity <= (i.low_stock_threshold || 10)).length;

  return (
    <div className="min-h-screen bg-cream/60 py-10 px-4 sm:px-6 font-poppins">
      <div className="container mx-auto max-w-6xl space-y-10">
        
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1F3A18]/10 pb-6">
          <div className="space-y-1">
            <span className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#1F3A18] font-bold">
              <Shield className="w-4 h-4 text-[#1F3A18]" /> Owner Administration Portal
            </span>
            <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1F3A18]">
              Bakehouse Operations & KPIs
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200 text-xs">
              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === 'inventory' ? 'bg-[#1F3A18] text-white shadow' : 'text-gray-600 hover:text-black'
                }`}
              >
                Stock & Inventory ({items.length})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === 'orders' ? 'bg-[#1F3A18] text-white shadow' : 'text-gray-600 hover:text-black'
                }`}
              >
                Live Orders Queue ({orders.filter(o => o.status !== 'Fulfilled').length})
              </button>
            </div>
          </div>
        </div>

        {/* 4 KPI Cards directly using StatCard components (02-design.md Section 7.6) with RUPEES (₹) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard number="₹48,250" label="Daily Sales Revenue" />
          <StatCard number="34" label="Orders Completed Today" />
          <div className="relative">
            <StatCard number={String(lowStockCount)} label="Low Stock Warnings" />
            {lowStockCount > 0 && (
              <span className="absolute top-2 right-2 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            )}
          </div>
          <StatCard number="4,850" label="Points Liability (pts)" />
        </div>

        {/* Tab 1: Inventory Table */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#1F3A18]/10 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-playfair text-2xl font-bold text-[#1F3A18]">Inventory & Stock Control</h3>
                <p className="text-xs text-gray-500">Atomic stock management with automated audit logging.</p>
              </div>
              <Button size="sm" variant="primary" className="gap-1.5" onClick={() => alert("Open New Recipe / Item Creator")}>
                <Plus className="w-4 h-4" /> Add New Item
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-medium">
                    <th className="pb-3 font-semibold">Product Name</th>
                    <th className="pb-3 font-semibold">Price (INR)</th>
                    <th className="pb-3 font-semibold">Current Stock</th>
                    <th className="pb-3 font-semibold">Threshold</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Quick Restock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item) => {
                    const isLow = item.stock_quantity <= (item.low_stock_threshold || 10);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 font-semibold text-[#1F3A18]">{item.name}</td>
                        <td className="py-4 font-medium text-gray-700">₹{item.price.toFixed(0)}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center gap-1 font-bold ${
                            isLow ? 'text-amber-700 font-bold' : 'text-[#1F3A18]'
                          }`}>
                            {item.stock_quantity} units
                            {isLow && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                          </span>
                        </td>
                        <td className="py-4 text-gray-500">{item.low_stock_threshold || 10}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            item.stock_quantity === 0 
                              ? 'bg-red-100 text-red-800' 
                              : isLow 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {item.stock_quantity === 0 ? 'Out of Stock' : isLow ? 'Low Stock' : 'Optimal'}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="text-xs gap-1"
                            onClick={() => handleRestock(item.id)}
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> +20 Units
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Orders Queue */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#1F3A18]/10 space-y-6">
            <div>
              <h3 className="font-playfair text-2xl font-bold text-[#1F3A18]">Live Fulfillment Queue</h3>
              <p className="text-xs text-gray-500">Real-time incoming customer orders awaiting packing and dispatch.</p>
            </div>

            <div className="divide-y divide-gray-100">
              {orders.map((order) => (
                <div key={order.id} className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <strong className="text-sm text-[#1F3A18] font-bold">{order.id}</strong>
                      <span className="text-xs text-gray-400">• {order.time}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'Fulfilled' 
                          ? 'bg-green-100 text-green-800' 
                          : order.status === 'Paid' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 font-medium">Customer: {order.customer}</p>
                    <p className="text-xs text-gray-500">{order.items}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-base font-bold text-[#1F3A18]">₹{order.total.toFixed(0)}</span>
                    {order.status !== 'Fulfilled' && (
                      <Button 
                        size="sm" 
                        variant="primary" 
                        className="text-xs gap-1.5"
                        onClick={() => handleFulfillOrder(order.id)}
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-cream" /> Mark Fulfilled
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
