// ============================================
// Cart Store - Zustand
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number; // retail or wholesale depending on user type
  imageUrl?: string;
  quantity: number;
  productionTime: number; // hours
  category: string;
}

interface CartState {
  items: CartItem[];
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Computed
  getItemCount: () => number;
  getSubtotal: () => number;
  getMaxProductionTime: () => number; // longest production time in hours
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existingItem = get().items.find(i => i.productId === item.productId);
        
        if (existingItem) {
          // Update quantity
          set((state) => ({
            items: state.items.map(i => 
              i.productId === item.productId 
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          }));
        } else {
          // Add new item with generated ID
          set((state) => ({
            items: [...state.items, { ...item, id: `cart-${Date.now()}` }]
          }));
        }
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(i => i.productId !== productId)
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
        set({ items: [] });
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getMaxProductionTime: () => {
        const items = get().items;
        if (items.length === 0) return 0;
        
        // Get the maximum production time (wait longest for any product)
        return Math.max(...items.map(item => item.productionTime));
      },
    }),
    {
      name: 'slindon-cart', // localStorage key
    }
  )
);

// ============================================
// User Store - Authentication State
// ============================================

export type UserType = 'RETAIL' | 'WHOLESALE';

interface UserState {
  userId: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  userType: UserType;
  wholesaleStatus: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
  
  // Actions
  setUser: (user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: UserType;
    wholesaleStatus: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
  }) => void;
  logout: () => void;
  
  // Computed
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

      isLoggedIn: () => {
        return get().userId !== null;
      },

      isWholesale: () => {
        return get().userType === 'WHOLESALE' && get().wholesaleStatus === 'APPROVED';
      },

      canSeeWholesalePricing: () => {
        return get().isWholesale();
      },
    }),
    {
      name: 'slindon-user', // localStorage key
    }
  )
);

// ============================================
// Checkout Store - Checkout Flow State
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
  
  // Actions
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