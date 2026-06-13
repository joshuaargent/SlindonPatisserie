import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/admin/products/stock - Get all products with stock info
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');
    const lowStock = searchParams.get('lowStock') === 'true';
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (lowStock) {
      where.stockQuantity = { lte: 10 };
    }
    
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { stockQuantity: 'asc' },
        { name: 'asc' },
      ],
    });

    // Calculate stock status
    const productsWithStatus = products.map(product => {
      let status: 'in_stock' | 'low_stock' | 'out_of_stock';
      if (product.stockQuantity <= 0) {
        status = 'out_of_stock';
      } else if (product.stockQuantity <= 10) {
        status = 'low_stock';
      } else {
        status = 'in_stock';
      }
      
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category.name,
        categoryId: product.categoryId,
        retailPrice: product.retailPrice,
        stockQuantity: product.stockQuantity,
        status,
        available: product.available,
        image: product.image,
      };
    });

    // Get summary stats
    const stats = {
      total: products.length,
      inStock: productsWithStatus.filter(p => p.status === 'in_stock').length,
      lowStock: productsWithStatus.filter(p => p.status === 'low_stock').length,
      outOfStock: productsWithStatus.filter(p => p.status === 'out_of_stock').length,
      unavailable: products.filter(p => !p.available).length,
    };

    return NextResponse.json({ products: productsWithStatus, stats });
  } catch (error) {
    console.error('Error fetching stock:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/products/stock - Update stock quantity
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, stockQuantity, available } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    
    if (typeof stockQuantity === 'number') {
      if (stockQuantity < 0) {
        return NextResponse.json(
          { error: 'Stock quantity cannot be negative' },
          { status: 400 }
        );
      }
      updateData.stockQuantity = stockQuantity;
    }
    
    if (typeof available === 'boolean') {
      updateData.available = available;
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
      select: {
        id: true,
        name: true,
        stockQuantity: true,
        available: true,
      },
    });

    return NextResponse.json({ 
      success: true,
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json(
      { error: 'Failed to update stock' },
      { status: 500 }
    );
  }
}