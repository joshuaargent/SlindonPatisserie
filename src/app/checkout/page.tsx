'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ShoppingBag, MapPin, Clock, CreditCard, CheckCircle, AlertCircle } from 'lucide-react'
import { createTeyaPaymentSession, isTeyaConfigured } from '@/lib/teya'

// Sample cart items for demo
const sampleCartItems = [
  { id: '1', name: 'Butter Croissant', price: 2.50, quantity: 2 },
  { id: '2', name: 'Pain au Chocolat', price: 2.80, quantity: 1 },
  { id: '3', name: 'Sourdough Boule', price: 4.50, quantity: 1 },
]

export default function CheckoutPage() {
  const router = useRouter()
  const [deliveryMethod, setDeliveryMethod] = useState<'collection' | 'delivery'>('collection')
  const [pickupDate, setPickupDate] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const [deliveryInterest, setDeliveryInterest] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  // Calculate totals
  const subtotal = sampleCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = deliveryMethod === 'delivery' ? 3.50 : 0
  const total = subtotal + deliveryFee

  // Get minimum date (tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!pickupDate || !pickupTime) {
      setError('Please select a pickup date and time')
      return
    }

    if (!customerInfo.name || !customerInfo.email) {
      setError('Please fill in your name and email')
      return
    }

    setProcessing(true)

    try {
      // Create order ID
      const orderId = `order_${Date.now()}`

      // If Teya is configured, create a payment session
      if (isTeyaConfigured()) {
        const session = await createTeyaPaymentSession({
          amount: total,
          currency: 'GBP',
          orderId,
          customerEmail: customerInfo.email,
          customerName: customerInfo.name,
          description: `Slindon Patisserie Order - ${sampleCartItems.length} items`,
        })

        // In production, redirect to Teya payment page
        // window.location.href = session.paymentUrl
      }

      // For demo, simulate successful order
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store order in session for demo
      sessionStorage.setItem('lastOrder', JSON.stringify({
        orderId,
        items: sampleCartItems,
        total,
        pickupDate,
        pickupTime,
        deliveryMethod,
        customer: customerInfo,
      }))

      router.push('/checkout/success')
    } catch (err) {
      setError('An error occurred. Please try again.')
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F2E9]">
      {/* Header */}
      <div className="bg-[#8B1E22] text-white py-4">
        <div className="container mx-auto px-4">
          <Link
            href="/cart"
            className="inline-flex items-center text-sm hover:text-[#D0A246] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-serif font-bold text-[#3A2C2A] mb-8">Checkout</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-[#3A2C2A] mb-4">Collection or Delivery</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('collection')}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      deliveryMethod === 'collection'
                        ? 'border-[#8B1E22] bg-[#F7F2E9]'
                        : 'border-[#E8DDD0] hover:border-[#8B1E22]'
                    }`}
                  >
                    <MapPin className="w-8 h-8 text-[#8B1E22] mb-2" />
                    <h3 className="font-semibold text-[#3A2C2A]">Collection</h3>
                    <p className="text-sm text-[#6B5344]">Pick up from our Camberley bakery</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('delivery')}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      deliveryMethod === 'delivery'
                        ? 'border-[#8B1E22] bg-[#F7F2E9]'
                        : 'border-[#E8DDD0] hover:border-[#8B1E22]'
                    }`}
                  >
                    <ShoppingBag className="w-8 h-8 text-[#8B1E22] mb-2" />
                    <h3 className="font-semibold text-[#3A2C2A]">Delivery</h3>
                    <p className="text-sm text-[#6B5344]">Contact us to arrange</p>
                  </button>
                </div>

                {/* Delivery Interest Button */}
                {deliveryMethod === 'collection' && (
                  <div className="mt-4 p-4 bg-[#F7F2E9] rounded-lg">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={deliveryInterest}
                        onChange={(e) => setDeliveryInterest(e.target.checked)}
                        className="w-5 h-5 rounded border-[#E8DDD0] text-[#8B1E22] focus:ring-[#8B1E22]"
                      />
                      <span className="text-[#6B5344]">
                        I'd like delivery for future orders (we'll contact you)
                      </span>
                    </label>
                  </div>
                )}
                
                {/* Delivery note */}
                {deliveryMethod === 'delivery' && (
                  <div className="mt-4 p-4 bg-[#FDF8E8] rounded-lg border border-[#D0A246]">
                    <p className="text-sm text-[#6B5344]">
                      <strong>Delivery is by arrangement.</strong> Please note that delivery requires 
                      advance arrangement. We'll contact you after placing your order to confirm 
                      delivery availability and any additional fees.
                    </p>
                  </div>
                )}
              </div>

              {/* Pickup Time */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-[#3A2C2A] mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Select Pickup Time
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#3A2C2A] mb-2">
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      min={minDate}
                      required
                      className="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E22] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#3A2C2A] mb-2">
                      Pickup Time
                    </label>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E22] focus:border-transparent"
                    >
                      <option value="">Select a time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                      <option value="17:00">5:00 PM</option>
                    </select>
                  </div>
                </div>

                <p className="mt-4 text-sm text-[#6B5344]">
                  All products are made fresh to order. Please allow at least 24 hours for preparation.
                </p>
              </div>

              {/* Customer Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-[#3A2C2A] mb-4">Your Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#3A2C2A] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E22] focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#3A2C2A] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E22] focus:border-transparent"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#3A2C2A] mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E22] focus:border-transparent"
                      placeholder="01234 567890"
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-[#3A2C2A] mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment
                </h2>

                <div className="p-4 bg-[#FDF8E8] rounded-lg mb-4">
                  <p className="text-sm text-[#6B5344]">
                    <strong>Payment is collected at collection/delivery.</strong> You can pay by card, 
                    cash, or contactless when you pick up your order.
                  </p>
                </div>

                {isTeyaConfigured() ? (
                  <p className="text-sm text-[#6B5344]">
                    Your payment will be processed securely via Teya when you collect your order.
                  </p>
                ) : (
                  <p className="text-sm text-[#6B5344]">
                    Teya payment integration is being set up. You'll pay when you collect.
                  </p>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-[#3A2C2A] mb-4">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-6">
                  {sampleCartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-[#6B5344]">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="text-[#3A2C2A] font-medium">
                        £{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#E8DDD0] pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B5344]">Subtotal</span>
                    <span className="text-[#3A2C2A]">£{subtotal.toFixed(2)}</span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B5344]">Delivery</span>
                      <span className="text-[#3A2C2A]">£{deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t border-[#E8DDD0]">
                    <span className="text-[#3A2C2A]">Total</span>
                    <span className="text-[#8B1E22]">£{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="btn-secondary w-full mt-6"
                >
                  {processing ? (
                    <>
                      <span className="animate-spin">⟳</span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Confirm Order
                    </>
                  )}
                </button>

                <p className="mt-4 text-xs text-center text-[#6B5344]">
                  By confirming, you agree to our{' '}
                  <Link href="/terms" className="text-[#8B1E22] hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-[#8B1E22] hover:underline">Privacy Policy</Link>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}