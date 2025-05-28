
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { setSavingsGoalAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import type { SavingsGoal } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth

const savingsGoalSchema = z.object({
  targetAmount: z.coerce.number().min(0, "La meta de ahorro debe ser no negativa."),
});

type SavingsGoalFormValues = z.infer<typeof savingsGoalSchema>;

interface SavingsGoalFormProps {
  currentGoal?: SavingsGoal; // This prop might be fed from Firestore data later
  onGoalSet?: (newGoal: SavingsGoal) => void;
}

export function SavingsGoalForm({ currentGoal, onGoalSet }: SavingsGoalFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth(); // Get user from AuthContext

  const form = useForm<SavingsGoalFormValues>({
    resolver: zodResolver(savingsGoalSchema),
    defaultValues: {
      targetAmount: currentGoal?.targetAmount || 0,
    },
  });

  // Update form default value if currentGoal prop changes (e.g., loaded from Firestore)
  useEffect(() => {
    if (currentGoal) {
      form.reset({ targetAmount: currentGoal.targetAmount });
    }
  }, [currentGoal, form]);


  async function onSubmit(data: SavingsGoalFormValues) {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para establecer una meta de ahorro.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Pass user.uid to the server action
      const result = await setSavingsGoalAction(user.uid, data);
      if (result.success) {
        toast({
          title: "¡Éxito!",
          description: result.message,
        });
        onGoalSet?.(data); // Notify parent component
         // Trigger storage event for other components if needed
        window.dispatchEvent(new Event('storage'));
      } else {
        toast({
          title: "Error",
          description: result.message || "Error al establecer la meta de ahorro.",
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
          name="targetAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta de Ahorro Mensual (€)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Introduce tu meta de ahorro" {...field} step="10" />
              </FormControl>
              <FormDescription>
                Define cuánto te propones ahorrar cada mes.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting || !user}>
          {isSubmitting ? "Guardando..." : "Establecer Meta"}
        </Button>
      </form>
    </Form>
  );
}
