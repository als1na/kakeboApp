
// src/app/page.tsx
'use client';

import { useEffect, useState, useCallback } from "react";
import { DollarSign, TrendingUp, TrendingDown, Target, Loader2 } from "lucide-react";
import { MonthlySummaryCard } from "@/components/dashboard/MonthlySummaryCard";
import { SavingsProgressBar } from "@/components/dashboard/SavingsProgressBar";
import { ExpenseBreakdownChart } from "@/components/dashboard/ExpenseBreakdownChart";
import type { MonthlySummaryData, Transaction, SavingsGoal } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { getTransactionsForUser, getSavingsGoalForUser } from "@/lib/actions"; // Placeholder for actual Firestore fetch
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";


// Default values if no data is loaded
const DEFAULT_SAVINGS_GOAL = 0; // Will be fetched from user's profile
const DEFAULT_STARTING_BALANCE = 0; // This might be more complex to track or user-set

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<MonthlySummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savingsGoal, setSavingsGoal] = useState<SavingsGoal>({ targetAmount: DEFAULT_SAVINGS_GOAL });

  const calculateSummaryData = useCallback(() => {
    if (!user) {
      // Reset summary if user logs out or is not available
      setSummary({
        startingBalance: DEFAULT_STARTING_BALANCE,
        totalIncome: 0,
        totalExpenses: 0,
        netSavings: 0,
        savingsGoal: savingsGoal.targetAmount,
        savingsDifference: 0 - savingsGoal.targetAmount,
        savingsProgress: 0,
      });
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true); // Set loading true when recalculating for a user

    let totalIncome = 0;
    let totalExpenses = 0;

    // Filter transactions for the current month (example)
    // You might want a more sophisticated date filtering logic (e.g., user-selectable period)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    transactions.forEach(t => {
      const transactionDate = new Date(t.date);
      if (transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear) {
        if (t.type === 'income') totalIncome += t.amount;
        else totalExpenses += t.amount;
      }
    });
    
    const netSavings = totalIncome - totalExpenses;
    const savingsGoalAmount = savingsGoal.targetAmount;
    const savingsDifference = netSavings - savingsGoalAmount;
    
    let savingsProgress = 0;
    if (savingsGoalAmount > 0) {
        savingsProgress = Math.max(0, Math.min(100, (netSavings / savingsGoalAmount) * 100));
    } else if (netSavings > 0) {
        savingsProgress = 100; // Achieved 100% if goal is 0 and savings are positive
    }


    setSummary({
      startingBalance: DEFAULT_STARTING_BALANCE, // Needs a proper source
      totalIncome,
      totalExpenses,
      netSavings,
      savingsGoal: savingsGoalAmount,
      savingsDifference,
      savingsProgress,
    });
    setIsLoading(false);
  }, [user, transactions, savingsGoal]);


  const fetchData = useCallback(async () => {
    if (!user) {
      setTransactions([]);
      setSavingsGoal({ targetAmount: DEFAULT_SAVINGS_GOAL });
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const userTransactions = await getTransactionsForUser(user.uid);
      setTransactions(userTransactions);

      // Fetch savings goal from user's document in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists() && userDocSnap.data().savingsGoal) {
        setSavingsGoal(userDocSnap.data().savingsGoal as SavingsGoal);
      } else {
        setSavingsGoal({ targetAmount: DEFAULT_SAVINGS_GOAL }); // Default if not set
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setTransactions([]);
      setSavingsGoal({ targetAmount: DEFAULT_SAVINGS_GOAL });
    } finally {
      // calculateSummaryData will be called by the useEffect watching transactions and savingsGoal
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    calculateSummaryData();
  }, [transactions, savingsGoal, calculateSummaryData]);


  // Listen for storage events (e.g., new transaction added from another tab or after server action revalidation)
   useEffect(() => {
    const handleStorageChange = () => {
      if (user) { // Only refetch if a user is logged in
        fetchData();
      }
    };
    window.addEventListener('storage', handleStorageChange); // This event is typically for localStorage, might need custom event for Firestore updates
    // For Firestore, consider using onSnapshot for real-time updates if desired, or rely on revalidatePath
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user, fetchData]);


  if (isLoading || !summary) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Panel Mensual</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-[125px] w-full" />
          <Skeleton className="h-[125px] w-full" />
          <Skeleton className="h-[125px] w-full" />
          <Skeleton className="h-[125px] w-full" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-[150px] w-full" />
          <Skeleton className="h-[125px] w-full" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px]">
            <Skeleton className="h-full w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-semibold mb-4">Bienvenido a KakeboApp</h1>
        <p className="text-muted-foreground">Por favor, inicia sesión para ver tu panel.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Panel Mensual</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MonthlySummaryCard 
          title="Saldo Inicial (Ejemplo)" 
          value={summary.startingBalance} 
          icon={DollarSign} 
        />
        <MonthlySummaryCard 
          title="Ingresos Totales (Mes)" 
          value={summary.totalIncome} 
          icon={TrendingUp}
          valueClassName="text-green-600 dark:text-green-400"
        />
        <MonthlySummaryCard 
          title="Gastos Totales (Mes)" 
          value={summary.totalExpenses} 
          icon={TrendingDown}
          valueClassName="text-red-600 dark:text-red-400"
        />
        <MonthlySummaryCard 
          title="Ahorro Neto (Mes)" 
          value={summary.netSavings} 
          icon={Target}
          valueClassName={summary.netSavings >=0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SavingsProgressBar currentSavings={summary.netSavings} targetSavings={summary.savingsGoal} />
        <MonthlySummaryCard 
          title="Meta de Ahorro" 
          value={summary.savingsGoal} 
          description={
            summary.savingsDifference >= 0 
            ? `Estás ${summary.savingsDifference.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })} por encima de tu meta.`
            : `Estás ${Math.abs(summary.savingsDifference).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })} por debajo de tu meta.`
          }
          valueClassName={summary.savingsDifference >= 0 ? "text-accent-foreground" : "text-destructive"}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumen de Gastos (Últimos 30 días)</CardTitle>
          <CardDescription>
            Visualización de tus gastos por categoría.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px]">
          {user ? <ExpenseBreakdownChart userId={user.uid} /> : <p>Inicia sesión para ver el resumen de gastos.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
