"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Transaction } from "@/lib/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { transactionCategories } from "@/lib/types";

interface TransactionTableProps {
  transactions: Transaction[];
  periodTotals?: { income: number; expenses: number; net: number };
}

export function TransactionTable({ transactions, periodTotals }: TransactionTableProps) {
  if (!transactions.length) {
    return <p className="text-muted-foreground text-center py-8">No se encontraron transacciones para el período seleccionado.</p>;
  }

  const getCategoryLabel = (value: string) => {
    const category = transactionCategories.find(cat => cat.value === value);
    return category ? category.label : value;
  };

  return (
    <Table>
      <TableCaption>Un listado de tus transacciones recientes.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead>Notas</TableHead>
          <TableHead className="text-right">Cantidad</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{format(new Date(transaction.date), "PPP", { locale: es })}</TableCell>
            <TableCell>
              <Badge variant={transaction.type === "income" ? "default" : "secondary"} 
                     className={transaction.type === "income" ? "bg-accent text-accent-foreground" : "bg-destructive/20 text-destructive-foreground"}>
                {transaction.type === "income" ? "Ingreso" : "Gasto"}
              </Badge>
            </TableCell>
            <TableCell>{getCategoryLabel(transaction.category)}</TableCell>
            <TableCell className="max-w-xs truncate">{transaction.notes || "-"}</TableCell>
            <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </TableCell>
          </TableRow>
        ))}
        {periodTotals && (
          <>
            <TableRow className="font-semibold bg-muted/50">
              <TableCell colSpan={4} className="text-right">Ingresos Totales:</TableCell>
              <TableCell className="text-right text-green-600">{periodTotals.income.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</TableCell>
            </TableRow>
            <TableRow className="font-semibold bg-muted/50">
              <TableCell colSpan={4} className="text-right">Gastos Totales:</TableCell>
              <TableCell className="text-right text-red-600">{periodTotals.expenses.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</TableCell>
            </TableRow>
            <TableRow className="font-bold text-lg bg-muted">
              <TableCell colSpan={4} className="text-right">Cambio Neto:</TableCell>
              <TableCell className={`text-right ${periodTotals.net >= 0 ? 'text-green-700' : 'text-red-700'}`}>{periodTotals.net.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</TableCell>
            </TableRow>
          </>
        )}
      </TableBody>
    </Table>
  );
}
