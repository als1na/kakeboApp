
// src/components/dashboard/ExpenseBreakdownChart.tsx
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { Transaction } from '@/lib/types';
import { transactionCategories } from '@/lib/types';
import { subDays, startOfDay, endOfDay, isValid } from 'date-fns';
import { getTransactionsForUser } from '@/lib/actions'; // To fetch user-specific transactions
import { Skeleton } from '../ui/skeleton';

const chartConfig = {
  gastos: {
    label: 'Gastos (€)',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

interface ExpenseBreakdownChartProps {
  userId: string; // Expect userId as a prop
}

export function ExpenseBreakdownChart({ userId }: ExpenseBreakdownChartProps) {
  const [chartData, setChartData] = useState<Array<{ category: string; gastos: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAndProcessTransactions = useCallback(async () => {
    if (!userId) {
        setChartData([]);
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    try {
      const userTransactions = await getTransactionsForUser(userId);
      
      const thirtyDaysAgo = startOfDay(subDays(new Date(), 30));
      const today = endOfDay(new Date());

      const recentExpenses = userTransactions
        .filter((t: Transaction) => isValid(new Date(t.date))) // Ensure date is valid
        .filter(
          (t) =>
            t.type === 'expense' &&
            new Date(t.date) >= thirtyDaysAgo &&
            new Date(t.date) <= today
        );

      const expensesByCategory = recentExpenses.reduce((acc, transaction) => {
        const categoryLabel =
          transactionCategories.find((cat) => cat.value === transaction.category)?.label || transaction.category;
        acc[categoryLabel] = (acc[categoryLabel] || 0) + transaction.amount;
        return acc;
      }, {} as Record<string, number>);

      const formattedChartData = Object.entries(expensesByCategory)
        .map(([category, total]) => ({
          category,
          gastos: total,
        }))
        .sort((a, b) => b.gastos - a.gastos);

      setChartData(formattedChartData);
    } catch (error) {
      console.error("Error fetching or processing transactions for chart:", error);
      setChartData([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);
  
  useEffect(() => {
    fetchAndProcessTransactions();
     // Listen for custom 'storage' event which we can dispatch after adding/updating transactions
    const handleStorageUpdate = () => fetchAndProcessTransactions();
    window.addEventListener('storage', handleStorageUpdate);
    return () => window.removeEventListener('storage', handleStorageUpdate);
  }, [fetchAndProcessTransactions]);


  if (isLoading) {
    return <Skeleton className="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px]" />;
  }

  if (chartData.length === 0) {
    return <div className="flex items-center justify-center h-full"><p>No hay datos de gastos para mostrar en los últimos 30 días.</p></div>;
  }

  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{
            top: 20,
            right: 20,
            bottom: 60, // Increased for rotated XAxis labels
            left: 20,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            angle={-45}
            textAnchor="end"
            interval={0}
            height={70} // Adjusted height for rotated labels
            tickFormatter={(value) => value.length > 15 ? `${value.substring(0,15)}...` : value}
          />
          <YAxis
            tickFormatter={(value) => `€${Number(value).toLocaleString('es-ES')}`}
            tickLine={false}
            axisLine={false}
            tickMargin={5}
            width={80}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent 
                        formatter={(value, name, props) => [`${props.payload.category}: €${Number(value).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, null]} 
                        labelFormatter={() => ''} // Hide the default label which would be the category again
                        indicator="dot" 
                    />}
          />
          <Bar dataKey="gastos" fill="var(--color-gastos)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
