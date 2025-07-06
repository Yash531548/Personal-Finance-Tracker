'use client';

import { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transaction, Budget } from '@/types/finance';

interface SpendingInsightsProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export function SpendingInsights({ transactions, budgets }: SpendingInsightsProps) {
  const insights = useMemo(() => {
    const currentMonth = new Date();
    const lastMonth = subMonths(currentMonth, 1);
    
    const currentMonthStart = startOfMonth(currentMonth);
    const currentMonthEnd = endOfMonth(currentMonth);
    const lastMonthStart = startOfMonth(lastMonth);
    const lastMonthEnd = endOfMonth(lastMonth);

    // Calculate current month spending
    const currentMonthExpenses = transactions
      .filter(t => t.type === 'expense' && isWithinInterval(new Date(t.date), {
        start: currentMonthStart,
        end: currentMonthEnd
      }))
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate last month spending
    const lastMonthExpenses = transactions
      .filter(t => t.type === 'expense' && isWithinInterval(new Date(t.date), {
        start: lastMonthStart,
        end: lastMonthEnd
      }))
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate spending change
    const spendingChange = lastMonthExpenses > 0 
      ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 
      : 0;

    // Calculate category spending for current month
    const categorySpending: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense' && isWithinInterval(new Date(t.date), {
        start: currentMonthStart,
        end: currentMonthEnd
      }))
      .forEach(t => {
        categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
      });

    // Find highest spending category
    const highestCategory = Object.entries(categorySpending)
      .sort(([,a], [,b]) => b - a)[0];

    // Calculate budget adherence
    const totalBudget = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
    const budgetUsage = totalBudget > 0 ? (currentMonthExpenses / totalBudget) * 100 : 0;

    // Find categories over budget
    const overBudgetCategories = budgets.filter(budget => {
      const spent = categorySpending[budget.category] || 0;
      return spent > budget.monthlyLimit;
    });

    // Calculate average daily spending
    const daysInMonth = currentMonthEnd.getDate();
    const currentDay = new Date().getDate();
    const avgDailySpending = currentDay > 0 ? currentMonthExpenses / currentDay : 0;
    const projectedMonthlySpending = avgDailySpending * daysInMonth;

    return {
      currentMonthExpenses,
      lastMonthExpenses,
      spendingChange,
      highestCategory,
      budgetUsage,
      overBudgetCategories,
      avgDailySpending,
      projectedMonthlySpending,
      totalBudget,
    };
  }, [transactions, budgets]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'negative': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <TrendingUp className="w-5 h-5 text-blue-600" />;
    }
  };

  const getInsightType = (change: number) => {
    if (change < -10) return 'positive';
    if (change > 20) return 'negative';
    if (change > 10) return 'warning';
    return 'info';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Insights</CardTitle>
        <CardDescription>
          Smart, personalized insights from your spending and budget data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Monthly Comparison */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Monthly Spending Trend</h3>
              {insights.spendingChange !== 0 && (
                <div className="flex items-center gap-2">
                  {insights.spendingChange > 0 ? (
                    <TrendingUp className="w-4 h-4 text-red-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-green-600" />
                  )}
                  <Badge 
                    variant={insights.spendingChange > 0 ? 'destructive' : 'default'}
                    className={insights.spendingChange < 0 ? 'bg-green-500 hover:bg-green-600' : ''}
                  >
                    {insights.spendingChange > 0 ? '+' : ''}{insights.spendingChange.toFixed(1)}%
                  </Badge>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">This Month</p>
                <p className="font-semibold">${insights.currentMonthExpenses.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Month</p>
                <p className="font-semibold">${insights.lastMonthExpenses.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Budget Overview */}
          {budgets.length > 0 && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Budget Performance</h3>
                <Badge 
                  variant={insights.budgetUsage > 100 ? 'destructive' : insights.budgetUsage > 80 ? 'default' : 'default'}
                  className={insights.budgetUsage <= 80 ? 'bg-green-500 hover:bg-green-600' : insights.budgetUsage <= 100 ? 'bg-amber-500 hover:bg-amber-600' : ''}
                >
                  {insights.budgetUsage.toFixed(0)}% Used
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Budget</p>
                  <p className="font-semibold">${insights.totalBudget.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Remaining</p>
                  <p className="font-semibold">
                    ${Math.max(0, insights.totalBudget - insights.currentMonthExpenses).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Key Insights */}
          <div className="space-y-3">
            <h3 className="font-semibold">Key Insights</h3>
            
            {/* Spending projection */}
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Monthly Projection</p>
                <p className="text-sm text-muted-foreground">
                  Based on your current spending rate (${insights.avgDailySpending.toFixed(2)}/day), 
                  you're projected to spend ${insights.projectedMonthlySpending.toFixed(2)} this month.
                </p>
              </div>
            </div>

            {/* Highest spending category */}
            {insights.highestCategory && (
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Top Spending Category</p>
                  <p className="text-sm text-muted-foreground">
                    You've spent the most on <strong>{insights.highestCategory[0]}</strong> 
                    (${insights.highestCategory[1].toFixed(2)}) this month.
                  </p>
                </div>
              </div>
            )}

            {/* Over budget warning */}
            {insights.overBudgetCategories.length > 0 && (
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Budget Alert</p>
                  <p className="text-sm text-muted-foreground">
                    You're over budget in {insights.overBudgetCategories.length} 
                    {insights.overBudgetCategories.length === 1 ? ' category' : ' categories'}: {' '}
                    {insights.overBudgetCategories.map(b => b.category).join(', ')}.
                  </p>
                </div>
              </div>
            )}

            {/* Positive insight */}
            {insights.spendingChange < -10 && (
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Great Progress!</p>
                  <p className="text-sm text-muted-foreground">
                    You've reduced your spending by {Math.abs(insights.spendingChange).toFixed(1)}% 
                    compared to last month. Keep it up!
                  </p>
                </div>
              </div>
            )}

            {/* No insights fallback */}
            {insights.currentMonthExpenses === 0 && (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Getting Started</p>
                  <p className="text-sm text-muted-foreground">
                    Add some transactions to start seeing personalized spending insights.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}