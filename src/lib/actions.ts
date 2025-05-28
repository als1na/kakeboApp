
"use server";

import { revalidatePath } from "next/cache";
import type { Transaction, SavingsGoal, TransactionType, TransactionCategory } from "./types";
import { db } from "./firebase"; // Import db from firebase
import { collection, addDoc, doc, setDoc, getDocs, query, where, orderBy, serverTimestamp, type Timestamp } from "firebase/firestore";

interface ActionResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Helper function to safely convert Firestore Timestamp or JS Date to ISO string
const toISOStringSafe = (timestampField: unknown): string | undefined => {
  if (!timestampField) return undefined;

  if (timestampField instanceof Date) { // JavaScript Date object
    try {
      return timestampField.toISOString();
    } catch (e) {
      console.warn("Error converting JS Date to ISOString:", timestampField, e);
      return undefined;
    }
  }

  // Check for Firestore Timestamp-like object (duck typing)
  if (
    typeof timestampField === 'object' &&
    timestampField !== null && // Ensure it's not null
    'toDate' in timestampField &&
    typeof (timestampField as any).toDate === 'function'
  ) {
    try {
      return (timestampField as any).toDate().toISOString();
    } catch (e) {
      console.warn("Error converting Firestore-like Timestamp to Date:", timestampField, e);
      return undefined;
    }
  }
  
  // If it's already a string, try to parse and re-format to ensure it's a valid ISO string.
  if (typeof timestampField === 'string') {
    try {
      const d = new Date(timestampField);
      if (isNaN(d.getTime())) { // Invalid date string
         console.warn("toISOStringSafe received a string that is not a valid parseable date:", timestampField);
         return undefined;
      }
      return d.toISOString(); // Return a standardized ISO string
    } catch (e) {
       console.warn("Error parsing date string in toISOStringSafe:", timestampField, e);
      return undefined;
    }
  }

  console.warn("toISOStringSafe received an unexpected_timestamp_format:", timestampField);
  return undefined;
};


export async function addTransactionAction(
  userId: string, 
  transactionData: Omit<Transaction, 'id' | 'date' | 'userId' | 'createdAt'> & { date: string } // Input date is string
): Promise<ActionResponse> {
  if (!userId) {
    return { success: false, message: "Usuario no autenticado." };
  }

  try {
    const dateString = transactionData.date;
    let dateObject: Date;

    if (typeof dateString === 'string') {
      dateObject = new Date(dateString);
      if (isNaN(dateObject.getTime())) {
        return { success: false, message: "Fecha inválida proporcionada en la transacción." };
      }
    } else {
       // This case should not happen if types are correct from form
       return { success: false, message: "Formato de fecha incorrecto." };
    }


    const transactionWithTimestamp = {
      ...transactionData,
      userId,
      date: dateObject, // Store as Date object in Firestore, it will be converted to Timestamp
      createdAt: serverTimestamp(), // Firestore server timestamp
    };
    
    const docRef = await addDoc(collection(db, "users", userId, "transactions"), transactionWithTimestamp);
    
    revalidatePath("/history");
    revalidatePath("/");
    revalidatePath("/savings"); 
    
    return { success: true, message: "Transacción añadida con éxito.", data: { id: docRef.id } };
  } catch (error) {
    console.error("Error al añadir transacción:", error);
    // Check if error is a FirebaseError and has a specific code
    if (typeof error === 'object' && error !== null && 'code' in error) {
        return { success: false, message: `Error de Firestore: ${(error as {code: string}).code}. Por favor, revisa las reglas de seguridad o la conexión.` };
    }
    return { success: false, message: "Error interno al añadir la transacción." };
  }
}

export async function setSavingsGoalAction(
  userId: string, 
  savingsGoal: SavingsGoal
): Promise<ActionResponse> {
  if (!userId) {
    return { success: false, message: "Usuario no autenticado." };
  }

  try {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, { savingsGoal }, { merge: true });
    
    revalidatePath("/savings");
    revalidatePath("/");

    return { success: true, message: "Meta de ahorro actualizada con éxito." };
  } catch (error) {
    console.error("Error al establecer meta de ahorro:", error);
     if (typeof error === 'object' && error !== null && 'code' in error) {
        return { success: false, message: `Error de Firestore: ${(error as {code: string}).code}.` };
    }
    return { success: false, message: "Error interno al actualizar la meta de ahorro." };
  }
}


export async function getTransactionsForUser(userId: string): Promise<Transaction[]> {
  if (!userId) return [];
  try {
    const transactionsCol = collection(db, "users", userId, "transactions");
    // Order by date stored as Timestamp in Firestore
    const q = query(transactionsCol, orderBy("date", "desc")); 
    const querySnapshot = await getDocs(q);
    
    const transactions = querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      
      const dateString = toISOStringSafe(data.date); // data.date should be a Firestore Timestamp

      if (!dateString) {
        console.error(`Transaction ${docSnap.id} for user ${userId} has an invalid or missing 'date' field. Skipping this transaction. Original date value:`, data.date);
        return null; // Mark for filtering
      }

      const createdAtString = toISOStringSafe(data.createdAt); // data.createdAt should be a Firestore Timestamp

      return {
        id: docSnap.id,
        userId: data.userId,
        type: data.type as TransactionType,
        category: data.category as TransactionCategory,
        amount: data.amount,
        notes: data.notes,
        date: dateString, 
        createdAt: createdAtString,
      };
    }).filter(Boolean) as Transaction[]; // Filter out nulls (skipped transactions) and assert type

    return transactions;
  } catch (error) {
    console.error("Error fetching transactions from Firestore:", error);
    // Potentially throw a more specific error or return an empty array with a status
    // For now, returning empty to prevent full page crash on client if this action is called directly
    return []; 
  }
}


export async function getSavingsGoalForUser(userId: string): Promise<SavingsGoal | null> {
  if (!userId) return null;
  try {
    const userDocRef = doc(db, "users", userId);
    // const userDocSnap = await getDocs(query(collection(db, "users"), where("uid", "==", userId))); // This is incorrect for fetching a single doc by ID
    
    // Correct way to fetch a single document by ID:
    const userDoc = await doc(db, "users", userId).get();
    if (userDoc.exists() && userDoc.data()?.savingsGoal) {
       return userDoc.data()?.savingsGoal as SavingsGoal;
    }
    // console.log("Conceptual getSavingsGoalForUser called for user:", userId, "This action might need review for direct use vs. onSnapshot in client.");
    return { targetAmount: 0 }; // Default or fetch from user's document
  } catch (error) {
    console.error("Error fetching savings goal:", error);
    return null;
  }
}
