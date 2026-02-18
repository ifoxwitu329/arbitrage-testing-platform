// priceService.js

/**
 * Fetches live prices from multiple blockchain networks.
 * @returns {Promise<Object>} - A promise that resolves to an object containing prices from different networks.
 */
async function fetchLivePrices() {
    const prices = {};

    try {
        // Example API calls. Replace with actual blockchain API endpoints.
        const btcResponse = await fetch('https://api.blockchain.com/v3/exchange/l3/BTC-USD');
        const ethResponse = await fetch('https://api.blockchain.com/v3/exchange/l3/ETH-USD');
        const bnbResponse = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT');

        // Assuming the responses are in JSON format.
        prices.btc = await btcResponse.json();
        prices.eth = await ethResponse.json();
        prices.bnb = await bnbResponse.json();

        // Format to return useful information
        return {
            BTC: prices.btc.price,
            ETH: prices.eth.price,
            BNB: prices.bnb.price,
        };
    } catch (error) {
        console.error('Error fetching prices:', error);
        throw error;
    }
}

module.exports = { fetchLivePrices };