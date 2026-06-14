import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface AvailabilityResult {
  productId: string
  name: string
  stockQuantity: number
  productionTimeHours: number
  availableToday: boolean
  availableTodayQuantity: number
  reason?: string
}

interface CartItem {
  productId: string
  quantity: number
}

// GET /api/availability - Check if cart items are available for pickup
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemsParam = searchParams.get('items');
    
    if (!itemsParam) {
      return NextResponse.json(
        { error: 'Items parameter is required' },
        { status: 400 }
      );
    }

    let items: CartItem[];
    try {
      items = JSON.parse(itemsParam);
    } catch {
      return NextResponse.json(
        { error: 'Invalid items format' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'At least one item is required' },
        { status: 400 }
      );
    }

    // Get product IDs
    const productIds = items.map(item => item.productId);

    // Fetch products with stock info
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        available: true,
      },
      select: {
        id: true,
        name: true,
        stockQuantity: true,
        productionTimeHours: true,
      },
    });

    // Create a map for quick lookup
    const productMap = new Map(products.map(p => [p.id, p]));

    // Calculate availability for each item
    const results: AvailabilityResult[] = [];
    let canFulfillToday = true;
    let minWaitHours = 0;

    for (const item of items) {
      const product = productMap.get(item.productId);
      
      if (!product) {
        results.push({
          productId: item.productId,
          name: 'Unknown Product',
          stockQuantity: 0,
          productionTimeHours: 24,
          availableToday: false,
          availableTodayQuantity: 0,
          reason: 'Product not found or unavailable',
        });
        canFulfillToday = false;
        continue;
      }

      const availableTodayQuantity = Math.min(product.stockQuantity, item.quantity);
      const hasStock = product.stockQuantity >= item.quantity;
      
      results.push({
        productId: product.id,
        name: product.name,
        stockQuantity: product.stockQuantity,
        productionTimeHours: product.productionTimeHours,
        availableToday: hasStock,
        availableTodayQuantity,
        reason: hasStock 
          ? 'In stock at Camberley' 
          : `Needs ${product.productionTimeHours}h production (${product.stockQuantity} in stock, need ${item.quantity})`,
      });

      if (!hasStock) {
        canFulfillToday = false;
        minWaitHours = Math.max(minWaitHours, product.productionTimeHours);
      }
    }

    // Calculate the earliest pickup date/time
    const now = new Date();
    const earliestPickup = new Date(now.getTime() + minWaitHours * 60 * 60 * 1000);
    
    // Round up to the next hour
    earliestPickup.setMinutes(0, 0, 0);
    if (minWaitHours === 0) {
      // Can pickup today - but only during business hours
      const businessHours = { open: 9, close: 17 };
      if (now.getHours() < businessHours.open) {
        earliestPickup.setHours(businessHours.open);
      } else if (now.getHours() >= businessHours.close) {
        // After hours, suggest tomorrow
        earliestPickup.setDate(earliestPickup.getDate() + 1);
        earliestPickup.setHours(businessHours.open);
      }
    }

    // Check available time slots for the earliest date
    const availableSlots = getAvailableSlots(earliestPickup, canFulfillToday ? 0 : minWaitHours);

    return NextResponse.json({
      canFulfillToday,
      minWaitHours,
      earliestPickupDate: earliestPickup.toISOString().split('T')[0],
      earliestPickupTime: earliestPickup.toTimeString().slice(0, 5),
      availableSlots,
      products: results,
      businessHours: {
        open: '09:00',
        close: '17:00',
        days: 'Monday - Saturday',
      },
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}

// Helper function to get available slots
function getAvailableSlots(date: Date, waitHours: number): string[] {
  // Standard time slots
  const allSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  
  const dateStr = date.toISOString().split('T')[0];
  const currentHour = new Date().getHours();
  
  // Filter out past slots for today
  if (dateStr === new Date().toISOString().split('T')[0]) {
    return allSlots.filter(slot => {
      const slotHour = parseInt(slot.split(':')[0], 10);
      return slotHour > currentHour;
    });
  }
  
  return allSlots;
}

// POST /api/availability - Check a single product's availability
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        stockQuantity: true,
        productionTimeHours: true,
        available: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const hasStock = product.stockQuantity >= quantity;
    const canFulfillToday = product.available && hasStock;
    
    // Calculate earliest pickup
    const waitHours = canFulfillToday ? 0 : product.productionTimeHours;
    const earliestPickup = new Date(Date.now() + waitHours * 60 * 60 * 1000);
    earliestPickup.setMinutes(0, 0, 0);

    return NextResponse.json({
      productId: product.id,
      name: product.name,
      inStock: hasStock,
      stockQuantity: product.stockQuantity,
      productionTimeHours: product.productionTimeHours,
      canFulfillToday,
      availableQuantity: hasStock ? quantity : product.stockQuantity,
      earliestPickupDate: earliestPickup.toISOString().split('T')[0],
      earliestPickupTime: earliestPickup.toTimeString().slice(0, 5),
      message: hasStock 
        ? 'Available for pickup today!' 
        : `Production time: ${product.productionTimeHours} hours. Available from ${earliestPickup.toLocaleDateString('en-GB')} ${earliestPickup.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`,
    });
  } catch (error) {
    console.error('Error checking product availability:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}