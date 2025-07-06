'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, parse, subMonths, eachMonthOfInterval } from 'date-fns';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction, MonthlyExpense } from '@/types/finance';

interface MonthlyExpensesChartProps {
  transactions: Transaction[];
}

export function MonthlyExpensesChart({ transactions }: MonthlyExpensesChartProps) {
  const chartData = useMemo(() => {
    const now = new Date();
    const sixMonthsAgo = subMonths(now, 5);
    
    // Generate all months for the last 6 months
    const months = eachMonthOfInterval({
      start: sixMonthsAgo,
      end: now,
    });

    // Create a map of month data
    const monthlyData: Record<string, MonthlyExpense> = {};
    
    months.forEach(month => {
      const monthKey = format(month, 'yyyy-MM');
      monthlyData[monthKey] = {
        month: format(month, 'MMM yyyy'),
        amount: 0,
        count: 0,
      };
    });

    // Aggregate transactions by month
    transactions
      .filter(transaction => transaction.type === 'expense')
      .forEach(transaction => {
        const transactionDate = new Date(transaction.date);
        const monthKey = format(transactionDate, 'yyyy-MM');
        
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].amount += transaction.amount;
          monthlyData[monthKey].count += 1;
        }
      });

    return Object.values(monthlyData);
  }, [transactions]);

  const totalExpenses = chartData.reduce((sum, month) => sum + month.amount, 0);
  const averageExpenses = totalExpenses / chartData.length;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            {data.count} transaction{data.count !== 1 ? 's' : ''}
          </p>
          <p className="text-lg font-semibold text-red-600">
            ${data.amount.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
        <CardDescription>
          Your spending patterns over the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              ${totalExpenses.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Total Expenses</div>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              ${averageExpenses.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Monthly Average</div>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {chartData.reduce((sum, month) => sum + month.count, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Transactions</div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="amount" 
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}