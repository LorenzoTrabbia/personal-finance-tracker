import { db } from "../firebase";
import { collection, getDocs, updateDoc } from "firebase/firestore";
import { getExchangeRate } from "./getExchangeRate";

export const updateTransactionsCurrency = async (
  userId: string,
  fromCurrency: string,
  toCurrency: string
) => {
    const rate = await getExchangeRate(fromCurrency, toCurrency);
    const transactionsRef = collection(db, "users", userId, "transactions");
    const snapshot = await getDocs(transactionsRef);

    const updates = snapshot.docs.map(async (docSnap) => {
      const data = docSnap.data();
      const newAmount = parseFloat((data.amount * rate).toFixed(2));

      await updateDoc(docSnap.ref, {
        amount: newAmount,
        currency: toCurrency,
        lastConvertedFrom: fromCurrency,
      });
    });

    await Promise.all(updates);
};
