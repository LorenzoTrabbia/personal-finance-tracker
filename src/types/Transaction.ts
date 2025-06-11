import type { Timestamp } from "firebase/firestore";

export type Transaction = {
    id: string;
    userId: string;
    type: "income" | "expense";
    name: string;
    amount: number;
    category: string;
    date: string;
    createdAt: Timestamp;
  };
  