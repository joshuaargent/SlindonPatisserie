'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ShoppingBag, MapPin, Clock, CreditCard, CheckCircle, AlertCircle, Calendar, Zap } from 'lucide-react'
import { useCartStore, formatPrice } from '@/lib/stores/cart'
import { useSupabaseUser } from '@/components/providers/SupabaseProvider'
import { TeyaCheckout } from '@/components/payment/TeyaCheckout'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal, clearCart, checkAvailability } = useCartStore()
  const { user } = useSupabaseUser()
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
  // Payment state
  const [orderId, setOrderId] = useState<string | null>(null)
  const [internalOrderId, setInternalOrderId] = useState<string | null>(null)
  const [showPayment, setShowPayment] = useState(false)

  // Availability info
  const [availabilityInfo, setAvailabilityInfo] = useState<{
    canFulfillToday: boolean
    leadTimeDays: number
    leadTimeDisplay: string
    earliestDate: string
    earliestTime: string
  } | null>(null)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])

  // Calculate totals
  const subtotal = getSubtotal()
  const deliveryFee = deliveryMethod === 'delivery' ? 3.50 : 0
  const total = subtotal + deliveryFee

  // Prefill customer info from logged-in user
  useEffect(() => {
    if (!user) return
    setCustomerInfo(prev => ({
      name: prev.name || user.user_metadata?.name || '',
      email: prev.email || user.email || '',
      phone: prev.phone || '',
    }))
  }, [user])

  // Check availability and set minimum date
  useEffect(() => {
    if (items.length > 0) {
      checkAvailability().then(result => {
        setAvailabilityInfo(result)
        setPickupDate(result.earliestDate)
        setPickupTime(result.earliestTime)

        // Generate available slots
        const slots = generateTimeSlots(result.earliestDate, result.canFulfillToday)
        setAvailableSlots(slots)
      })
    }
  }, [items])

  // Update slots when date changes
  useEffect(() => {
    if (pickupDate && availabilityInfo) {
      const isToday = pickupDate === new Date().toISOString().split('T')[0]
      const slots = generateTimeSlots(pickupDate, availabilityInfo.canFulfillToday && isToday)
      setAvailableSlots(slots)
      
      // If current time slot is not available, select the first available
      if (!slots.includes(pickupTime)) {
        setPickupTime(slots[0] || '')
      }
    }
  }, [pickupDate, availabilityInfo])

  // Generate available time slots
  const generateTimeSlots = (date: string, canFulfillToday: boolean): string[] => {
    const allSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
    const today = new Date().toISOString().split('T')[0]
    
    if (date === today) {
      const currentHour = new Date().getHours()
      return allSlots.filter(slot => {
        const slotHour = parseInt(slot.split(':')[0], 10)
        // If we can fulfill today, show future slots
        // If not, we can still show slots if it's early enough in the day
        return slotHour > currentHour
      })
    }
    
    return allSlots
  }

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
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({ id: item.productId, name: item.name, price: item.price, quantity: item.quantity })),
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone || undefined,
          deliveryMethod,
          pickupDate,
          pickupTime,
          deliveryAddress: deliveryAddress || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      // Store order info for payment or success page
      setOrderId(data.orderId)
      setInternalOrderId(data.internalId)

      // Check if Teya is configured for online payments
      const statusRes = await fetch('/api/teya/status')
      const statusData = await statusRes.json()

      if (statusData.configured) {
        // Show embedded payment form
        setShowPayment(true)
        setProcessing(false)
      } else {
        // No online payment - complete order and go to success
        clearCart()
        sessionStorage.setItem('lastOrder', JSON.stringify({
          orderId: data.orderId,
          items: items,
          total: data.total,
          pickupDate,
          pickupTime,
          deliveryMethod,
          customer: customerInfo,
          paymentStatus: 'PENDING',
        }))
        router.push('/checkout/success')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.')
      setProcessing(false)
    }
  }

  const handlePaymentSuccess = async (paymentResult: any) => {
    try {
      // Update order payment status
      await fetch(`/api/orders/${internalOrderId}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: paymentResult.paymentId,
          status: paymentResult.status,
        }),
      })

      clearCart()
      sessionStorage.setItem('lastOrder', JSON.stringify({
        orderId,
        items: items,
        total: total,
        pickupDate,
        pickupTime,
        deliveryMethod,
        customer: customerInfo,
        paymentStatus: 'PAID',
        paymentId: paymentResult.paymentId,
      }))
      router.push('/checkout/success')
    } catch (err) {
      setError('Failed to complete order. Please contact support.')
    }
  }

  const handlePaymentError = (error: string) => {
    setError(`Payment failed: ${error}`)
    setShowPayment(false)
  }

  return (
    <div className="min-h-screen bg-[#F7F2E9]">
      {/* Header */}
      <div className="bg-[#8B1E22] text-[#F7F2E9] py-4">
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
                  <Calendar className="w-5 h-5" />
                  Select Pickup Time
                </h2>

                {/* Availability Banner */}
                {availabilityInfo && (
                  <div className={`mb-4 p-4 rounded-lg ${
                    availabilityInfo.canFulfillToday 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-blue-50 border border-blue-200'
                  }`}>
                    {availabilityInfo.canFulfillToday ? (
                      <div className="flex items-center gap-2 text-green-800">
                        <Zap className="w-5 h-5" />
                        <span className="font-medium">Available for pickup!</span>
                        <span className="text-green-700">All items ready at Camberley bakery.</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-blue-800">
                        <Calendar className="w-5 h-5" />
                        <span className="font-medium">Pickup in {availabilityInfo.leadTimeDisplay}</span>
                        <span className="text-blue-700">Earliest: {new Date(availabilityInfo.earliestDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} at {availabilityInfo.earliestTime}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#3A2C2A] mb-2">
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      min={availabilityInfo?.earliestDate || new Date().toISOString().split('T')[0]}
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
                      disabled={availableSlots.length === 0}
                      className="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E22] focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="">Select a time</option>
                      {availableSlots.map(slot => (
                        <option key={slot} value={slot}>
                          {slot === '09:00' ? '9:00 AM' : 
                           slot === '10:00' ? '10:00 AM' :
                           slot === '11:00' ? '11:00 AM' :
                           slot === '12:00' ? '12:00 PM' :
                           slot === '13:00' ? '1:00 PM' :
                           slot === '14:00' ? '2:00 PM' :
                           slot === '15:00' ? '3:00 PM' :
                           slot === '16:00' ? '4:00 PM' : '5:00 PM'}
                        </option>
                      ))}
                    </select>
                    {availableSlots.length === 0 && (
                      <p className="text-xs text-red-600 mt-1">No slots available for this date</p>
                    )}
                  </div>
                </div>

                {availabilityInfo?.canFulfillToday ? (
                  <p className="mt-4 text-sm text-green-700">
                    Great news! All items are available for pickup. Select a time that works for you.
                  </p>
                ) : (
                  <p className="mt-4 text-sm text-[#6B5344]">
                    Your order will be prepared fresh. We'll have it ready for pickup at your selected time.
                  </p>
                )}
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

                {showPayment && orderId ? (
                  // Embedded Teya payment form
                  <TeyaCheckout
                    amount={total}
                    currency="GBP"
                    orderId={orderId}
                    customerEmail={customerInfo.email}
                    customerName={customerInfo.name}
                    description={`Order ${orderId} - Slindon Patisserie`}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    onCancel={() => {
                      setShowPayment(false)
                      setError('Payment cancelled. Your order is still saved.')
                    }}
                  />
                ) : (
                  // Default: Payment on collection
                  <>
                    <div className="p-4 bg-[#FDF8E8] rounded-lg mb-4">
                      <p className="text-sm text-[#6B5344]">
                        <strong>Payment is collected at collection/delivery.</strong> You can pay by card, 
                        cash, or contactless when you pick up your order.
                      </p>
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800">
                        <strong>⚠ Teya Integration Coming Soon:</strong> Thank you for your patience. You'll be able to pay by card, cash, or contactless when you collect your order. Online payment integration is currently being set up.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-[#3A2C2A] mb-4">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
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
                  className="btn-primary text-lg px-8 py-4 w-full mt-6"
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