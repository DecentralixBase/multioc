import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './styles/globals.css';
import WalletInput from './components/WalletInput';
import ChainSwitcher from './components/ChainSwitcher';
import WalletOverview from './components/WalletOverview';
import TokenTable from './components/TokenTable';
import NFTGrid from './components/NFTGrid';
import GasChart from './components/GasChart';
import Loader from './components/Loader';
import ErrorBox from './components/ErrorBox';

// Chain configurations
const CHAINS = {
  ethereum: { id: 1, name: 'Ethereum', symbol: 'ETH', color: '#627EEA' },
  polygon: { id: 137, name: 'Polygon', symbol: 'MATIC', color: '#8247E5' },
  bsc: { id: 56, name: 'Binance Smart Chain', symbol: 'BNB', color: '#F3BA2F' },
  arbitrum: { id: 42161, name: 'Arbitrum', symbol: 'ETH', color: '#28A0F0' },
  optimism: { id: 10, name: 'Optimism', symbol: 'ETH', color: '#FF0420' },
  avalanche: { id: 43114, name: 'Avalanche', symbol: 'AVAX', color: '#E84142' },
  fantom: { id: 250, name: 'Fantom', symbol: 'FTM', color: '#1969FF' },
  cronos: { id: 25, name: 'Cronos', symbol: 'CRO', color: '#002D74' },
  base: { id: 8453, name: 'Base', symbol: 'ETH', color: '#0052FF' }
};

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [selectedChain, setSelectedChain] = useState('ethereum');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [walletData, setWalletData] = useState(null);
  
  const handleWalletSubmit = (address) => {
    setWalletAddress(address);
    setLoading(true);
    setError('');
  };
  
  const handleChainChange = (chain) => {
    setSelectedChain(chain);
    if (walletAddress) {
      setLoading(true);
      setError('');
    }
  };
  
  useEffect(() => {
    if (!walletAddress) return;
    
    // Reset data when changing chains or wallet
    setWalletData(null);
    
    // We'll implement the actual API calls in the components
    // This is just to simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [walletAddress, selectedChain]);

  return (
    <motion.div 
      className="min-h-screen bg-dark-bg text-white p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <motion.h1 
            className="text-3xl md:text-4xl font-audiowide text-gradient mb-2"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          >
            MULTIOC ANALYTICS
          </motion.h1>
          <motion.div 
            className="hud-line w-full mb-4"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          ></motion.div>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <WalletInput onSubmit={handleWalletSubmit} />
            <ChainSwitcher chains={CHAINS} selected={selectedChain} onChange={handleChainChange} />
          </div>
        </header>

        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorBox message={error} />
        ) : walletAddress ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div 
              className="lg:col-span-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <WalletOverview 
                address={walletAddress} 
                chain={CHAINS[selectedChain]} 
              />
            </motion.div>
            
            <motion.div 
              className="lg:col-span-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <TokenTable 
                address={walletAddress} 
                chain={CHAINS[selectedChain]}
              />
            </motion.div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <GasChart 
                address={walletAddress} 
                chain={CHAINS[selectedChain]}
              />
            </motion.div>
            
            <motion.div 
              className="lg:col-span-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <NFTGrid 
                address={walletAddress} 
                chain={CHAINS[selectedChain]}
              />
            </motion.div>
          </div>
        ) : (
          <motion.div 
            className="glass-panel neon-blue p-8 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-audiowide mb-4">Welcome to zkScan</h2>
            <p className="text-gray-300 mb-6">Enter a wallet address to analyze on-chain data across multiple blockchains</p>
            <div className="hud-circle w-24 h-24 mx-auto pulse">
              <span className="text-neon-blue">READY</span>
            </div>
          </motion.div>
        )}
        
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>zkScan • Powered by Public Blockchain APIs</p>
        </footer>
      </div>
    </motion.div>
  );
}

export default App;
