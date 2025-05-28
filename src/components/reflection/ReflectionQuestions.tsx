"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const reflectionQuestions = [
  {
    id: "q1",
    question: "¿Cuánto dinero tienes?",
    details: "Considera todas las fuentes: cuentas bancarias, efectivo, inversiones (aproxima si es necesario)."
  },
  {
    id: "q2",
    question: "¿Cuánto dinero te gustaría ahorrar?",
    details: "Piensa en tus metas financieras a corto y largo plazo."
  },
  {
    id: "q3",
    question: "¿Cuánto dinero estás gastando realmente?",
    details: "Revisa tu historial de transacciones del último mes. ¿Hay alguna sorpresa?"
  },
  {
    id: "q4",
    question: "¿Cómo puedes mejorar?",
    details: "Identifica 1-3 áreas donde puedes reducir gastos o aumentar ingresos. ¿Qué pequeños cambios puedes hacer?"
  },
  {
    id: "q5",
    question: "¿Cuáles fueron tus mayores logros financieros este mes?",
    details: "Reconoce el progreso, como ceñirte a un presupuesto, ahorrar más de lo planeado o evitar una compra impulsiva."
  },
  {
    id: "q6",
    question: "¿Qué desafíos financieros enfrentaste y cómo los manejaste?",
    details: "Reflexiona sobre gastos inesperados o tentaciones y cómo los navegaste."
  }
];

export function ReflectionQuestions() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {reflectionQuestions.map((item) => (
        <AccordionItem value={item.id} key={item.id}>
          <AccordionTrigger className="text-lg hover:no-underline text-left">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-base text-muted-foreground px-2">
            {item.details}
            {/* En una app real, podrías añadir un textarea aquí para que los usuarios escriban sus reflexiones */}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
