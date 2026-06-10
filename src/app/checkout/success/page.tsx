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
      <div className="min-h-screen bg-[#FDF8F0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#6B5B4F] mb-4">No order found</p>
          <Link
            href="/"
            className="text-[#D42426] font-semibold hover:underline"
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
    <div className="min-h-screen bg-[#FDF8F0]">
      {/* Header */}
      <div className="bg-[#D42426] text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-[#F5C518]" />
          <h1 className="text-3xl font-serif font-bold mb-2">Order Confirmed!</h1>
          <p className="text-[#FFF9E6]">Thank you for your order, {order.customer.name}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Order Number */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B5B4F]">Order Number</p>
                <p className="text-2xl font-bold text-[#2D1810]">{order.orderId}</p>
              </div>
              <div className="px-4 py-2 bg-[#FFF9E6] rounded-lg">
                <p className="text-sm text-[#6B5B4F]">Total</p>
                <p className="text-xl font-bold text-[#D42426]">£{order.total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Pickup Details */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-[#2D1810] mb-4">Pickup Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D42426] mt-1" />
                <div>
                  <p className="font-medium text-[#2D1810]">
                    {order.deliveryMethod === 'delivery' ? 'Delivery Address' : 'Collection Point'}
                  </p>
                  <p className="text-sm text-[#6B5B4F]">
                    {order.deliveryMethod === 'delivery' 
                      ? 'Your order will be delivered' 
                      : 'Slindon Patisserie\n123 Main Street, Camberley'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#D42426] mt-1" />
                <div>
                  <p className="font-medium text-[#2D1810]">Pickup Time</p>
                  <p className="text-sm text-[#6B5B4F]">
                    {formatDate(order.pickupDate)}
                    <br />
                    {formatTime(order.pickupTime)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-[#2D1810] mb-4">Order Items</h2>
            
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-[#E8DDD0] last:border-0">
                  <div>
                    <p className="font-medium text-[#2D1810]">{item.name}</p>
                    <p className="text-sm text-[#6B5B4F]">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-[#2D1810]">
                    £{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-[#E8DDD0] flex justify-between">
              <span className="font-semibold text-[#2D1810]">Total</span>
              <span className="font-bold text-[#D42426]">£{order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Confirmation Email */}
          <div className="bg-[#FFF9E6] rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#D42426] mt-1" />
              <div>
                <p className="font-medium text-[#2D1810]">Confirmation Email</p>
                <p className="text-sm text-[#6B5B4F]">
                  We've sent a confirmation to <strong>{order.customer.email}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/account/orders"
              className="flex-1 py-3 bg-[#D42426] text-white rounded-lg font-semibold hover:bg-[#B81E20] transition-colors text-center flex items-center justify-center gap-2"
            >
              View Order History
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="flex-1 py-3 bg-white text-[#D42426] border-2 border-[#D42426] rounded-lg font-semibold hover:bg-[#FFF9E6] transition-colors text-center"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Payment Note */}
          <p className="mt-6 text-center text-sm text-[#6B5B4F]">
            Payment will be collected when you pick up your order. You can pay by card, cash, or contactless.
          </p>
        </div>
      </div>
    </div>
  )
}