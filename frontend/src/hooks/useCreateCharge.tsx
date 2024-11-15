import { useCallback } from 'react';
const COMMERCE_API_URL = 'https://api.commerce.coinbase.com';
const COINBASE_COMMERCE_API_KEY = import.meta.env.VITE_COINBASE_COMMERCE_API_KEY;

const useCreateCharge = () => {
    const createCharge = useCallback(async (chargeDetails: any) => {
        try {
            const res = await fetch(`${COMMERCE_API_URL}/charges`, {
                method: 'POST',
                body: JSON.stringify(chargeDetails),
                headers: {
                    'Content-Type': 'application/json',
                    'X-CC-Api-Key': COINBASE_COMMERCE_API_KEY,
                },
            });
            const { data } = await res.json();
            return data.id;
        } catch (error) {
            console.error('Error creating charge:', error);
            throw error;
        }
    }, []);

    return { createCharge };
};

export default useCreateCharge;
