// utils/getExchangeRate.ts

const EXCHANGE_RATE_API_KEY = 'b7713be7adc4f70be3c433bc';
const BASE_URL = 'https://v6.exchangerate-api.com/v6';

export const getExchangeRate = async (
  fromCurrency: string,
  toCurrency: string
): Promise<number> => {
  try {
    const res = await fetch(
      `${BASE_URL}/${EXCHANGE_RATE_API_KEY}/pair/${fromCurrency}/${toCurrency}`
    );

    const data = await res.json();

    if (data.result === 'success') {
      return data.conversion_rate;
    } else {
      throw new Error(`API Error: ${data['error-type']}`);
    }
  } catch (error) {
    console.error('Error to retrieve conversion', error);
    throw error;
  }
};
