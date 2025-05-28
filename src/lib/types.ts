
export type TransactionType = 'income' | 'expense';

// Using an array of objects for categories to store both value and label for translation
export const transactionCategories = [
  { value: 'Groceries', label: 'Alimentos' },
  { value: 'Rent/Mortgage', label: 'Alquiler/Hipoteca' },
  { value: 'Utilities', label: 'Servicios Públicos' },
  { value: 'Transportation', label: 'Transporte' },
  { value: 'Healthcare', label: 'Salud' },
  { value: 'Dining Out', label: 'Restaurantes' },
  { value: 'Entertainment', label: 'Entretenimiento' },
  { value: 'Hobbies', label: 'Pasatiempos' },
  { value: 'Shopping (Non-essential)', label: 'Compras (No esenciales)' },
  { value: 'Vacation/Travel', label: 'Vacaciones/Viajes' },
  { value: 'Education', label: 'Educación' },
  { value: 'Books', label: 'Libros' },
  { value: 'Museums/Culture', label: 'Museos/Cultura' },
  { value: 'Emergency Fund', label: 'Fondo de Emergencia' },
  { value: 'Repairs', label: 'Reparaciones' },
  { value: 'Gifts', label: 'Regalos' },
  { value: 'Salary', label: 'Salario' },
  { value: 'Freelance', label: 'Trabajo Freelance' },
  { value: 'Investment', label: 'Inversión' },
  { value: 'Bonus', label: 'Bonificación' },
  { value: 'Miscellaneous', label: 'Misceláneos' }
] as const;

// Extracting just the values for type validation
export type TransactionCategory = typeof transactionCategories[number]['value'];

export interface Transaction {
  id: string;
  userId: string; // Added to ensure it's part of the type if fetched
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  date: string; // Changed from Date to string (ISO string)
  notes?: string;
  createdAt?: string; // Added for Firebase Timestamp, as ISO string
}

export interface SavingsGoal {
  targetAmount: number;
}

export interface MonthlySummaryData {
  startingBalance: number;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsGoal: number;
  savingsDifference: number;
  savingsProgress: number;
}
