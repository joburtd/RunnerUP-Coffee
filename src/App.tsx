/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  ShoppingBag, 
  Menu as MenuIcon, 
  X, 
  ArrowRight, 
  MapPin, 
  Mail, 
  Instagram, 
  Facebook, 
  ChevronDown,
  Check,
  Droplets
} from 'lucide-react';

const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="relative w-8 h-8 flex items-center justify-center">
      <img 
        src="/src/logo.png" 
        alt="RunnerUp Coffee Logo" 
        className="w-full h-full object-contain"
        referrerPolicy="no-referrer"
      />
    </div>
    <span className="font-serif text-xl tracking-widest hidden sm:block">RunnerUp Coffee</span>
  </div>
);

const Button = ({ children, variant = 'primary', className = "", ...props }: any) => {
  const baseStyles = "px-8 py-4 font-medium transition-all duration-300 sharp-corners uppercase tracking-widest text-sm inline-flex items-center justify-center";
  const variants: any = {
    primary: "bg-cream text-navy hover:bg-navy hover:text-cream border border-cream",
    secondary: "bg-transparent text-cream border border-cream hover:bg-cream hover:text-navy",
    outline: "border border-cream text-cream hover:bg-cream hover:text-navy"
  };
  
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const SectionHeading = ({ eyebrow, title, light = false }: any) => (
  <div className="mb-12">
    <span className={`text-xs font-medium tracking-[0.2em] uppercase ${light ? 'text-navy/60' : 'text-cream/60'}`}>{eyebrow}</span>
    <h2 className={`text-4xl md:text-5xl font-serif mt-2 ${light ? 'text-navy' : 'text-cream'}`}>{title}</h2>
  </div>
);

const FadeIn = ({ children, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.21, 0.45, 0.32, 0.9] }}
  >
    {children}
  </motion.div>
);

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('hot');
  const [bannerVisible, setBannerVisible] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const checkout = () => {
    setOrderComplete(true);
    setCart([]);
    setTimeout(() => {
      setOrderComplete(false);
      setIsCartOpen(false);
    }, 3000);
  };

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const bannerTimer = setTimeout(() => setBannerVisible(true), 3000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(bannerTimer);
    };
  }, []);

  const menuItems: any = {
    hot: [
      { id: 'h1', name: "Espresso", price: 120, desc: "Double shot, extracted at 9 bar pressure" },
      { id: 'h2', name: "Cortado", price: 150, desc: "Equal parts espresso and warm milk" },
      { id: 'h3', name: "Flat White", price: 180, desc: "Ristretto shots with velvety microfoam" },
      { id: 'h4', name: "Pour Over (V60)", price: 220, desc: "Single origin, brewed to order, 4 min steep" },
      { id: 'h5', name: "Chemex", price: 240, desc: "Clean, bright cup — 6-cup batch brew" },
      { id: 'h6', name: "Latte", price: 170, desc: "Espresso, steamed milk, light foam" },
    ],
    cold: [
      { id: 'c1', name: "Cold Brew", price: 180, desc: "18-hour steep, smooth and low-acid" },
      { id: 'c2', name: "Iced Latte", price: 175, desc: "Espresso over ice with fresh cold milk" },
      { id: 'c3', name: "Nitro Cold Brew", price: 200, desc: "Cold brew on nitrogen tap, creamy finish" },
      { id: 'c4', name: "Iced Pour Over", price: 220, desc: "Flash-brewed V60 over ice" },
    ],
    filter: [
      { id: 'f1', name: "Weekly Single Origin", price: 190, desc: "Ask our barista for today's featured origin" },
      { id: 'f2', name: "Batch Brew", price: 120, desc: "Our house filter, always fresh" },
      { id: 'f3', name: "AeroPress", price: 200, desc: "Full immersion, rich and complex" },
    ],
    food: [
      { id: 'ff1', name: "Banana Walnut Loaf", price: 95, desc: "Baked in-house, pairs with any filter coffee" },
      { id: 'ff2', name: "Dark Chocolate Brownie", price: 110, desc: "Dense, fudgy, 70% dark chocolate" },
      { id: 'ff3', name: "Cheese Croissant", price: 130, desc: "Buttery, flaky, baked fresh daily" },
    ]
  };

  return (
    <div className="relative overflow-hidden selection:bg-cream selection:text-navy">
      {/* 1. TOP BANNER */}
      <AnimatePresence>
        {bannerVisible && (
          <motion.div 
            initial={{ y: -100 }} 
            animate={{ y: 0 }} 
            exit={{ y: -100 }}
            className="fixed top-[70px] left-0 w-full z-30 bg-cream-light text-navy py-1.5 px-4 text-center text-[11px] font-bold tracking-widest flex items-center justify-center gap-4"
          >
            <span>🫗 NEW ARRIVAL: ETHIOPIA GUJI NATURAL — LIMITED STOCK AVAILABLE</span>
            <button onClick={() => setBannerVisible(false)} className="hover:rotate-90 transition-transform">
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. STICKY NAV */}
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b h-[70px] flex items-center ${
          navScrolled ? 'bg-navy/95 border-cream/20 shadow-xl backdrop-blur-md' : 'bg-navy border-cream/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#hero" className="z-50"><Logo /></a>
          
          <div className="hidden md:flex items-center gap-8">
            {['Our Story', 'Menu', 'Brew Guides', 'Find Us'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(' ', '-')}`} 
                className="text-xs uppercase tracking-widest hover:text-cream-light font-medium"
              >
                {item}
              </a>
            ))}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-cream/10 transition-colors border border-cream/20 sharp-corners flex items-center gap-2 group"
            >
              <ShoppingBag size={16} />
              <span className="text-[10px] bg-cream text-navy px-1.5 py-0.5 font-bold">{cartCount}</span>
            </button>
          </div>

          <button className="md:hidden z-50 p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="text-cream" /> : <MenuIcon className="text-cream" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.5 }}
              className="fixed inset-0 bg-navy z-40 flex flex-col items-center justify-center gap-8"
            >
              {['Our Story', 'Menu', 'Brew Guides', 'Wholesale', 'Find Us', 'Shop'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-3xl font-serif hover:text-cream-light"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 2. HERO SECTION */}
      <header id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden pt-[70px]">
        {/* CSS Radial Gradient & Dot Pattern moved to body in index.css */}
        <div className="absolute inset-0 bg-navy opacity-50 z-0"></div>

        <div className="relative z-10 text-center max-w-4xl">
          <motion.span 
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, letterSpacing: '0.2em' }}
            transition={{ duration: 1.2 }}
            className="text-xs font-medium uppercase tracking-[0.2em] mb-6 block text-cream/70"
          >
            Specialty Coffee
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-8xl font-serif font-black mb-8 leading-[1.1]"
          >
            Coffee Worth<br />Slowing Down For.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg md:text-xl text-cream/60 max-w-2xl mx-auto mb-12 font-light"
          >
            Single-origin. Carefully sourced. Brewed with intention.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button>Explore Our Menu</Button>
            <Button variant="outline">Our Brew Story</Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-20 pt-10 border-t border-cream/10 flex items-center justify-center gap-8 md:gap-16 text-xs uppercase tracking-widest text-cream/40"
          >
            <span>12+ Origins</span>
            <span>Roasted Weekly</span>
            <span>Est. 2019</span>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center">
          <ChevronDown size={24} className="text-cream/30" />
        </div>
      </header>

      {/* 3. MARQUEE */}
      <section className="bg-cream py-6 overflow-hidden border-y border-navy flex items-center">
        <div className="animate-marquee">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-12 items-center text-navy font-serif italic text-xl md:text-2xl px-6">
              <span>Single Origin Beans</span>
              <span>·</span>
              <span>Ethically Sourced</span>
              <span>·</span>
              <span>Weekly Fresh Roasts</span>
              <span>·</span>
              <span>Pour Over Specialists</span>
              <span>·</span>
              <span>Cold Brew on Tap</span>
              <span>·</span>
              <span>Barista Training Available</span>
              <span>·</span>
              <span>Wholesale Inquiries Welcome</span>
              <span>·</span>
              <span>Specialty Coffee</span>
              <span>·</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. OUR STORY */}
      <section id="our-story" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <FadeIn>
            <SectionHeading eyebrow="Who We Are" title="Not Second Place. Just Running Toward Something Better." />
            <div className="space-y-6 text-cream/70 font-light leading-relaxed max-w-xl">
              <p>
                RunnerUp Coffee was born from a love of the pursuit — the journey of finding the perfect cup. We believe that coffee isn't a race to the finish, but a series of moments that allow us to reflect, recalibrate, and appreciate the craftsmanship of the producer.
              </p>
              <p>
                The name reflects our relentless drive to improve, explore new origins, and never settle for being "good enough." Every batch we roast and every cup we brew is a testament to this pursuit of excellence.
              </p>
              <p>
                Built for coffee lovers who take their mornings seriously and their origin notes specifically. Welcome to the chase.
              </p>
              <a href="#" className="inline-flex items-center gap-2 group text-cream font-medium tracking-wider text-sm mt-4">
                READ OUR FULL STORY 
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                <div className="absolute left-0 bottom-0 w-0 h-px bg-cream transition-all duration-300 group-hover:w-full"></div>
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="relative aspect-square border border-cream/20 bg-navy-dark p-8 overflow-hidden group">
               {/* CSS Art: Gooseneck kettle */}
               <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute w-[60%] h-[60%] border-l-4 border-b-4 border-r-4 border-cream rounded-b-[40%]"></div>
                  <div className="absolute top-[20%] left-[20%] w-[60%] h-4 bg-cream"></div>
                  <div className="absolute top-[20%] left-[20%] w-4 h-[60%] bg-cream"></div>
                  {/* Spout */}
                  <div className="absolute top-[25%] -right-8 w-24 h-4 bg-cream -rotate-45 origin-left"></div>
                  <div className="absolute top-[5%] -right-12 w-4 h-20 border-r-4 border-t-4 border-cream rounded-tr-3xl"></div>
                  {/* Handle */}
                  <div className="absolute top-[30%] -left-12 w-16 h-32 border-l-4 border-y-4 border-cream rounded-l-full"></div>
                  {/* Cup below */}
                  <div className="absolute bottom-[2%] w-32 h-20 border-b-4 border-x-4 border-cream rounded-b-xl">
                    <div className="absolute -right-8 top-4 w-10 h-10 border-r-4 border-y-4 border-cream rounded-r-full"></div>
                  </div>
                  {/* Abstract Drip */}
                  <motion.div 
                    animate={{ y: [0, 40, 0], opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute top-[40%] right-[10%] w-1 h-8 bg-cream/40"
                  />
               </div>
               <div className="absolute inset-0 bg-cream/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 5. MENU */}
      <section id="menu" className="py-24 bg-navy-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <SectionHeading eyebrow="What We Serve" title="The Menu" />
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-12 bg-navy border border-cream/10 p-2 inline-flex w-full md:w-auto">
              {Object.keys(menuItems).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-xs uppercase tracking-widest font-medium transition-all ${
                    activeTab === tab ? 'bg-cream text-navy' : 'hover:bg-cream/5 text-cream/60'
                  }`}
                >
                  {tab.replace('food', 'food pairings').replace('hot', 'hot drinks').replace('cold', 'cold drinks').replace('filter', 'filter coffee')}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="grid md:grid-cols-2 gap-x-16 gap-y-10"
            >
              {(menuItems as any)[activeTab].map((item: any, idx: number) => (
                <div key={idx} className="group cursor-default py-4 border-l-0 hover:border-l-4 hover:border-cream hover:pl-6 transition-all duration-300 bg-navy/20 p-4 border border-cream/5">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-serif text-xl font-bold group-hover:text-cream-light">{item.name}</h4>
                    <span className="text-cream/80 font-medium">₱{item.price}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-grow h-px bg-cream/10 group-hover:bg-cream/30"></div>
                  </div>
                  <p className="text-xs text-cream/40 mt-2 uppercase tracking-wide mb-4">{item.desc}</p>
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-full py-2 bg-transparent border border-cream/20 text-[10px] uppercase tracking-[0.2em] hover:bg-cream hover:text-navy transition-all duration-300 font-bold"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* 6. ORIGINS */}
      <section id="origins" className="py-24 bg-navy px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <SectionHeading eyebrow="Where It Begins" title="From Seed to Cup — We Know Every Farm." />
          
          <div className="flex overflow-x-auto pb-8 gap-8 snap-x no-scrollbar md:grid md:grid-cols-4 md:overflow-visible">
            {[
              { flag: "🇪🇹", country: "Ethiopia", region: "Yirgacheffe", notes: ["Blueberry", "Jasmine", "Citrus"], process: "Washed" },
              { flag: "🇨🇴", country: "Colombia", region: "Huila", notes: ["Caramel", "Red Apple", "Almond"], process: "Natural" },
              { flag: "🇯🇵", country: "Japan", region: "Kyoto Blend", notes: ["Green Tea", "Peach", "Light"], process: "Anaerobic" },
              { flag: "🇰🇪", country: "Kenya", region: "Nyeri", notes: ["Blackcurrant", "Tomato", "Bold"], process: "Washed" },
            ].map((origin, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="snap-center min-w-[280px] border border-cream/10 p-8 hover:bg-navy-dark transition-colors h-full flex flex-col">
                  <div className="text-6xl mb-6">{origin.flag}</div>
                  <h3 className="font-serif text-2xl font-bold mb-1">{origin.country}</h3>
                  <p className="text-sm text-cream/40 uppercase tracking-widest mb-6">{origin.region}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {origin.notes.map(note => (
                      <span key={note} className="px-2 py-1 bg-cream/10 text-[10px] uppercase font-medium text-cream tracking-wider">
                        {note}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-cream/5 flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-widest text-cream/40">Process</span>
                    <span className="text-xs font-serif italic">{origin.process}</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BREW GUIDES */}
      <section id="brew-guides" className="py-24 bg-cream-light text-navy px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeading light eyebrow="Learn The Craft" title="How to Brew Like a Specialist" />
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: "V60", 
                type: "Droplets",
                name: "V60", 
                time: "4 min", 
                diff: "Intermediate",
                steps: ["Rinse filter with hot water", "Add 15g medium-fine ground coffee", "Bloom with 30ml water for 30s", "Pour water in slow spirals to 250ml"]
              },
              { 
                icon: "❄️", 
                type: "Ice",
                name: "Cold Brew", 
                time: "18 hrs", 
                diff: "Beginner",
                steps: ["Coarsely grind 100g coffee", "Combine with 1L cold filtered water", "Steep in fridge for 18 hours", "Strain through fine mesh and serve"]
              },
              { 
                icon: "🚀", 
                type: "Press",
                name: "AeroPress", 
                time: "2 min", 
                diff: "Advanced",
                steps: ["Add 15g medium-coarse grind", "Pour 200ml water at 85°C", "Stir and steep for 90 seconds", "Press slowly over 30 seconds"]
              }
            ].map((guide, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-white border border-navy/5 p-10 h-full flex flex-col group hover:shadow-2xl transition-all duration-500">
                  <div className="text-4xl mb-6 opacity-80 group-hover:scale-110 transition-transform origin-left">{guide.icon}</div>
                  <h3 className="font-serif text-3xl font-bold mb-6 italic">{guide.name}</h3>
                  
                  <div className="flex gap-4 mb-8">
                    <span className="px-3 py-1 bg-navy/5 text-[10px] uppercase font-bold tracking-widest">{guide.time}</span>
                    <span className="px-3 py-1 bg-navy/5 text-[10px] uppercase font-bold tracking-widest">{guide.diff}</span>
                  </div>

                  <ol className="space-y-4 mb-10 text-sm font-light leading-relaxed">
                    {guide.steps.map((step, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="font-serif font-bold italic text-navy/30">{idx + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>

                  <a href="#" className="mt-auto pt-6 border-t border-navy/10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                    View Full Guide <ArrowRight size={14} />
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 8. SHOP (BEANS) REDESIGNED AS PRODUCTS */}
      <section id="shop" className="py-24 bg-navy px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeading eyebrow="Take It Home" title="Shop Fresh Roasted Beans" />
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { id: 'b1', name: "Ethiopia Yirgacheffe", price: 580, wt: "250g", notes: ["Blueberry", "Jasmine", "Bright Citrus"], process: "Washed" },
              { id: 'b2', name: "Colombia Huila", price: 540, wt: "250g", notes: ["Caramel", "Red Apple", "Smooth"], process: "Natural" },
              { id: 'b3', name: "House Blend", price: 490, wt: "250g", notes: ["Chocolate", "Nuts", "Balanced"], process: "Mixed" }
            ].map((prod, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="border border-cream/10 p-10 flex flex-col h-full bg-navy/50 hover:bg-navy-dark transition-all duration-500 group">
                  <div className="flex justify-between items-start mb-8">
                    <span className="text-[10px] p-2 border border-cream/20 opacity-40 uppercase tracking-widest">{prod.wt}</span>
                    <span className="font-serif text-xl">₱{prod.price}</span>
                  </div>
                  
                  <h3 className="font-serif text-3xl font-bold mb-2 group-hover:text-cream-light transition-colors">{prod.name}</h3>
                  <p className="text-xs text-cream/40 uppercase tracking-widest mb-8">{prod.process} Process</p>

                  <div className="flex flex-wrap gap-2 mb-10">
                    {prod.notes.map(note => (
                      <span key={note} className="text-[10px] uppercase border border-cream/20 px-2 py-1 tracking-widest">{note}</span>
                    ))}
                  </div>

                  <Button className="w-full mt-auto" onClick={() => addToCart(prod)}>Add To Cart</Button>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FIND US */}
      <section id="find-us" className="py-24 bg-cream text-navy px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeading light eyebrow="Visit Us" title="Find a Cup Near You" />
          
          <div className="grid md:grid-cols-2 gap-12">
            {[
              { 
                name: "RunnerUp Coffee — BGC Flagship", 
                addr: "30th Street, Bonifacio Global City, Taguig, Metro Manila",
                hours: "Mon–Fri 7am–8pm | Sat–Sun 8am–7pm",
                features: "Dine-in · Takeaway · Retail Beans"
              },
              { 
                name: "RunnerUp Coffee — Poblacion", 
                addr: "Kalayaan Avenue, Poblacion, Makati City",
                hours: "Mon–Sun 8am–10pm",
                features: "Dine-in · Brew Bar · Late Night"
              }
            ].map((loc, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="border border-navy/10 p-10 bg-cream/30 flex flex-col h-full hover:bg-cream-light transition-colors duration-500">
                  <h3 className="font-serif text-2xl font-bold mb-4">{loc.name}</h3>
                  <div className="flex gap-4 items-start text-sm mb-6">
                    <MapPin size={24} className="shrink-0 mt-1" />
                    <p className="font-light">{loc.addr}</p>
                  </div>
                  <div className="text-xs uppercase tracking-widest font-bold mb-4 opacity-60">{loc.hours}</div>
                  <div className="text-xs italic mb-10 py-2 border-y border-navy/5">{loc.features}</div>
                  <a href="#" className="mt-auto inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:gap-4 transition-all">
                    Get Directions <ArrowRight size={14} />
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="mt-20 h-[400px] border border-navy/10 bg-navy relative overflow-hidden flex items-center justify-center">
             {/* Abstract CSS Map */}
             <div className="absolute inset-0 opacity-20" style={{ 
               backgroundImage: 'linear-gradient(#E8D5A3 1px, transparent 1px), linear-gradient(90deg, #E8D5A3 1px, transparent 1px)',
               backgroundSize: '40px 40px'
             }}></div>
             <div className="relative w-8 h-8 bg-cream animate-ping-slow rounded-full"></div>
             <div className="absolute top-[30%] left-[40%] w-4 h-4 bg-cream rotate-45"></div>
             <div className="absolute top-[60%] left-[70%] w-4 h-4 bg-cream rotate-45"></div>
             <span className="relative z-10 text-xs font-medium tracking-[0.3em] uppercase p-4 bg-navy/80 border border-cream/20">Satellite Preview Active</span>
          </div>
        </div>
      </section>

      {/* 10. SHOP */}
      <section id="shop" className="py-24 bg-navy-dark px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeading eyebrow="Take It Home" title="Shop Fresh Roasted Beans" />
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Ethiopia Yirgacheffe", wt: "250g", price: "₱580", notes: ["Blueberry", "Jasmine", "Bright Citrus"], process: "Washed" },
              { name: "Colombia Huila", wt: "250g", price: "₱540", notes: ["Caramel", "Red Apple", "Smooth"], process: "Natural" },
              { name: "House Blend", wt: "250g", price: "₱490", notes: ["Chocolate", "Nuts", "Balanced"], process: "Mixed" }
            ].map((prod, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="border border-cream/10 p-10 flex flex-col h-full bg-navy hover:shadow-[0_0_40px_rgba(232,213,163,0.05)] hover:bg-navy-dark transition-all duration-500 group">
                  <div className="flex justify-between items-start mb-8">
                    <span className="text-xs p-2 border border-cream/20 opacity-40 uppercase tracking-widest">{prod.wt}</span>
                    <span className="font-serif text-xl">{prod.price}</span>
                  </div>
                  
                  <h3 className="font-serif text-3xl font-bold mb-2 group-hover:text-cream-light transition-colors">{prod.name}</h3>
                  <p className="text-xs text-cream/40 uppercase tracking-widest mb-8">{prod.process} Process</p>

                  <div className="flex flex-wrap gap-2 mb-10">
                    {prod.notes.map(note => (
                      <span key={note} className="text-[10px] uppercase border border-cream/20 px-2 py-1 tracking-widest">{note}</span>
                    ))}
                  </div>

                  <div className="mb-10 space-y-4">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-cream/40">Grind Option</p>
                    <div className="flex flex-wrap gap-3">
                      {['Whole Bean', 'V60', 'Espresso', 'Cold Brew'].map(grind => (
                        <label key={grind} className="cursor-pointer">
                          <input type="radio" name={`grind-${i}`} className="hidden peer" defaultChecked={grind==='Whole Bean'} />
                          <span className="px-3 py-1.5 border border-cream/10 text-[10px] uppercase tracking-widest peer-checked:bg-cream peer-checked:text-navy hover:border-cream/40 transition-colors">
                            {grind}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full mt-auto">Add To Cart</Button>
                </div>
              </FadeIn>
            ))}
          </div>
          
          <p className="mt-12 text-center text-xs text-cream/40 uppercase tracking-[0.2em]">All beans roasted to order. Ships within 48 hours.</p>
        </div>
      </section>

      {/* 11. INSTAGRAM FEED */}
      <section className="py-24 bg-cream text-navy">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif italic mb-4">@runnerupcoffee</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-6 border border-navy/10 overflow-hidden">
            {[
              { type: 'art', content: <Droplets className="w-12 h-12 text-cream" /> },
              { type: 'text', content: "Single origin. Always." },
              { type: 'art', content: <div className="space-y-1"><div className="w-12 h-0.5 bg-cream"></div><div className="w-10 h-0.5 bg-cream"></div><div className="w-14 h-0.5 bg-cream"></div></div> },
              { type: 'text', content: "Roasted this week." },
              { type: 'art', content: <div className="w-12 h-12 border-2 border-cream rounded-full flex items-center justify-center p-2"><div className="w-full h-full bg-cream rounded-full"></div></div> },
              { type: 'text', content: "Come as you are." },
            ].map((cell, i) => (
              <div key={i} className="aspect-square bg-navy flex items-center justify-center p-8 text-center text-xs border border-cream/10 uppercase tracking-widest text-cream relative hover:scale-105 transition-transform duration-500 z-10">
                {cell.content}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-sm font-medium tracking-wide uppercase opacity-70">Follow us for daily brewing inspiration</p>
          </div>
        </div>
      </section>

      {/* 12. NEWSLETTER */}
      <section className="py-24 bg-navy-dark px-6 border-y border-cream/10">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-serif mb-6">Get the Weekly Roast Notes</h2>
            <p className="text-cream/60 mb-12 font-light italic">New origins, brew tips, and exclusive drops — straight to your inbox.</p>
            
            <form className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="YOUR EMAIL ADDRESS" 
                className="flex-grow bg-navy border border-cream/20 p-4 text-xs tracking-widest uppercase focus:border-cream outline-none sharp-corners"
              />
              <Button>Subscribe</Button>
            </form>
            <p className="mt-8 text-[10px] text-cream/30 uppercase tracking-widest">No spam. Just coffee.</p>
          </FadeIn>
        </div>
      </section>

      {/* 13. FOOTER */}
      <footer className="bg-navy-dark pt-24 pb-12 px-6 border-t border-cream/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2 md:col-span-1">
              <Logo className="mb-6 scale-90 origin-left" />
              <p className="text-xs text-cream/50 leading-relaxed uppercase tracking-wide max-w-xs">
                Refined specialty coffee brand built for those who appreciate the slower side of morning pursuit. Curated origins, roasted weekly in Manila.
              </p>
            </div>
            
            <div>
              <h4 className="font-serif text-lg mb-6 uppercase italic text-cream/70">Explore</h4>
              <ul className="space-y-4 text-xs font-medium uppercase tracking-widest text-cream/40">
                {['Our Story', 'Menu', 'Brew Guides', 'Origins', 'Wholesale', 'Shop'].map(item => (
                  <li key={item}><a href="#" className="hover:text-cream transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-lg mb-6 uppercase italic text-cream/70">Connect</h4>
              <ul className="space-y-4 text-xs font-medium uppercase tracking-widest text-cream/40">
                <li className="flex items-center gap-3"><Instagram size={14} /><a href="#" className="hover:text-cream transition-colors">Instagram</a></li>
                <li className="flex items-center gap-3"><Facebook size={14} /><a href="#" className="hover:text-cream transition-colors">Facebook</a></li>
                <li className="flex items-center gap-3"><Mail size={14} /><a href="#" className="hover:text-cream transition-colors">TikTok</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-lg mb-6 uppercase italic text-cream/70">Contact</h4>
              <ul className="space-y-4 text-xs font-medium uppercase tracking-widest text-cream/40">
                <li><a href="mailto:hello@runnerupcoffee.com" className="hover:text-cream transition-colors lowercase">hello@runnerupcoffee.com</a></li>
                <li><a href="tel:+639170000000" className="hover:text-cream transition-colors">+63 917 000 0000</a></li>
                <li className="text-cream/30 italic normal-case">BGC, Taguig, Philippines</li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] text-cream/30 uppercase tracking-[0.2em]">© 2025 RunnerUp Coffee. All rights reserved.</p>
            <div className="flex gap-8 text-[10px] text-cream/30 uppercase tracking-[0.2em]">
              <a href="#" className="hover:text-cream transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-cream transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-[70]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.4 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-navy-dark z-[80] shadow-2xl border-l border-cream/20 flex flex-col"
            >
              <div className="p-8 border-b border-cream/10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="text-cream" />
                  <h2 className="font-serif text-2xl tracking-tight">Your Order</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/5 transition-colors">
                  <X />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8">
                {orderComplete ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center px-6"
                  >
                    <div className="w-20 h-20 bg-cream flex items-center justify-center mb-6">
                      <Check size={40} className="text-navy" />
                    </div>
                    <h3 className="font-serif text-3xl mb-4 italic">Thank You!</h3>
                    <p className="text-cream/50 text-sm tracking-wide leading-relaxed uppercase">
                      Your order has been received. We are brewing with intention.
                    </p>
                  </motion.div>
                ) : cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                    <ShoppingBag size={48} className="mb-4" />
                    <p className="uppercase tracking-[0.2em] text-xs">Your bag is empty</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-6 group">
                        <div className="w-16 h-16 bg-navy border border-cream/10 flex items-center justify-center font-serif text-2xl shrink-0 group-hover:border-cream/40 transition-colors">
                          {item.name[0]}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between mb-1">
                            <h4 className="font-serif font-bold text-lg tracking-tight">{item.name}</h4>
                            <p className="font-medium text-cream/70">₱{item.price * item.quantity}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center border border-cream/10">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="px-3 py-1 hover:bg-cream/5 transition-colors text-xs"
                              >
                                -
                              </button>
                              <span className="px-4 py-1 text-xs border-x border-cream/10 min-w-8 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="px-3 py-1 hover:bg-cream/5 transition-colors text-xs"
                              >
                                +
                              </button>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-[10px] uppercase tracking-widest text-cream/30 hover:text-cream transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {!orderComplete && cart.length > 0 && (
                <div className="p-8 border-t border-cream/10 bg-navy">
                  <div className="flex justify-between items-end mb-8">
                    <span className="uppercase tracking-[0.3em] text-xs opacity-50">Subtotal</span>
                    <span className="font-serif text-3xl font-bold italic">₱{cartTotal}</span>
                  </div>
                  <Button className="w-full" onClick={checkout}>Confirm Order</Button>
                  <p className="mt-4 text-[10px] text-center text-cream/30 uppercase tracking-widest">
                    Standard pickup time: 15-20 minutes
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FLOATING CTA MOVED TO CART BUTTON OR REMOVED FOR CLEANER UI */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: cartCount > 0 && !isCartOpen ? 0 : 100 }}
        className="fixed bottom-10 right-10 z-[60]"
      >
        <button 
          onClick={() => setIsCartOpen(true)}
          className="bg-cream text-navy px-8 py-4 font-bold uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-all border border-navy flex items-center gap-3 group sharp-corners"
        >
          <ShoppingBag size={18} className="group-hover:rotate-12 transition-transform" />
          <span>View Bag ({cartCount})</span>
        </button>
      </motion.div>
    </div>
  );
}
