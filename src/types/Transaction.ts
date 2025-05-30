import type { Timestamp } from "firebase/firestore";

export type Transaction = {
    id: string; // generato automaticamente
    userId: string; // per collegarla all’utente loggato
    type: "income" | "expense"; // entrata o uscita
    name: string; // es: “Spesa supermercato”
    amount: number; // es: -50.0 o +1200.0
    category: string; // es: “Cibo”, “Stipendio”, ecc.
    date: string; // ISO string, es: "2025-05-30"
    createdAt: Timestamp; // per ordinare
  };
  