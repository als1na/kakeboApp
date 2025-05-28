
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { transactionCategories, type TransactionCategory, type TransactionType } from "@/lib/types";
import { addTransactionAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth

const transactionFormSchema = z.object({
  type: z.enum(["income", "expense"], {
    required_error: "Por favor selecciona un tipo de transacción.",
  }),
  category: z.string({ required_error: "Por favor selecciona una categoría."})
    .refine(value => transactionCategories.map(tc => tc.value).includes(value as TransactionCategory), { message: "Categoría inválida." }),
  amount: z.coerce.number().positive({ message: "La cantidad debe ser positiva." }),
  date: z.date({ required_error: "Por favor selecciona una fecha." }),
  notes: z.string().max(200, "Las notas deben tener 200 caracteres o menos.").optional(),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export function TransactionForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth(); // Get user from AuthContext

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: "expense",
      amount: 0,
      date: new Date(),
      notes: "",
    },
  });

  async function onSubmit(data: TransactionFormValues) {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para añadir una transacción.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const transactionPayload = {
        type: data.type,
        category: data.category as TransactionCategory,
        amount: data.amount,
        date: data.date.toISOString(), // Convert date to string for server action
        notes: data.notes,
      };
      
      // Pass user.uid to the server action
      const result = await addTransactionAction(user.uid, transactionPayload);

      if (result.success) {
        toast({
          title: "¡Éxito!",
          description: result.message,
        });
        form.reset({
          type: "expense",
          amount: 0,
          date: new Date(),
          notes: "",
          category: undefined, 
        });
        // Trigger storage event for other components if needed, though revalidatePath should handle updates
        window.dispatchEvent(new Event('storage')); 
      } else {
        toast({
          title: "Error",
          description: result.message || "Error al añadir la transacción.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de transacción" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="income">Ingreso</SelectItem>
                  <SelectItem value="expense">Gasto</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {transactionCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cantidad (€)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0.00" {...field} step="0.01" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: es })
                      ) : (
                        <span>Elige una fecha</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Añade notas relevantes..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Máximo 200 caracteres.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting || !user}>
          {isSubmitting ? "Añadiendo..." : "Añadir Transacción"}
        </Button>
      </form>
    </Form>
  );
}
