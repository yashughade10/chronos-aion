// current request controller to cancel it when a new request starts
let controller: AbortController | null = null;

const fetchCryptoList = async () => {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&per_page=10');
    const data = await response.json();
    return data;
}

const fetchMarketData = async (coinId: string) => {
    // Cancel the previous request
    if (controller) {
        controller.abort();
    }

    // Create controller
    controller = new AbortController();

    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=inr&days=1`,
            { signal: controller.signal }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        return await response.json();

    } catch (error: any) {
        if (error.name === 'AbortError') {
            console.log('Request cancelled - user switched to another crypto');
            return null;
        }
        throw error;
    }
}

export {
    fetchCryptoList,
    fetchMarketData
};