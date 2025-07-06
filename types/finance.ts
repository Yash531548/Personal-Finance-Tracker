export interface Transaction {
  id?: string;
  _id?: string; // MongoDB ObjectId
  amount: number;
  description: string;
  date: string;
  type: 'expense' | 'income';
  category: string;
  createdAt: string;
}

export interface MonthlyExpense {
  month: string;
  amount: number;
  count: number;
}

export interface TransactionFormData {
  amount: string;
  description: string;
  date: string;
  type: 'expense' | 'income';
  category: string;
}

export interface Budget {
  id?: string;
  _id?: string; // MongoDB ObjectId
  category: string;
  monthlyLimit: number;
  createdAt: string;
}

export interface BudgetFormData {
  category: string;
  monthlyLimit: string;
}

export interface BudgetComparison {
  category: string;
  budgeted: number;
  actual: number;
  percentage: number;
  status: 'under' | 'over' | 'on-track';
}