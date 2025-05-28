"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, FilterX } from "lucide-react";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { transactionCategories, type TransactionCategory, type TransactionType } from "@/lib/types";

export interface Filters {
  type: TransactionType | "all";
  category: TransactionCategory | "all";
  dateRange?: DateRange;
}

interface FilterControlsProps {
  onFilterChange: (filters: Filters) => void;
  initialFilters: Filters;
}

export function FilterControls({ onFilterChange, initialFilters }: FilterControlsProps) {
  const [type, setType] = useState<TransactionType | "all">(initialFilters.type);
  const [category, setCategory] = useState<TransactionCategory | "all">(initialFilters.category);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialFilters.dateRange);

  const handleApplyFilters = () => {
    onFilterChange({ type, category, dateRange });
  };

  const handleResetFilters = () => {
    const defaultDateRange = { from: subDays(new Date(), 30), to: new Date() };
    setType("all");
    setCategory("all");
    setDateRange(defaultDateRange);
    onFilterChange({ type: "all", category: "all", dateRange: defaultDateRange });
  };
  
  return (
    <div className="flex flex-wrap gap-4 p-4 border-b mb-4 items-end bg-card rounded-lg shadow">
      <div className="flex-grow min-w-[150px]">
        <label htmlFor="type-filter" className="block text-sm font-medium mb-1">Tipo</label>
        <Select value={type} onValueChange={(value) => setType(value as TransactionType | "all")}>
          <SelectTrigger id="type-filter">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los Tipos</SelectItem>
            <SelectItem value="income">Ingreso</SelectItem>
            <SelectItem value="expense">Gasto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-grow min-w-[150px]">
        <label htmlFor="category-filter" className="block text-sm font-medium mb-1">Categoría</label>
        <Select value={category} onValueChange={(value) => setCategory(value as TransactionCategory | "all")}>
          <SelectTrigger id="category-filter">
            <SelectValue placeholder="Filtrar por categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las Categorías</SelectItem>
            {transactionCategories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-grow min-w-[280px]">
        <label htmlFor="date-range-filter" className="block text-sm font-medium mb-1">Rango de Fechas</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date-range-filter"
              variant={"outline"}
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y", { locale: es })} -{" "}
                    {format(dateRange.to, "LLL dd, y", { locale: es })}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y", { locale: es })
                )
              ) : (
                <span>Elige un rango de fechas</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              locale={es}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Button onClick={handleApplyFilters} className="self-end">Aplicar Filtros</Button>
      <Button onClick={handleResetFilters} variant="outline" className="self-end">
        <FilterX className="mr-2 h-4 w-4" /> Reiniciar
      </Button>
    </div>
  );
}
