'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, startOfMonth, endOfMonth } from 'date-fns';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transaction, Budget, BudgetComparison } from '@/types/finance';

interface BudgetComparisonChartProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export function BudgetComparisonChart({ transactions, budgets }: BudgetComparisonChartProps) {
  const chartData = useMemo(() => {
    const currentMonth = new Date();
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    // Calculate actual spending for current month by category
    const actualSpending: Record<string, number> = {};
    
    transactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transaction.type === 'expense' && 
               transactionDate >= monthStart && 
               transactionDate <= monthEnd;
      })
      .forEach(transaction => {
        actualSpending[transaction.category] = (actualSpending[transaction.category] || 0) + transaction.amount;
      });

    // Create comparison data
    const comparisons: BudgetComparison[] = budgets.map(budget => {
      const actual = actualSpending[budget.category] || 0;
      const percentage = budget.monthlyLimit > 0 ? (actual / budget.monthlyLimit) * 100 : 0;
      
      let status: 'under' | 'over' | 'on-track' = 'under';
      if (percentage > 100) status = 'over';
      else if (percentage >= 80) status = 'on-track';

      return {
        category: budget.category,
        budgeted: budget.monthlyLimit,
        actual,
        percentage,
        status,
      };
    });

    return comparisons.sort((a, b) => b.percentage - a.percentage);
  }, [transactions, budgets]);

  const getBarColor = (status: string) => {
    switch (status) {
      case 'over': return '#ef4444'; // red
      case 'on-track': return '#f59e0b'; // amber
      case 'under': return '#22c55e'; // green
      default: return '#6b7280'; // gray
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-4 border rounded-lg shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-muted-foreground">Budgeted:</span> ${data.budgeted.toFixed(2)}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Actual:</span> ${data.actual.toFixed(2)}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Usage:</span> {data.percentage.toFixed(1)}%
            </p>
            <Badge 
              variant={data.status === 'over' ? 'destructive' : 'default'}
              className={
                data.status === 'under' ? 'bg-green-500 hover:bg-green-600' :
                data.status === 'on-track' ? 'bg-amber-500 hover:bg-amber-600' : ''
              }
            >
              {data.status === 'over' ? 'Over Budget' : 
               data.status === 'on-track' ? 'Near Limit' : 'Under Budget'}
            </Badge>
          </div>
        </div>
      );
    }
    return null;
  };

  if (budgets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual</CardTitle>
          <CardDescription>
            Compare your spending against budgets for {format(new Date(), 'MMMM yyyy')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-80">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">No budgets set</p>
              <p className="text-sm text-muted-foreground">
                Set category budgets to track your spending
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Actual</CardTitle>
        <CardDescription>
          Compare your spending against budgets for {format(new Date(), 'MMMM yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="budgeted" 
                  fill="#e5e7eb"
                  radius={[2, 2, 0, 0]}
                  name="Budget"
                />
                <Bar 
                  dataKey="actual" 
                  radius={[2, 2, 0, 0]}
                  name="Actual"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold">
                {chartData.filter(d => d.status === 'over').length}
              </div>
              <div className="text-sm text-muted-foreground">Over Budget</div>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {chartData.map((item) => (
                <div
                  key={item.category}
                  className="p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{item.category}</span>
                    <Badge 
                      variant={item.status === 'over' ? 'destructive' : 'default'}
                      className={
                        item.status === 'under' ? 'bg-green-500 hover:bg-green-600' :
                        item.status === 'on-track' ? 'bg-amber-500 hover:bg-amber-600' : ''
                      }
                    >
                      {item.percentage.toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ${item.actual.toFixed(2)} / ${item.budgeted.toFixed(2)}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(item.percentage, 100)}%`,
                        backgroundColor: getBarColor(item.status),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}