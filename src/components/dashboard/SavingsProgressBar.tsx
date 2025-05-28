"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface SavingsProgressBarProps {
  currentSavings: number;
  targetSavings: number;
}

export function SavingsProgressBar({ currentSavings, targetSavings }: SavingsProgressBarProps) {
  const progress = targetSavings > 0 ? Math.max(0, Math.min(100, (currentSavings / targetSavings) * 100)) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progreso de Ahorro</CardTitle>
        <CardDescription>
          Tu progreso hacia tu meta de ahorro mensual de {targetSavings.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-primary">
            {currentSavings.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })} Ahorrados
          </span>
          <span className="text-sm font-medium">{progress.toFixed(0)}%</span>
        </div>
        <Progress value={progress} className="w-full h-4" />
        {currentSavings < 0 && (
             <p className="text-xs text-destructive pt-2">Has gastado más de lo presupuestado este mes.</p>
        )}
      </CardContent>
    </Card>
  );
}
