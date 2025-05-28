import { TransactionForm } from "@/components/transactions/TransactionForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecordTransactionPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Registrar Transacción</h1>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Nueva Transacción</CardTitle>
          <CardDescription>Introduce los detalles de tu ingreso o gasto.</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionForm />
        </CardContent>
      </Card>
    </div>
  );
}
