import { Transaction, TransactionFormData, Budget, BudgetFormData } from '@/types/finance';

// Transaction API functions
export const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await fetch('/api/transactions');
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

export const createTransaction = async (data: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction | null> => {
  try {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create transaction');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating transaction:', error);
    return null;
  }
};

export const updateTransaction = async (id: string, data: Partial<Transaction>): Promise<Transaction | null> => {
  try {
    const response = await fetch(`/api/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update transaction');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating transaction:', error);
    return null;
  }
};

export const deleteTransaction = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/transactions/${id}`, {
      method: 'DELETE',
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return false;
  }
};

// Budget API functions
export const fetchBudgets = async (): Promise<Budget[]> => {
  try {
    const response = await fetch('/api/budgets');
    if (!response.ok) {
      throw new Error('Failed to fetch budgets');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return [];
  }
};

export const createBudget = async (data: Omit<Budget, 'id' | 'createdAt'>): Promise<Budget | null> => {
  try {
    const response = await fetch('/api/budgets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create budget');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating budget:', error);
    return null;
  }
};

export const updateBudget = async (id: string, data: Partial<Budget>): Promise<Budget | null> => {
  try {
    const response = await fetch(`/api/budgets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update budget');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating budget:', error);
    return null;
  }
};

export const deleteBudget = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/budgets/${id}`, {
      method: 'DELETE',
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting budget:', error);
    return false;
  }
};