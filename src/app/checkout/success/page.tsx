'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, MapPin, Clock, Mail, ArrowRight } from 'lucide-react'

interface OrderDetails {
  orderId: string
  items: Array<{ id: string; name: string; price: number; quantity: number }>
  total: number
  pickupDate: string
  pickupTime: string
  deliveryMethod: string
  customer: { name: string; email: string; phone: string }
}

export default function CheckoutSuccessPage() {
  const [order, setOrder] = useState<OrderDetails | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('lastOrder')
    if (stored) {
      setOrder(JSON.parse(stored))
      sessionStorage.removeItem('lastOrder')
    }
  }, [])

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F7F2E9] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#6B5344] mb-4">No order found</p>
          <Link
            href="/"
            className="text-[#8B1E22] font-semibold hover:underline"
          >
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="min-h-screen bg-[#F7F2E9]">
      {/* Header */}
      <div className="bg-[#8B1E22] text-[#F7F2E9] py-8">
        <div className="container mx-auto px-4 text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-[#D0A246]" />
          <h1 className="text-3xl font-serif font-bold mb-2">Order Confirmed!</h1>
          <p className="text-[#F7F2E9]/80">Thank you for your order, {order.customer.name}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Order Number */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B5344]">Order Number</p>
                <p className="text-2xl font-bold text-[#3A2C2A]">{order.orderId}</p>
              </div>
              <div className="px-4 py-2 bg-[#FDF8E8] rounded-lg">
                <p className="text-sm text-[#6B5344]">Total</p>
                <p className="text-xl font-bold text-[#8B1E22]">£{order.total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Pickup Details */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-[#3A2C2A] mb-4">
              {order.deliveryMethod === 'delivery' ? 'Delivery Details' : 'Collection Details'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#8B1E22] mt-1" />
                <div>
                  <p className="font-medium text-[#3A2C2A]">
                    {order.deliveryMethod === 'delivery' ? 'Delivery Address' : 'Collection Point'}
                  </p>
                  <p className="text-sm text-[#6B5344]">
                    {order.deliveryMethod === 'delivery' 
                      ? 'Your order will be delivered to you. We will contact you to arrange.' 
                      : 'Camberley, Surrey\n(Full address in confirmation email)'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#8B1E22] mt-1" />
                <div>
                  <p className="font-medium text-[#3A2C2A]">
                    {order.deliveryMethod === 'delivery' ? 'Delivery Time' : 'Pickup Time'}
                  </p>
                  <p className="text-sm text-[#6B5344]">
                    {formatDate(order.pickupDate)}
                    <br />
                    {formatTime(order.pickupTime)}
                  </p>
                </div>
              </div>
            </div>
            
            {order.deliveryMethod === 'collection' && (
              <div className="mt-4 p-4 bg-[#F7F2E9] rounded-lg">
                <p className="text-sm text-[#6B5344]">
                  <strong>Important:</strong> Your full collection address is included in the confirmation 
                  email sent to {order.customer.email}. Please bring your order confirmation when collecting.
                </p>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-[#3A2C2A] mb-4">Order Items</h2>
            
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-[#E8DDD0] last:border-0">
                  <div>
                    <p className="font-medium text-[#3A2C2A]">{item.name}</p>
                    <p className="text-sm text-[#6B5344]">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-[#3A2C2A]">
                    £{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-[#E8DDD0] flex justify-between">
              <span className="font-semibold text-[#3A2C2A]">Total</span>
              <span className="font-bold text-[#8B1E22]">£{order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Confirmation Email */}
          <div className="bg-[#F7F2E9] rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#8B1E22] mt-1" />
              <div>
                <p className="font-medium text-[#3A2C2A]">Confirmation Email</p>
                <p className="text-sm text-[#6B5344]">
                  We've sent a confirmation to <strong>{order.customer.email}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/account/orders"
              className="btn-primary text-lg px-6 py-4 flex-1"
            >
              View Order History
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="btn-outline-white text-lg px-6 py-4 flex-1"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Payment Note */}
          <p className="mt-6 text-center text-sm text-[#6B5344]">
            We'll confirm your order via email. See you soon!
          </p>
          
          {/* Teya Payment Status */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-center">
            <p className="text-amber-800">
              <strong>Payment:</strong> You'll be able to pay by card, cash, or contactless when you collect your order. 
              Online payment integration via Teya is currently being set up. Thank you for your patience!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}