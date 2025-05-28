
"use client";

import { useState, useEffect, useCallback } from "react";
import { SavingsGoalForm } from "@/components/savings/SavingsGoalForm";
import { SavingsTracker } from "@/components/savings/SavingsTracker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SavingsGoal, Transaction } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { getTransactionsForUser } from "@/lib/actions"; // Using this to calculate actual savings
import { doc, getDoc, onSnapshot } from "firebase/firestore"; // Import onSnapshot
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

const DEFAULT_SAVINGS_GOAL: SavingsGoal = { targetAmount: 0 };

export default function SavingsPage() {
  const { user } = useAuth();
  const [savingsGoal, setSavingsGoal] = useState<SavingsGoal | null>(DEFAULT_SAVINGS_GOAL);
  const [actualSavings, setActualSavings] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Fetch and calculate actual savings based on transactions
  const calculateActualSavings = useCallback(async () => {
    if (!user) {
      setActualSavings(0);
      return;
    }
    try {
      const transactions = await getTransactionsForUser(user.uid);
      // Simplified: considering all transactions for the current month.
      // A real app might filter by current month or a user-defined period.
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const netSavingsForPeriod = transactions
        .filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
        })
        .reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0);
      setActualSavings(netSavingsForPeriod);
    } catch (error) {
      console.error("Error calculating actual savings:", error);
      setActualSavings(0);
    }
  }, [user]);


  // Effect to listen for savings goal changes in Firestore
  useEffect(() => {
    if (!user) {
      setSavingsGoal(DEFAULT_SAVINGS_GOAL);
      setLoading(false);
      return;
    }

    setLoading(true);
    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().savingsGoal) {
        setSavingsGoal(docSnap.data().savingsGoal as SavingsGoal);
      } else {
        setSavingsGoal(DEFAULT_SAVINGS_GOAL); // Default if not set
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching savings goal with onSnapshot:", error);
      setSavingsGoal(DEFAULT_SAVINGS_GOAL);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [user]);

  // Effect to recalculate actual savings when user changes or savings goal is updated (which might trigger re-evaluation)
  useEffect(() => {
    calculateActualSavings();
  }, [user, savingsGoal, calculateActualSavings]); // Recalculate if savingsGoal changes, as this indicates a data refresh might be needed

  const handleGoalSet = (newGoal: SavingsGoal) => {
    setSavingsGoal(newGoal); // Optimistically update UI
    // Firestore update is handled by setSavingsGoalAction, onSnapshot will catch the change
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Meta de Ahorro</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
            <CardContent><Skeleton className="h-24 w-full" /></CardContent>
          </Card>
           <Card>
            <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
            <CardContent><Skeleton className="h-24 w-full" /></CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (!user) {
     return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Meta de Ahorro</h1>
        <p className="text-muted-foreground">Por favor, inicia sesión para gestionar tus metas de ahorro.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Meta de Ahorro</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Establece Tu Meta Mensual</CardTitle>
            <CardDescription>Define cuánto quieres ahorrar cada mes para mantenerte en el camino correcto.</CardDescription>
          </CardHeader>
          <CardContent>
            <SavingsGoalForm currentGoal={savingsGoal || undefined} onGoalSet={handleGoalSet} />
          </CardContent>
        </Card>

        <SavingsTracker savingsGoal={savingsGoal} actualSavings={actualSavings} />
      </div>
    </div>
  );
}
