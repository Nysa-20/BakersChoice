import { useEffect, useState } from 'react';
import { client } from '../api/client';
import type { components } from '../api/schema';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../store/cartStore';
import { ShoppingCart } from 'lucide-react';

type Item = components['schemas']['Item'];

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([]);
  const { addItem } = useCartStore();

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await client.GET('/api/products/');
      if (data) setItems(data);
    }
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-cream py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-deep-green">
            Artisanal Bakes, Delivered Daily.
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-poppins">
            Experience the finest pastries and bread made with organic ingredients and a whole lot of love.
          </p>
          <Button size="lg">Explore Menu</Button>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="font-playfair text-3xl font-bold text-deep-green mb-8 text-center">Our Offerings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((item) => (
              <div key={item.id} className="group relative border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-100 flex items-center justify-center p-6">
                  {item.image_urls?.[0] ? (
                    <img src={item.image_urls[0]} alt={item.name} className="object-cover w-full h-full rounded-md" />
                  ) : (
                    <div className="text-4xl text-gray-300 font-playfair">BC</div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg text-gray-900">{item.name}</h3>
                    <span className="font-semibold text-deep-green">${item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                  
                  <div className="pt-4 flex items-center justify-between">
                    <span className="text-xs font-medium px-2 py-1 bg-cream text-deep-green rounded-full">
                      {item.stock_quantity > 0 ? `${item.stock_quantity} left` : 'Out of stock'}
                    </span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      disabled={item.stock_quantity === 0}
                      onClick={() => addItem(item)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
