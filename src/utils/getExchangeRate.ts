// utils/getExchangeRate.ts

const EXCHANGE_RATE_API_KEY = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;
const BASE_URL = 'https://v6.exchangerate-api.com/v6';

export const getExchangeRate = async (
  fromCurrency: string,
  toCurrency: string
): Promise<number> => {
  if (!EXCHANGE_RATE_API_KEY) {
    throw new Error('Exchange rate service is not configured.');
  }

  const res = await fetch(
    `${BASE_URL}/${EXCHANGE_RATE_API_KEY}/pair/${fromCurrency}/${toCurrency}`
  );

  const data = await res.json();

  if (data.result === 'success') {
    return data.conversion_rate;
  } else {
    throw new Error(`API Error: ${data['error-type']}`);
  }
};
