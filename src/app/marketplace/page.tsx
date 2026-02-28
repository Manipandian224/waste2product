
"use client"

import { useState, useMemo } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart,
  Search,
  Leaf,
  Zap,
  Tag,
  Trash2,
  Plus,
  Minus,
  Factory
} from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CATEGORIES = [
  "All", "Textile", "Organic", "Temple Products", "Home Decor", "Plastic"
];

const PRODUCTS = [
  { id: 1, name: "Banana Fiber Tote Bag", category: "Textile", recycledPercentage: 100, credits: 280, price: 350, wasteSource: "Banana Tree pseudo-stem", image: "tn-banana-fiber-bag" },
  { id: 2, name: "Palm Leaf Basket", category: "Organic", recycledPercentage: 100, credits: 150, price: 299, wasteSource: "Panai Olai Leaves", image: "tn-palm-leaf-basket" },
  { id: 3, name: "Upcycled Silk Saree Cushion", category: "Home Decor", recycledPercentage: 90, credits: 500, price: 899, wasteSource: "Kanjivaram Zari Waste", image: "tn-silk-saree-cushion" },
  { id: 4, name: "Coir Floor Mat", category: "Home Decor", recycledPercentage: 100, credits: 200, price: 450, wasteSource: "Coconut Husk", image: "tn-coir-floor-mat" },
  { id: 5, name: "Meenakshi Temple Incense", category: "Temple Products", recycledPercentage: 98, credits: 120, price: 99, wasteSource: "Recycled Marigold & Jasmine", image: "tn-temple-incense" },
  { id: 6, name: "Coconut Shell Artisan Bowl", category: "Organic", recycledPercentage: 100, credits: 300, price: 199, wasteSource: "Discarded Coconut Shells", image: "tn-coconut-bowl" },
  { id: 7, name: "Recycled Plastic Chair", category: "Plastic", recycledPercentage: 100, credits: 400, price: 799, wasteSource: "Mixed Plastic Containers", image: "hero-recycle" },
  { id: 8, name: "Plastic Cover Woven Bag", category: "Plastic", recycledPercentage: 100, credits: 250, price: 150, wasteSource: "Discarded Plastic Wrappers", image: "product-bag" },
  { id: 9, name: "Interlocking Eco Bricks", category: "Plastic", recycledPercentage: 95, credits: 150, price: 85, wasteSource: "Single-use Plastic Covers", image: "product-bottle" },
];

export default function MarketplacePage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState<{ product: typeof PRODUCTS[0]; quantity: number }[]>([]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast({
      title: "Added to cart",
      description: `${product.name} is now in your eco-basket.`,
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotalCredits = cart.reduce((sum, item) => sum + (item.product.credits * item.quantity), 0);
  const cartTotalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Header */}
      <header className="bg-primary/5 py-12 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-500">
              <h1 className="text-4xl md:text-5xl font-bold font-headline">Eco Marketplace</h1>
              <p className="text-muted-foreground text-lg">High-quality products curated from Madurai's recycled waste.</p>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="relative group p-4 h-auto rounded-2xl glass hover:bg-white/10 transition-all">
                  <ShoppingCart className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="glass border-l border-white/10 w-full sm:max-w-md flex flex-col">
                <SheetHeader>
                  <SheetTitle className="text-2xl font-headline flex items-center gap-2">
                    <ShoppingCart className="text-primary" /> Your Eco-Basket
                  </SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto py-6 space-y-4">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                        <ShoppingCart className="w-8 h-8" />
                      </div>
                      <p>Your basket is empty. Start shopping!</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.product.id} className="glass p-4 rounded-2xl flex gap-4 animate-in fade-in slide-in-from-right-4">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                          <Image
                            src={PlaceHolderImages.find(img => img.id === item.product.image)?.imageUrl || ''}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between">
                            <h4 className="font-bold text-sm leading-tight">{item.product.name}</h4>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeFromCart(item.product.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg glass" onClick={() => updateQuantity(item.product.id, -1)}>
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                              <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg glass" onClick={() => updateQuantity(item.product.id, 1)}>
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-bold text-primary flex items-center justify-end gap-1">
                                <Zap className="w-3 h-3 fill-current" /> {item.product.credits * item.quantity}
                              </p>
                              <p className="text-sm font-black">₹{item.product.price * item.quantity}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {cart.length > 0 && (
                  <SheetFooter className="border-t border-white/5 pt-6 flex-col gap-4">
                    <div className="w-full space-y-2">
                      <div className="flex justify-between text-muted-foreground text-sm uppercase tracking-wider font-bold">
                        <span>Total Credits</span>
                        <span className="text-primary flex items-center gap-1"><Zap className="w-3 h-3 fill-current" /> {cartTotalCredits}</span>
                      </div>
                      <div className="flex justify-between text-2xl font-black">
                        <span>Total Cash</span>
                        <span>₹{cartTotalPrice}</span>
                      </div>
                    </div>
                    <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-bold">
                      Checkout Sustainable
                    </Button>
                  </SheetFooter>
                )}
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search recycled goods..."
                className="pl-11 rounded-2xl glass border-white/10 h-12 focus:border-primary/50 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full lg:w-auto">
              <TabsList className="glass border-white/10 h-12 p-1 rounded-2xl flex overflow-x-auto lg:overflow-visible">
                {CATEGORIES.map(cat => (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    className="rounded-xl px-4 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all text-xs font-bold whitespace-nowrap"
                  >
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group glass rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-300 border-none shadow-xl flex flex-col animate-in fade-in zoom-in duration-500"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={PlaceHolderImages.find(img => img.id === product.image)?.imageUrl || ''}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <Badge className="bg-primary/90 text-white border-none backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {product.recycledPercentage}% Recycled
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <Badge variant="outline" className="glass border-white/20 text-white rounded-full bg-black/30 backdrop-blur-sm">
                      <Leaf className="w-3 h-3 mr-1 text-primary" /> {product.wasteSource}
                    </Badge>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col space-y-3">
                  <div className="space-y-1">
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{product.category}</p>
                    <h3 className="text-lg font-bold font-headline leading-tight line-clamp-1">{product.name}</h3>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium italic">
                    <Factory className="w-3 h-3" /> Made from Madurai Recycled Waste
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Price</p>
                      <p className="text-xl font-black">₹{product.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Credits</p>
                      <p className="text-xl font-black text-primary flex items-center justify-end gap-1">
                        <Zap className="w-4 h-4 fill-current" /> {product.credits}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button
                      onClick={() => addToCart(product)}
                      variant="outline"
                      className="rounded-xl border-primary/20 hover:bg-primary/10 text-xs font-bold glass"
                    >
                      Add to Cart
                    </Button>
                    <Button
                      onClick={() => addToCart(product)}
                      className="rounded-xl bg-primary hover:bg-primary/90 text-xs font-bold"
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4 opacity-50">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <p className="text-xl">No products found matching your criteria.</p>
              <Button variant="link" onClick={() => { setSearch(''); setActiveCategory('All'); }}>Clear all filters</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
