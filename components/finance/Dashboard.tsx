'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, TrendingDown, TrendingUp, DollarSign, PieChart, Target } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Transaction, TransactionFormData, Budget, BudgetFormData } from '@/types/finance';
import { 
  fetchTransactions, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction,
  fetchBudgets,
  createBudget,
  updateBudget,
  deleteBudget
} from '@/lib/api';
import { TransactionForm } from './TransactionForm';
import { TransactionList } from './TransactionList';
import { MonthlyExpensesChart } from './MonthlyExpensesChart';
import { CategoryPieChart } from './CategoryPieChart';
import { BudgetForm } from './BudgetForm';
import { BudgetList } from './BudgetList';
import { BudgetComparisonChart } from './BudgetComparisonChart';
import { SpendingInsights } from './SpendingInsights';

export function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [transactionsData, budgetsData] = await Promise.all([
        fetchTransactions(),
        fetchBudgets()
      ]);
      setTransactions(transactionsData);
      setBudgets(budgetsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (data: TransactionFormData) => {
    const newTransaction = await createTransaction({
      amount: parseFloat(data.amount),
      description: data.description,
      date: data.date,
      type: data.type,
      category: data.category,
    });
    
    if (newTransaction) {
      setTransactions(prev => [newTransaction, ...prev]);
      setShowTransactionForm(false);
    }
  };

  const handleUpdateTransaction = async (data: TransactionFormData) => {
    if (!editingTransaction) return;
    
    const updatedTransaction = await updateTransaction(editingTransaction._id || editingTransaction.id, {
      amount: parseFloat(data.amount),
      description: data.description,
      date: data.date,
      type: data.type,
      category: data.category,
    });
    
    if (updatedTransaction) {
      setTransactions(prev => 
        prev.map(t => (t._id || t.id) === (editingTransaction._id || editingTransaction.id) ? updatedTransaction : t)
      );
    }
    
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = async (id: string) => {
    const success = await deleteTransaction(id);
    if (success) {
      setTransactions(prev => prev.filter(t => (t._id || t.id) !== id));
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
  };

  const handleCancelTransactionEdit = () => {
    setEditingTransaction(null);
    setShowTransactionForm(false);
  };

  const handleAddBudget = async (data: BudgetFormData) => {
    const newBudget = await createBudget({
      category: data.category,
      monthlyLimit: parseFloat(data.monthlyLimit),
    });
    
    if (newBudget) {
      setBudgets(prev => {
        const filtered = prev.filter(b => b.category !== data.category);
        return [...filtered, newBudget];
      });
      setShowBudgetForm(false);
    }
  };

  const handleUpdateBudget = async (data: BudgetFormData) => {
    if (!editingBudget) return;
    
    const updatedBudget = await updateBudget(editingBudget._id || editingBudget.id, {
      monthlyLimit: parseFloat(data.monthlyLimit),
    });
    
    if (updatedBudget) {
      setBudgets(prev => 
        prev.map(b => (b._id || b.id) === (editingBudget._id || editingBudget.id) ? updatedBudget : b)
      );
    }
    
    setEditingBudget(null);
  };

  const handleDeleteBudget = async (id: string) => {
    const success = await deleteBudget(id);
    if (success) {
      setBudgets(prev => prev.filter(b => (b._id || b.id) !== id));
    }
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setShowBudgetForm(true);
  };

  const handleCancelBudgetEdit = () => {
    setEditingBudget(null);
    setShowBudgetForm(false);
  };

  // Calculate summary statistics
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  // Calculate category breakdown for summary
  const categoryBreakdown = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryBreakdown)
    .sort(([,a], [,b]) => b - a)[0];

  const recentTransactions = transactions.slice(0, 5);
  const existingBudgetCategories = budgets.map(b => b.category);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Personal Finance Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Track your income, expenses, and budgets with beautiful insights
          </p>
        </div>

        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${totalIncome.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                +{transactions.filter(t => t.type === 'income').length} transactions
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${totalExpenses.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                -{transactions.filter(t => t.type === 'expense').length} transactions
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${netBalance.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {netBalance >= 0 ? 'Surplus' : 'Deficit'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Category</CardTitle>
              <PieChart className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-purple-600">
                {topCategory ? topCategory[0] : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                {topCategory ? `$${topCategory[1].toFixed(2)} spent` : 'No expenses yet'}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <MonthlyExpensesChart transactions={transactions} />
              <CategoryPieChart transactions={transactions} />
            </div>

            {/* Budget and Insights Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <BudgetComparisonChart transactions={transactions} budgets={budgets} />
              <SpendingInsights transactions={transactions} budgets={budgets} />
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column - Form and Recent Transactions */}
              <div className="xl:col-span-1 space-y-6">
                {/* Add Transaction Button */}
                {!showTransactionForm && (
                  <Card>
                    <CardContent className="p-6">
                      <Button
                        onClick={() => setShowTransactionForm(true)}
                        className="w-full h-12 text-lg"
                        size="lg"
                      >
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Add Transaction
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Transaction Form */}
                {showTransactionForm && (
                  <TransactionForm
                    onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
                    editingTransaction={editingTransaction}
                    onCancel={handleCancelTransactionEdit}
                  />
                )}

                {/* Recent Transactions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>
                      Your latest financial activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentTransactions.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No transactions yet</p>
                        <p className="text-sm text-muted-foreground">
                          Add your first transaction to get started
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentTransactions.map((transaction) => (
                          <div
                            key={transaction._id || transaction.id}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge 
                                  variant={transaction.type === 'expense' ? 'destructive' : 'default'}
                                  className={transaction.type === 'income' ? 'bg-green-500' : ''}
                                >
                                  {transaction.type}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {transaction.category}
                                </span>
                              </div>
                              <p className="font-medium text-sm">{transaction.description}</p>
                            </div>
                            <div className={`text-sm font-semibold ${
                              transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Transaction List */}
              <div className="xl:col-span-2">
                <TransactionList
                  transactions={transactions}
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteTransaction}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="budgets" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column - Budget Form */}
              <div className="xl:col-span-1 space-y-6">
                {/* Add Budget Button */}
                {!showBudgetForm && (
                  <Card>
                    <CardContent className="p-6">
                      <Button
                        onClick={() => setShowBudgetForm(true)}
                        className="w-full h-12 text-lg"
                        size="lg"
                      >
                        <Target className="w-5 h-5 mr-2" />
                        Set Budget
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Budget Form */}
                {showBudgetForm && (
                  <BudgetForm
                    onSubmit={editingBudget ? handleUpdateBudget : handleAddBudget}
                    editingBudget={editingBudget}
                    onCancel={handleCancelBudgetEdit}
                    existingCategories={existingBudgetCategories}
                  />
                )}

                {/* Budget List */}
                <BudgetList
                  budgets={budgets}
                  onEdit={handleEditBudget}
                  onDelete={handleDeleteBudget}
                />
              </div>

              {/* Right Column - Budget Charts */}
              <div className="xl:col-span-2 space-y-6">
                <BudgetComparisonChart transactions={transactions} budgets={budgets} />
                <SpendingInsights transactions={transactions} budgets={budgets} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}