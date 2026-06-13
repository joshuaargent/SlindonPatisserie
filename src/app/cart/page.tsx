'use client'

import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Plus, Minus, Trash2, Clock, ArrowRight } from 'lucide-react';
import { useCartStore, formatPrice } from '@/lib/stores/cart';

// Client component for cart content
function CartContent() {
  const { items, updateQuantity, removeItem, clearCart, getSubtotal, getMaxProductionTime } = useCartStore();
  
  const subtotal = getSubtotal();
  const maxProductionTime = getMaxProductionTime();
  
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="h-24 w-24 rounded-full bg-[#D0A246]/20 flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="h-12 w-12 text-[#8B1E22]" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#3A2C2A] mb-4">Your cart is empty</h2>
        <p className="text-[#6B5344] mb-8">Add some delicious products to get started!</p>
        <Link
          href="/products"
          className="btn-secondary"
        >
          Browse Products
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Cart Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold text-[#3A2C2A]">
          Your Cart ({items.length} items)
        </h2>
        <button
          onClick={clearCart}
          className="text-sm text-[#8B1E22] hover:text-[#9B2A32] transition-colors"
        >
          Clear Cart
        </button>
      </div>
      
      {/* Wait Time Notice */}
      {maxProductionTime > 0 && (
        <div className="bg-[#FDF8E8] border border-[#D0A246] rounded-lg p-4 flex items-start gap-3">
          <Clock className="h-5 w-5 text-[#8B1E22] shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-[#3A2C2A]">Minimum wait time: {maxProductionTime} hours</p>
            <p className="text-sm text-[#6B5344]">Some products in your cart require {maxProductionTime} hours production time. You'll select a pickup slot at checkout.</p>
          </div>
        </div>
      )}
      
      {/* Cart Items */}
      <div className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden">
        <div className="divide-y divide-[#E8DDD0]">
          {items.map((item) => (
            <div key={item.id} className="p-4 flex items-center gap-4">
              {/* Product Image Placeholder */}
              <div className="h-20 w-20 rounded-lg bg-[#D0A246]/10 flex items-center justify-center shrink-0">
                <span className="text-2xl">🥐</span>
              </div>
              
              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#3A2C2A] truncate">{item.name}</h3>
                <p className="text-sm text-[#6B5344]">{item.category}</p>
                <p className="text-sm text-[#6B5344]">Wait: {item.productionTime}h</p>
              </div>
              
              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="p-2 rounded-lg border border-[#E8DDD0] hover:bg-[#FDF8E8] transition-colors"
                >
                  <Minus className="h-4 w-4 text-[#6B5344]" />
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="p-2 rounded-lg border border-[#E8DDD0] hover:bg-[#FDF8E8] transition-colors"
                >
                  <Plus className="h-4 w-4 text-[#6B5344]" />
                </button>
              </div>
              
              {/* Price */}
              <div className="text-right shrink-0 min-w-[80px]">
                <p className="font-bold text-[#3A2C2A]">{formatPrice(item.price * item.quantity)}</p>
                <p className="text-sm text-[#6B5344]">{formatPrice(item.price)} each</p>
              </div>
              
              {/* Remove Button */}
              <button
                onClick={() => removeItem(item.productId)}
                className="p-2 text-[#8B1E22] hover:bg-[#8B1E22]/10 rounded-lg transition-colors shrink-0"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Summary */}
      <div className="bg-white rounded-xl border border-[#E8DDD0] p-6">
        <div className="flex items-center justify-between text-lg font-bold text-[#3A2C2A] mb-4">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <p className="text-sm text-[#6B5344] mb-6">Delivery fee calculated at checkout</p>
        
        <div className="space-y-3">
          <Link
            href="/checkout"
            className="btn-primary text-lg px-8 py-4 w-full"
          >
            Proceed to Checkout
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/products"
            className="btn-outline-red text-lg px-6 py-4 w-full"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
      
      {/* Info */}
      <div className="text-center text-sm text-[#6B5344]">
        <p>Pay when you collect your order. No online payment required.</p>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <div className="bg-[#F7F2E9] min-h-screen">
      {/* Hero */}
      <section className="bg-[#8B1E22] text-[#F7F2E9] py-12">
        <div className="container">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-[#D0A246] transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#F7F2E9]">Your Cart</h1>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-12">
        <div className="container max-w-3xl">
          <CartContent />
        </div>
      </section>
    </div>
  );
}