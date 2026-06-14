import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getNextBusinessDay, getEarliestPickupDate, getEarliestTimeSlot, formatLeadTime, isBusinessDay } from '@/lib/utils';

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
        leadTimeDays: true,
      },
    });

    const productMap = new Map(products.map(p => [p.id, p]));
    const now = new Date();
    let canFulfillToday = true;
    let maxLeadTime = 0;

    const results = items.map(item => {
      const product = productMap.get(item.productId);
      
      if (!product) {
        return {
          productId: item.productId,
          name: 'Unknown Product',
          inStock: false,
          leadTimeDays: 1,
          leadTimeDisplay: '1 day',
        };
      }

      const hasStock = product.stockQuantity >= item.quantity;
      
      if (!hasStock) {
        canFulfillToday = false;
        maxLeadTime = Math.max(maxLeadTime, product.leadTimeDays);
      }

      return {
        productId: product.id,
        name: product.name,
        inStock: hasStock,
        stockQuantity: product.stockQuantity,
        leadTimeDays: product.leadTimeDays,
        leadTimeDisplay: formatLeadTime(product.leadTimeDays),
      };
    });

    // Calculate earliest pickup
    const earliestDate = getEarliestPickupDate(maxLeadTime, canFulfillToday);
    const earliestTime = getEarliestTimeSlot(now);

    // Get available slots
    const availableSlots = getAvailableSlots(earliestDate, now);

    return NextResponse.json({
      canFulfillToday,
      leadTimeDays: maxLeadTime,
      leadTimeDisplay: formatLeadTime(maxLeadTime),
      earliestPickupDate: earliestDate.toISOString().split('T')[0],
      earliestPickupTime: earliestTime,
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

function getAvailableSlots(date: Date, now: Date): string[] {
  const allSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  
  const dateStr = date.toISOString().split('T')[0];
  const todayStr = now.toISOString().split('T')[0];
  
  if (dateStr === todayStr) {
    const currentHour = now.getHours();
    return allSlots.filter(slot => {
      const slotHour = parseInt(slot.split(':')[0], 10);
      return slotHour > currentHour;
    });
  }
  
  return allSlots;
}

// POST /api/availability - Check a single product
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
        leadTimeDays: true,
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
    
    const earliestDate = getEarliestPickupDate(
      canFulfillToday ? 0 : product.leadTimeDays,
      hasStock
    );
    const earliestTime = getEarliestTimeSlot(new Date());

    return NextResponse.json({
      productId: product.id,
      name: product.name,
      inStock: hasStock,
      stockQuantity: product.stockQuantity,
      leadTimeDays: product.leadTimeDays,
      leadTimeDisplay: formatLeadTime(product.leadTimeDays),
      canFulfillToday,
      availableQuantity: hasStock ? quantity : product.stockQuantity,
      earliestPickupDate: earliestDate.toISOString().split('T')[0],
      earliestPickupTime: earliestTime,
      message: hasStock 
        ? 'Available for pickup today!' 
        : `Lead time: ${formatLeadTime(product.leadTimeDays)}. Available from ${earliestDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}`,
    });
  } catch (error) {
    console.error('Error checking product availability:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}