import { useState, useMemo } from "react";
import { ShoppingCart, Search, Heart, Star, X, Plus, Minus, ChevronRight, Truck, Shield, RotateCcw, Zap } from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const PRODUCTS = [
  { id: 1,  name: "Wireless Noise-Cancelling Headphones", price: 89.99,  original: 129.99, rating: 4.8, reviews: 2341, category: "Electronics",  badge: "Best Seller", image: "🎧", color: "#1a1a2e" },
  { id: 2,  name: "Minimalist Leather Wallet",            price: 34.99,  original: null,   rating: 4.6, reviews: 891,  category: "Accessories", badge: "New",         image: "👜", color: "#2d1b0e" },
  { id: 3,  name: "Stainless Steel Water Bottle 1L",      price: 24.99,  original: 39.99,  rating: 4.9, reviews: 5621, category: "Home",        badge: "Sale",        image: "🧴", color: "#0a2e1a" },
  { id: 4,  name: "Mechanical Keyboard TKL",              price: 119.99, original: 159.99, rating: 4.7, reviews: 1203, category: "Electronics",  badge: "Sale",        image: "⌨️", color: "#1a0a2e" },
  { id: 5,  name: "Yoga Mat Premium 6mm",                 price: 44.99,  original: null,   rating: 4.5, reviews: 763,  category: "Sports",      badge: null,          image: "🧘", color: "#2e1a0a" },
  { id: 6,  name: "Ceramic Pour-Over Coffee Set",         price: 54.99,  original: 74.99,  rating: 4.8, reviews: 432,  category: "Home",        badge: "Hot",         image: "☕", color: "#2e0a0a" },
  { id: 7,  name: "Running Shoes Ultra Boost",            price: 79.99,  original: 109.99, rating: 4.6, reviews: 2876, category: "Sports",      badge: "Sale",        image: "👟", color: "#0a1a2e" },
  { id: 8,  name: "Smart LED Desk Lamp",                  price: 39.99,  original: null,   rating: 4.4, reviews: 654,  category: "Home",        badge: "New",         image: "💡", color: "#2e2a0a" },
  { id: 9,  name: "Sunglasses Polarized UV400",           price: 29.99,  original: 49.99,  rating: 4.3, reviews: 1129, category: "Accessories", badge: "Sale",        image: "🕶️", color: "#0a2e2a" },
  { id: 10, name: "Portable Bluetooth Speaker",           price: 64.99,  original: 89.99,  rating: 4.7, reviews: 3201, category: "Electronics",  badge: "Best Seller", image: "🔊", color: "#1a2e0a" },
  { id: 11, name: "Straw Hat Wide Brim",                  price: 19.99,  original: null,   rating: 4.2, reviews: 342,  category: "Accessories", badge: null,          image: "👒", color: "#2e1a1a" },
  { id: 12, name: "Resistance Bands Set (5 levels)",      price: 17.99,  original: 29.99,  rating: 4.6, reviews: 4102, category: "Sports",      badge: "Sale",        image: "💪", color: "#0a2e0a" },
];

const CATEGORIES = ["All", "Electronics", "Accessories", "Home", "Sports"];

const BADGE_COLORS = {
  "Best Seller": "#FF5C00",
  "Sale":        "#e63946",
  "New":         "#2a9d8f",
  "Hot":         "#e76f51",
};

// ─── CART ────────────────────────────────────────────────────────────────────

function useCart() {
  const [items, setItems] = useState([]);

  const add = (product) =>
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      return existing
        ? prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...product, qty: 1 }];
    });

  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const update = (id, qty) =>
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.id !== id)
               : prev.map((i) => i.id === id ? { ...i, qty } : i)
    );

  const total   = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count   = items.reduce((s, i) => s + i.qty, 0);

  return { items, add, remove, update, total, count };
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Badge({ label }) {
  if (!label) return null;
  return (
    <span
      className="absolute top-3 left-3 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full z-10"
      style={{ backgroundColor: BADGE_COLORS[label] || "#FF5C00" }}
    >
      {label}
    </span>
  );
}

function Stars({ rating }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star
          key={s}
          size={11}
          className={s <= Math.round(rating) ? "fill-[#FF5C00] text-[#FF5C00]" : "fill-gray-200 text-gray-200"}
        />
      ))}
    </span>
  );
}

function ProductCard({ product, onAdd, wishlisted, onWishlist }) {
  const [hovered, setHovered] = useState(false);
  const discount = product.original
    ? Math.round((1 - product.price / product.original) * 100)
    : null;

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area */}
      <div
        className="relative h-52 flex items-center justify-center text-6xl transition-all duration-300"
        style={{ backgroundColor: product.color + "18" }}
      >
        <Badge label={product.badge} />

        {discount && (
          <span className="absolute top-3 right-3 bg-[#e63946] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}

        <span className="text-6xl select-none">{product.image}</span>

        {/* Wishlist */}
        <button
          onClick={() => onWishlist(product.id)}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center transition-transform hover:scale-110"
        >
          <Heart
            size={15}
            className={wishlisted ? "fill-[#FF5C00] text-[#FF5C00]" : "text-gray-400"}
          />
        </button>

        {/* Quick add — slides up on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-300 px-3 pb-3"
          style={{ transform: hovered ? "translateY(0)" : "translateY(110%)", opacity: hovered ? 1 : 0 }}
        >
          <button
            onClick={() => onAdd(product)}
            className="w-full bg-[#111111] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#FF5C00] transition-colors"
          >
            Add to cart
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 mb-3">
          <Stars rating={product.rating} />
          <span className="text-[11px] text-gray-400">({product.reviews.toLocaleString()})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">${product.price}</span>
            {product.original && (
              <span className="text-xs text-gray-400 line-through">${product.original}</span>
            )}
          </div>
          <button
            onClick={() => onAdd(product)}
            className="w-8 h-8 rounded-full bg-[#FF5C00] text-white flex items-center justify-center hover:bg-[#e04e00] transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ cart, onClose }) {
  const { items, remove, update, total } = cart;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-sm bg-white flex flex-col h-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-bold text-lg">Your Cart ({items.reduce((s,i)=>s+i.qty,0)})</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <ShoppingCart size={40} className="mx-auto mb-3 opacity-30" />
              <p>Your cart is empty</p>
            </div>
          ) : items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: item.color + "18" }}
              >
                {item.image}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                <p className="text-sm text-[#FF5C00] font-bold">${item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => update(item.id, item.qty - 1)}
                  className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100"
                >
                  <Minus size={12} />
                </button>
                <span className="text-sm font-medium w-4 text-center">{item.qty}</span>
                <button
                  onClick={() => update(item.id, item.qty + 1)}
                  className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100"
                >
                  <Plus size={12} />
                </button>
              </div>
              <button onClick={() => remove(item.id)} className="text-gray-300 hover:text-red-400 ml-1">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t space-y-3">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Shipping</span>
              <span className="text-[#2a9d8f] font-medium">Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="w-full bg-[#FF5C00] hover:bg-[#e04e00] text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              Checkout <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function MastShop() {
  const cart      = useCart();
  const [query,   setQuery]   = useState("");
  const [cat,     setCat]     = useState("All");
  const [sort,    setSort]    = useState("featured");
  const [cartOpen,setCartOpen]= useState(false);
  const [wish,    setWish]    = useState(new Set());

  const toggleWish = (id) =>
    setWish((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const filtered = useMemo(() => {
    let r = PRODUCTS.filter((p) => {
      const matchQ = p.name.toLowerCase().includes(query.toLowerCase());
      const matchC = cat === "All" || p.category === cat;
      return matchQ && matchC;
    });
    if (sort === "price-asc")  r = [...r].sort((a,b) => a.price - b.price);
    if (sort === "price-desc") r = [...r].sort((a,b) => b.price - a.price);
    if (sort === "rating")     r = [...r].sort((a,b) => b.rating - a.rating);
    return r;
  }, [query, cat, sort]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-[#FF5C00] rounded-lg flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight">
              Mast<span className="text-[#FF5C00]">Shop</span>
            </span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5C00]/30 focus:bg-white transition-colors"
            />
          </div>

          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ShoppingCart size={18} className="text-gray-700" />
            {cart.count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF5C00] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cart.count}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="bg-[#111111] text-white">
        <div className="max-w-6xl mx-auto px-5 py-16 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-[#FF5C00] font-semibold text-sm uppercase tracking-widest mb-3">
              New arrivals every week
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
              Shop Smarter.<br />
              <span className="text-[#FF5C00]">Pay Less.</span>
            </h1>
            <p className="text-gray-400 text-lg mb-6 max-w-md">
              Thousands of products across electronics, fashion, sports and more — all in one place.
            </p>
            <button
              onClick={() => document.getElementById("products").scrollIntoView({ behavior: "smooth" })}
              className="bg-[#FF5C00] hover:bg-[#e04e00] text-white font-bold px-6 py-3 rounded-xl transition-colors inline-flex items-center gap-2"
            >
              Shop Now <ChevronRight size={18} />
            </button>
          </div>
          <div className="text-8xl select-none animate-bounce">🛍️</div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: <Truck size={18} />,       label: "Free Shipping",    sub: "On orders over $50" },
            { icon: <Shield size={18} />,      label: "Secure Payment",   sub: "100% protected" },
            { icon: <RotateCcw size={18} />,   label: "Easy Returns",     sub: "30-day policy" },
            { icon: <Zap size={18} />,         label: "Fast Delivery",    sub: "2-5 business days" },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FF5C00]/10 text-[#FF5C00] flex items-center justify-center flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">{f.label}</p>
                <p className="text-[11px] text-gray-400">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PRODUCTS ── */}
      <section id="products" className="max-w-6xl mx-auto px-5 py-10">
        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  cat === c
                    ? "bg-[#111111] text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5C00]/30"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* Count */}
        <p className="text-sm text-gray-400 mb-6">
          Showing <span className="font-semibold text-gray-700">{filtered.length}</span> products
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Search size={40} className="mx-auto mb-3 opacity-30" />
            <p>No products match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAdd={cart.add}
                wishlisted={wish.has(p.id)}
                onWishlist={toggleWish}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#111111] text-gray-400 mt-10">
        <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#FF5C00] rounded flex items-center justify-center">
              <Zap size={13} className="text-white" />
            </div>
            <span className="text-white font-bold">MastShop</span>
            <span className="text-gray-600">· All rights reserved 2026</span>
          </div>
          <div className="flex gap-6">
            {["About", "Privacy", "Terms", "Contact"].map((l) => (
              <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* ── CART DRAWER ── */}
      {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} />}
    </div>
  );
}
