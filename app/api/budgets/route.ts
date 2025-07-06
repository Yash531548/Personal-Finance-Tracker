import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Budget from '@/models/Budget';

export async function GET() {
  try {
    await connectDB();
    const budgets = await Budget.find({}).sort({ createdAt: -1 });
    return NextResponse.json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Check if budget for this category already exists
    const existingBudget = await Budget.findOne({ category: body.category });
    
    if (existingBudget) {
      // Update existing budget
      existingBudget.monthlyLimit = body.monthlyLimit;
      const savedBudget = await existingBudget.save();
      return NextResponse.json(savedBudget);
    } else {
      // Create new budget
      const budget = new Budget({
        category: body.category,
        monthlyLimit: body.monthlyLimit,
      });

      const savedBudget = await budget.save();
      return NextResponse.json(savedBudget, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating/updating budget:', error);
    return NextResponse.json(
      { error: 'Failed to create/update budget' },
      { status: 500 }
    );
  }
}