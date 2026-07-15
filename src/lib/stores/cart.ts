// ============================================
// Cart Store - Zustand
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Helper function for formatting prices
export function formatPrice(amount: number): string {
  return `£${amount.toFixed(2)}`;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  leadTimeDays: number;
  category: string;
}

interface CartState {
  items: CartItem[];
  availabilityInfo: Record<string, {
    available: boolean;
    leadTimeDays: number;
  }>;
  
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  checkAvailability: () => Promise<{
    canFulfillToday: boolean;
    leadTimeDays: number;
    leadTimeDisplay: string;
    earliestDate: string;
    earliestTime: string;
    products: Array<{
      productId: string;
      name: string;
      available: boolean;
      leadTimeDays: number;
      leadTimeDisplay: string;
    }>;
  }>;
  
  getItemCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      availabilityInfo: {},
	
      addItem: (item) => {
        const existingItem = get().items.find(i => i.productId === item.productId);
        
        if (existingItem) {
          set((state) => ({
            items: state.items.map(i => 
              i.productId === item.productId 
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          }));
        } else {
          set((state) => ({
            items: [...state.items, { ...item, id: `cart-${Date.now()}` }]
          }));
        }
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(i => i.productId !== productId),
          availabilityInfo: Object.fromEntries(
            Object.entries(state.availabilityInfo).filter(([key]) => key !== productId)
          )
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set((state) => ({
          items: state.items.map(i => 
            i.productId === productId 
              ? { ...i, quantity }
              : i
          )
        }));
      },

      clearCart: () => {
        set({ items: [], availabilityInfo: {} });
      },

      checkAvailability: async () => {
        const items = get().items;
        
        if (items.length === 0) {
          return {
            canFulfillToday: true,
            leadTimeDays: 0,
            leadTimeDisplay: 'today',
            earliestDate: new Date().toISOString().split('T')[0],
            earliestTime: '09:00',
            products: [],
          };
        }

        try {
          const itemsParam = JSON.stringify(
            items.map(item => ({ productId: item.productId, quantity: item.quantity }))
          );
          
          const response = await fetch(`/api/availability?items=${encodeURIComponent(itemsParam)}`);
          
          if (!response.ok) {
            throw new Error('Failed to check availability');
          }
          
          const data = await response.json();
          
          const newAvailabilityInfo: Record<string, { available: boolean; leadTimeDays: number }> = {};
          for (const product of data.products) {
            newAvailabilityInfo[product.productId] = {
              available: product.available,
              leadTimeDays: product.leadTimeDays,
            };
          }
          set({ availabilityInfo: newAvailabilityInfo });
          
          return {
            canFulfillToday: data.canFulfillToday,
            leadTimeDays: data.leadTimeDays,
            leadTimeDisplay: data.leadTimeDisplay,
            earliestDate: data.earliestPickupDate,
            earliestTime: data.earliestPickupTime,
            products: data.products.map((p: { 
              productId: string; 
              name: string;
              available: boolean;
              leadTimeDays: number; 
              leadTimeDisplay: string;
            }) => ({
              productId: p.productId,
              name: p.name,
              available: p.available,
              leadTimeDays: p.leadTimeDays,
              leadTimeDisplay: p.leadTimeDisplay,
            })),
          };
        } catch (error) {
          console.error('Error checking availability:', error);
          return {
            canFulfillToday: true,
            leadTimeDays: 1,
            leadTimeDisplay: '1 day',
            earliestDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            earliestTime: '09:00',
            products: [],
          };
        }
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'slindon-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// ============================================
// User Store
// ============================================

export type UserType = 'RETAIL' | 'WHOLESALE';

interface UserState {
  userId: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  userType: UserType;
  wholesaleStatus: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
  
  setUser: (user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: UserType;
    wholesaleStatus: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
  }) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
  isWholesale: () => boolean;
  canSeeWholesalePricing: () => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userId: null,
      email: null,
      firstName: null,
      lastName: null,
      userType: 'RETAIL',
      wholesaleStatus: 'NONE',

      setUser: (user) => {
        set({
          userId: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
          wholesaleStatus: user.wholesaleStatus,
        });
      },

      logout: () => {
        set({
          userId: null,
          email: null,
          firstName: null,
          lastName: null,
          userType: 'RETAIL',
          wholesaleStatus: 'NONE',
        });
      },

      isLoggedIn: () => get().userId !== null,
      isWholesale: () => get().userType === 'WHOLESALE' && get().wholesaleStatus === 'APPROVED',
      canSeeWholesalePricing: () => get().isWholesale(),
    }),
    { name: 'slindon-user' }
  )
);

// ============================================
// Checkout Store
// ============================================

export type CheckoutStep = 'cart' | 'checkout' | 'slot' | 'delivery' | 'confirm';

interface CheckoutState {
  step: CheckoutStep;
  orderType: 'COLLECTION' | 'DELIVERY';
  selectedSlotId: string | null;
  deliveryPostcode: string;
  deliveryAddress: string;
  deliveryNotes: string;
  isDeliveryServiceable: boolean;
  
  setStep: (step: CheckoutStep) => void;
  setOrderType: (type: 'COLLECTION' | 'DELIVERY') => void;
  setSelectedSlot: (slotId: string) => void;
  setDeliveryInfo: (info: {
    postcode: string;
    address: string;
    notes: string;
    isServiceable: boolean;
  }) => void;
  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>()((set) => ({
  step: 'cart',
  orderType: 'COLLECTION',
  selectedSlotId: null,
  deliveryPostcode: '',
  deliveryAddress: '',
  deliveryNotes: '',
  isDeliveryServiceable: false,

  setStep: (step) => set({ step }),
  setOrderType: (type) => set({ orderType: type }),
  setSelectedSlot: (slotId) => set({ selectedSlotId: slotId }),
  setDeliveryInfo: (info) => set({
    deliveryPostcode: info.postcode,
    deliveryAddress: info.address,
    deliveryNotes: info.notes,
    isDeliveryServiceable: info.isServiceable,
  }),
  resetCheckout: () => set({
    step: 'cart',
    orderType: 'COLLECTION',
    selectedSlotId: null,
    deliveryPostcode: '',
    deliveryAddress: '',
    deliveryNotes: '',
    isDeliveryServiceable: false,
  }),
}));
