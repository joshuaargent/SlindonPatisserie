'use client'

import { useState, useEffect, useRef } from 'react'
import { CreditCard, Lock, AlertCircle, Loader2 } from 'lucide-react'

// Teya SDK type declarations
declare global {
  interface Window {
    TeyaBlocks?: {
      init: (config: TeyaInitConfig) => Promise<TeyaBlocksInstance>
    }
    teyaPayment?: {
      sessionToken: string
      clientApiUrl: string
      assetUrl: string
    }
  }
}

interface TeyaInitConfig {
  sessionToken: string
  clientApiUrl: string
  assetUrl: string
  options?: {
    environment?: 'sandbox' | 'production'
    theme?: 'light' | 'dark'
  }
}

interface TeyaBlocksInstance {
  createComponent: (type: 'checkout' | 'card' | 'splitCard') => TeyaComponent
}

interface TeyaComponent {
  mount: (selector: string | HTMLElement) => void
  on: (event: string, callback: (data: any) => void) => void
  submit: () => void
  destroy: () => void
}

interface TeyaCheckoutProps {
  amount: number // in major units (e.g., pounds)
  currency?: string
  orderId: string
  customerEmail: string
  customerName: string
  description?: string
  onSuccess: (paymentResult: TeyaPaymentResult) => void
  onError: (error: string) => void
  onCancel?: () => void
}

interface TeyaPaymentResult {
  paymentId: string
  orderId: string
  status: string
  amount: number
  currency: string
  paymentMethod?: string
}

interface TeyaSessionResponse {
  sessionToken: string
  clientApiUrl: string
  assetUrl: string
}

export function TeyaCheckout({
  amount,
  currency = 'GBP',
  orderId,
  customerEmail,
  customerName,
  description = 'Order payment',
  onSuccess,
  onError,
  onCancel,
}: TeyaCheckoutProps) {
  const [loading, setLoading] = useState(true)
  const [sdkLoading, setSdkLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sdkReady, setSdkReady] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const componentRef = useRef<TeyaComponent | null>(null)

  // Load the Teya Blocks SDK
  useEffect(() => {
    const loadSdk = async () => {
      // Check if SDK is already loaded
      if (window.TeyaBlocks) {
        setSdkLoading(false)
        return
      }

      // SDK URL from environment or default
      const sdkUrl = process.env.NEXT_PUBLIC_TEYA_SDK_URL || 'https://api.teya.com/v2/checkout/sdk'
      
      try {
        // Load Teya's SDK script
        const script = document.createElement('script')
        script.src = sdkUrl
        script.async = true
        
        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('Failed to load Teya SDK'))
          document.head.appendChild(script)
        })
        
        setSdkLoading(false)
      } catch (err) {
        console.warn('Teya SDK not available, using fallback mode')
        // For development, we'll show a placeholder
        setSdkLoading(false)
      }
    }

    loadSdk()
  }, [])

  // Create session and initialize the checkout component
  useEffect(() => {
    if (sdkLoading) return

    const initializeCheckout = async () => {
      try {
        setLoading(true)
        setError(null)

        // 1. Create checkout session via your API
        const sessionResponse = await fetch('/api/teya/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Math.round(amount * 100), // Convert to minor units (pence)
            currency,
            orderId,
            customerEmail,
            customerName,
            description,
          }),
        })

        if (!sessionResponse.ok) {
          const errorData = await sessionResponse.json()
          throw new Error(errorData.error || 'Failed to initialize payment session')
        }

        const sessionData: TeyaSessionResponse = await sessionResponse.json()
        
        // 2. Initialize the Teya Blocks SDK with the session token
        if (window.TeyaBlocks) {
          const teya = await window.TeyaBlocks.init({
            sessionToken: sessionData.sessionToken,
            clientApiUrl: sessionData.clientApiUrl,
            assetUrl: sessionData.assetUrl,
            options: {
              environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
            },
          })

          // 3. Create the checkout component
          const component = teya.createComponent('checkout')
          componentRef.current = component

          // 4. Set up event handlers
          component.on('ready', () => {
            setSdkReady(true)
            setLoading(false)
          })

          component.on('change', (data: any) => {
            console.log('Payment form changed:', data)
          })

          component.on('error', (err: any) => {
            console.error('Payment error:', err)
            setError(err.message || 'Payment error occurred')
            onError(err.message || 'Payment error occurred')
          })

          component.on('cancel', () => {
            if (onCancel) onCancel()
          })

          // 5. The onSuccess event fires when payment is completed
          component.on('success', (result: any) => {
            setIsSubmitting(false)
            const paymentResult: TeyaPaymentResult = {
              paymentId: result.paymentId || result.id,
              orderId,
              status: result.status || 'COMPLETED',
              amount: result.amount || amount,
              currency: result.currency || currency,
              paymentMethod: result.paymentMethod,
            }
            onSuccess(paymentResult)
          })

          // 6. Mount the component
          if (containerRef.current) {
            component.mount(containerRef.current)
          }
        } else {
          // SDK not loaded - show development placeholder
          console.warn('Teya SDK not loaded, showing development placeholder')
          setSdkReady(true)
          setLoading(false)
        }
        
      } catch (err) {
        console.error('Payment initialization error:', err)
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize payment'
        setError(errorMessage)
        onError(errorMessage)
        setLoading(false)
      }
    }

    initializeCheckout()

    // Cleanup
    return () => {
      if (componentRef.current) {
        try {
          componentRef.current.destroy()
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    }
  }, [sdkLoading, amount, currency, orderId, customerEmail, customerName, description, onSuccess, onError, onCancel])

  // SDK loading state
  if (sdkLoading) {
    return (
      <div className="bg-white rounded-lg p-6 border border-[#E8DDD0]">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#8B1E22] animate-spin" />
          <span className="ml-3 text-[#6B5344]">Loading secure payment form...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 rounded-lg p-6 border border-red-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-700 font-medium">Payment Error</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-3 text-sm text-[#8B1E22] hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-[#E8DDD0]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#E8DDD0]">
        <CreditCard className="w-5 h-5 text-[#8B1E22]" />
        <h3 className="font-semibold text-[#3A2C2A]">Card Payment</h3>
      </div>

      {/* Amount display */}
      <div className="mb-4 p-4 bg-[#F7F2E9] rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-[#6B5344]">Amount to pay</span>
          <span className="text-xl font-bold text-[#8B1E22]">
            {currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$'}{amount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Loading state while initializing */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-[#8B1E22] animate-spin" />
          <span className="ml-2 text-sm text-[#6B5344]">Initializing secure payment...</span>
        </div>
      )}

      {/* SDK placeholder for development */}
      {!window.TeyaBlocks && (
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Teya Payment Form</p>
          <p className="text-gray-500 text-sm mt-1">
            Card number, expiry, and CVV fields will appear here.
          </p>
          <p className="text-gray-400 text-xs mt-3">
            (Development mode - SDK not loaded)
          </p>
          {/* Simulate success for testing */}
          <button
            onClick={() => onSuccess({
              paymentId: `dev_${Date.now()}`,
              orderId,
              status: 'COMPLETED',
              amount,
              currency,
            })}
            className="mt-4 px-4 py-2 bg-[#8B1E22] text-white rounded-lg hover:bg-[#6B1A1C] transition-colors"
          >
            Simulate Successful Payment (Dev Only)
          </button>
        </div>
      )}

      {/* Teya payment form container - SDK mounts here */}
      <div 
        ref={containerRef} 
        id="teya-checkout-container"
        className={`min-h-[200px] ${loading || !sdkReady ? 'hidden' : ''}`}
      />

      {/* Security badge */}
      <div className="mt-4 pt-4 border-t border-[#E8DDD0] flex items-center justify-center gap-2 text-xs text-[#6B5344]">
        <Lock className="w-4 h-4" />
        <span>Secured by Teya • 256-bit SSL encryption</span>
      </div>
    </div>
  )
}

// Hook to check if Teya is configured
export function useTeyaPayment() {
  const [isConfigured, setIsConfigured] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkConfiguration = async () => {
      try {
        const response = await fetch('/api/teya/status')
        if (response.ok) {
          const data = await response.json()
          setIsConfigured(data.configured)
        }
      } catch (err) {
        setIsConfigured(false)
      } finally {
        setLoading(false)
      }
    }

    checkConfiguration()
  }, [])

  return { isConfigured, loading }
}

export default TeyaCheckout
