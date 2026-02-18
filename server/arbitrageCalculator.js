const axios = require('axios');

class ArbitrageCalculator {
    constructor(exchangeRates) {
        this.exchangeRates = exchangeRates;
    }

    // Fetch current exchange rates from APIs
    async fetchExchangeRates(urls) {
        const requests = urls.map(url => axios.get(url));
        const responses = await Promise.all(requests);
        this.exchangeRates = responses.map(response => response.data);
    }

    // Calculate arbitrage opportunities
    calculateArbitrage() {
        const opportunities = [];
        for (let i = 0; i < this.exchangeRates.length; i++) {
            for (let j = i + 1; j < this.exchangeRates.length; j++) {
                const rateA = this.exchangeRates[i].rate;
                const rateB = this.exchangeRates[j].rate;
                const potentialProfit = (rateB - rateA) / rateA;
                if (potentialProfit > 0) {
                    opportunities.push({
                        from: this.exchangeRates[i].exchange,
                        to: this.exchangeRates[j].exchange,
                        profit: potentialProfit * 100 // Convert to percentage
                    });
                }
            }
        }
        return opportunities;
    }
}

module.exports = ArbitrageCalculator;