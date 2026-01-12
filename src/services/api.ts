const fetchCryptoList = async () => {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&per_page=10');
    const data = await response.json();
    return data;
}

export {
    fetchCryptoList
};