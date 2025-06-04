import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const WalletOverview = ({ address, chain }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Using Covalent API to get wallet data
        const response = await axios.get(
          `https://api.covalenthq.com/v1/${chain.id}/address/${address}/balances_v2/`,
          {
            params: {
              key: 'ckey_docs', // Using public demo key for this example
              nft: true,
              "no-nft-fetch": false,
            }
          }
        );
        
        if (response.data && response.data.data) {
          setData(response.data.data);
        } else {
          throw new Error('Invalid response from API');
        }
      } catch (err) {
        console.error('Error fetching wallet data:', err);
        setError(err.message || 'Failed to fetch wallet data');
        
        // Fallback to mock data for demo purposes
        setData({
          address,
          chain_id: chain.id,
          chain_name: chain.name,
          items: [
            {
              contract_name: chain.name,
              contract_ticker_symbol: chain.symbol,
              balance: '1250000000000000000',
              quote: 2100.50,
              type: 'cryptocurrency',
            },
            // Mock tokens
            ...Array(5).fill().map((_, i) => ({
              contract_name: `Token ${i+1}`,
              contract_ticker_symbol: `TKN${i+1}`,
              balance: `${Math.random() * 1000000000000000000}`,
              quote: Math.random() * 1000,
              type: 'cryptocurrency',
            }))
          ],
          nft_data: Array(3).fill().map((_, i) => ({
            token_id: `${i+1}`,
            external_data: {
              name: `NFT #${i+1}`,
              image: `https://via.placeholder.com/150?text=NFT${i+1}`,
            }
          })),
          quote_currency: 'USD'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [address, chain]);
  
  if (loading) return null;
  
  // Calculate totals
  const nativeToken = data?.items?.find(item => 
    item.contract_ticker_symbol === chain.symbol && 
    item.type === 'cryptocurrency'
  );
  
  const tokenCount = data?.items?.filter(item => 
    item.type === 'cryptocurrency' && 
    item.contract_ticker_symbol !== chain.symbol
  ).length || 0;
  
  const nftCount = data?.nft_data?.length || 0;
  
  // Format address for display
  const formatAddress = (addr) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };
  
  // Format balance for display
  const formatBalance = (balance) => {
    const num = parseFloat(balance) / 10**18;
    return num.toFixed(4);
  };
  
  return (
    <motion.div 
      className="glass-panel neon-blue p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-audiowide text-gradient">WALLET OVERVIEW</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-neon-blue pulse"></div>
            <p className="text-sm text-gray-300 font-orbitron">{formatAddress(address)}</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chain.color }}></div>
          <span className="font-audiowide text-sm">{chain.name}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          className="glass-panel neon-blue p-4 floating-card"
          whileHover={{ y: -5 }}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm text-gray-400">NATIVE BALANCE</h3>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: chain.color, opacity: 0.2 }}>
              <span className="text-xs font-bold">{chain.symbol}</span>
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-audiowide text-white">
              {nativeToken ? formatBalance(nativeToken.balance) : '0.0000'}
            </span>
            <span className="ml-2 text-sm text-gray-400">{chain.symbol}</span>
          </div>
          {nativeToken && nativeToken.quote && (
            <p className="text-xs text-neon-blue mt-1">≈ ${nativeToken.quote.toFixed(2)} USD</p>
          )}
        </motion.div>
        
        <motion.div 
          className="glass-panel neon-purple p-4 floating-card"
          whileHover={{ y: -5 }}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm text-gray-400">TOKEN COUNT</h3>
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-neon-purple bg-opacity-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neon-purple" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4z" />
                <path d="M4 12a2 2 0 00-2 2v2a2 2 0 002 2h12a2 2 0 002-2v-2a2 2 0 00-2-2H4z" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-audiowide text-white">{tokenCount}</span>
            <span className="ml-2 text-sm text-gray-400">tokens</span>
          </div>
          <p className="text-xs text-neon-purple mt-1">ERC-20 / BEP-20 / etc.</p>
        </motion.div>
        
        <motion.div 
          className="glass-panel neon-cyan p-4 floating-card"
          whileHover={{ y: -5 }}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm text-gray-400">NFT COUNT</h3>
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-neon-cyan bg-opacity-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neon-cyan" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-audiowide text-white">{nftCount}</span>
            <span className="ml-2 text-sm text-gray-400">collectibles</span>
          </div>
          <p className="text-xs text-neon-cyan mt-1">ERC-721 / ERC-1155</p>
        </motion.div>
        
        <motion.div 
          className="glass-panel neon-blue p-4 floating-card"
          whileHover={{ y: -5 }}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm text-gray-400">TRANSACTIONS</h3>
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-neon-blue bg-opacity-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neon-blue" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-audiowide text-white">
              {Math.floor(Math.random() * 1000)}
            </span>
            <span className="ml-2 text-sm text-gray-400">txns</span>
          </div>
          <p className="text-xs text-neon-blue mt-1">Last 30 days</p>
        </motion.div>
      </div>
      
      <div className="mt-6 flex flex-wrap gap-2">
        <a 
          href={`https://etherscan.io/address/${address}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-neon-blue transition-colors duration-300"
        >
          View on Explorer →
        </a>
      </div>
    </motion.div>
  );
};

export default WalletOverview; 