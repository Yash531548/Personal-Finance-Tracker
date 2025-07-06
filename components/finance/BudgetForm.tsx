'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Target, Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Budget, BudgetFormData } from '@/types/finance';

const formSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  monthlyLimit: z.string().min(1, 'Monthly limit is required').refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    'Monthly limit must be a positive number'
  ),
});

const categories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Travel',
  'Education',
  'Investment',
  'Other',
];

interface BudgetFormProps {
  onSubmit: (data: BudgetFormData) => void;
  editingBudget?: Budget;
  onCancel?: () => void;
  existingCategories?: string[];
}

export function BudgetForm({ onSubmit, editingBudget, onCancel, existingCategories = [] }: BudgetFormProps) {
  const form = useForm<BudgetFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: editingBudget?.category || '',
      monthlyLimit: editingBudget?.monthlyLimit.toString() || '',
    },
  });

  const handleSubmit = (data: BudgetFormData) => {
    onSubmit(data);
    if (!editingBudget) {
      form.reset();
    }
  };

  const availableCategories = categories.filter(category => 
    !existingCategories.includes(category) || category === editingBudget?.category
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              {editingBudget ? 'Edit Budget' : 'Set Budget'}
            </CardTitle>
            <CardDescription>
              {editingBudget ? 'Update your budget limit' : 'Set monthly spending limits for categories'}
            </CardDescription>
          </div>
          {editingBudget && onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={!!editingBudget}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {editingBudget ? 'Category cannot be changed' : 'Choose a category to set budget for'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="monthlyLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Budget Limit</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-8"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Set your monthly spending limit for this category
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                {editingBudget ? 'Update Budget' : 'Set Budget'}
              </Button>
              {editingBudget && onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}