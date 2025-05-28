"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { SavingsGoal } from "@/lib/types";

interface SavingsTrackerProps {
  savingsGoal: SavingsGoal | null;
  actualSavings: number; // This would be calculated from transactions (e.g., income - expenses for the month)
}

export function SavingsTracker({ savingsGoal, actualSavings }: SavingsTrackerProps) {
  if (!savingsGoal) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Seguimiento de Ahorros</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Establece una meta de ahorro para comenzar a seguir tu progreso.</p>
        </CardContent>
      </Card>
    );
  }

  const { targetAmount } = savingsGoal;
  const difference = actualSavings - targetAmount;
  const progress = targetAmount > 0 ? Math.max(0, Math.min(100, (actualSavings / targetAmount) * 100)) : (actualSavings > 0 ? 100 : 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendimiento de Ahorros</CardTitle>
        <CardDescription>
          Siguiendo tus ahorros actuales contra tu meta de {targetAmount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Ahorros Actuales: {actualSavings.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
            <span className="text-sm font-medium">{progress.toFixed(0)}% de la Meta</span>
          </div>
          <Progress value={progress} className="w-full h-3" />
        </div>
        
        <div className="text-sm">
          {difference >= 0 ? (
            <p className="text-green-600">
              🎉 ¡Has ahorrado {difference.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })} más que tu meta!
            </p>
          ) : (
            <p className="text-red-600">
              🎯 Estás a {Math.abs(difference).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })} de alcanzar tu meta.
            </p>
          )}
        </div>
        {actualSavings < 0 && (
             <p className="text-xs text-destructive pt-2">Nota: Tus ahorros netos para el período son negativos (has gastado de más).</p>
        )}
      </CardContent>
    </Card>
  );
}
