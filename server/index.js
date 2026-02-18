const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Blockchain configurations
const blockchains = {
  ethereum: { name: 'Ethereum', rpcUrl: process.env.ETHEREUM_RPC || 'https://eth.llamarpc.com' },
  solana: { name: 'Solana', rpcUrl: process.env.SOLANA_RPC || 'https://api.mainnet-beta.solana.com' },
  polygon: { name: 'Polygon', rpcUrl: process.env.POLYGON_RPC || 'https://polygon-rpc.com' },
  arbitrum: { name: 'Arbitrum', rpcUrl: process.env.ARBITRUM_RPC || 'https://arb1.arbitrum.io/rpc' },
  optimism: { name: 'Optimism', rpcUrl: process.env.OPTIMISM_RPC || 'https://mainnet.optimism.io' },
  avalanche: { name: 'Avalanche', rpcUrl: process.env.AVALANCHE_RPC || 'https://api.avax.network/ext/bc/C/rpc' },
  fantom: { name: 'Fantom', rpcUrl: process.env.FANTOM_RPC || 'https://rpc.fantom.network' },
  bsc: { name: 'BSC', rpcUrl: process.env.BSC_RPC || 'https://bsc-dataseed1.binance.org' }
};

// Mock token list
const tokens = ['USDC', 'USDT', 'DAI', 'ETH', 'BTC', 'SOL'];

// Store current prices
let currentPrices = {};

// Initialize prices for all blockchains
Object.keys(blockchains).forEach(chain => {
  currentPrices[chain] = {};
  tokens.forEach(token => {
    currentPrices[chain][token] = Math.random() * 1000 + 100;
  });
});

// Simulate price updates
function updatePrices() {
  Object.keys(blockchains).forEach(chain => {
    tokens.forEach(token => {
      const change = (Math.random() - 0.5) * 10;
      currentPrices[chain][token] = Math.max(currentPrices[chain][token] + change, 1);
    });
  });
}

// Simulate arbitrage opportunities
function detectArbitrageOpportunities() {
  const opportunities = [];
  const chains = Object.keys(blockchains);

  for (let i = 0; i < chains.length - 1; i++) {
    for (let j = i + 1; j < chains.length; j++) {
      const chain1 = chains[i];
      const chain2 = chains[j];
      const token = tokens[Math.floor(Math.random() * tokens.length)];

      const price1 = currentPrices[chain1][token];
      const price2 = currentPrices[chain2][token];
      const priceDiff = ((price2 - price1) / price1) * 100;

      if (Math.abs(priceDiff) > 0.5) {
        opportunities.push({
          fromChain: chain1,
          toChain: chain2,
          token: token,
          profitPercent: priceDiff,
          gasFee: Math.random() * 50 + 10,
          timestamp: new Date()
        });
      }
    }
  }

  return opportunities;
}

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Send initial prices
  socket.emit('prices_update', currentPrices);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Update prices every 2 seconds
setInterval(() => {
  updatePrices();
  io.emit('prices_update', currentPrices);

  // Check for arbitrage opportunities
  const opportunities = detectArbitrageOpportunities();
  opportunities.forEach(opp => {
    io.emit('arbitrage_opportunity', opp);
  });
}, 2000);

// API Routes
app.get('/api/prices', (req, res) => {
  res.json(currentPrices);
});

app.get('/api/opportunities', (req, res) => {
  const opportunities = detectArbitrageOpportunities();
  res.json(opportunities);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server active at ws://localhost:${PORT}`);
});