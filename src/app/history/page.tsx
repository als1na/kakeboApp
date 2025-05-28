
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { TransactionTable } from "@/components/history/TransactionTable";
import { FilterControls, type Filters } from "@/components/history/FilterControls";
import type { Transaction } from "@/lib/types";
import { subDays, startOfDay, endOfDay } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { getTransactionsForUser } from "@/lib/actions";
import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryPage() {
  const { user } = useAuth();
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const initialFilters: Filters = useMemo(() => ({ // useMemo to prevent re-creation on every render
    type: "all",
    category: "all",
    dateRange: {
      from: subDays(new Date(), 30),
      to: new Date(),
    },
  }), []);
  
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const fetchUserTransactions = useCallback(async () => {
    if (!user) {
      setAllTransactions([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const userTransactions = await getTransactionsForUser(user.uid);
      setAllTransactions(userTransactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime() ));
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setAllTransactions([]); // Set to empty on error
    } finally {
      setIsLoading(false);
    }
  }, [user]);


  useEffect(() => {
    fetchUserTransactions();
  }, [fetchUserTransactions]);

  // Refetch transactions if filters or user changes - useful if filters could influence server-side fetching in future
  // For now, filtering is client-side, but this structure is good.
  useEffect(() => {
     // This effect could trigger a refetch if filters were server-side
     // For client-side filtering, it's mostly about reacting to user changes
  }, [filters, user, fetchUserTransactions]);


  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const typeMatch = filters.type === "all" || transaction.type === filters.type;
      const categoryMatch = filters.category === "all" || transaction.category === filters.category;
      const dateMatch = filters.dateRange?.from && filters.dateRange?.to
        ? transactionDate >= startOfDay(filters.dateRange.from) && transactionDate <= endOfDay(filters.dateRange.to)
        : true;
      return typeMatch && categoryMatch && dateMatch;
    });
  }, [allTransactions, filters]);

  const periodTotals = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, t) => {
        if (t.type === 'income') acc.income += t.amount;
        else acc.expenses += t.amount;
        acc.net = acc.income - acc.expenses;
        return acc;
      },
      { income: 0, expenses: 0, net: 0 }
    );
  }, [filteredTransactions]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Historial de Transacciones</h1>
        <Skeleton className="h-20 w-full" /> {/* FilterControls Skeleton */}
        <Skeleton className="h-64 w-full" /> {/* Table Skeleton */}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Historial de Transacciones</h1>
        <p className="text-muted-foreground">Por favor, inicia sesión para ver tu historial.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Historial de Transacciones</h1>
      <FilterControls onFilterChange={setFilters} initialFilters={initialFilters} />
      <div className="border rounded-lg shadow-sm overflow-hidden">
        <TransactionTable transactions={filteredTransactions} periodTotals={periodTotals} />
      </div>
    </div>
  );
}
