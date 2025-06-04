import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const TokenTable = ({ address, chain }) => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTokens = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Using Covalent API to get token balances
        const response = await axios.get(
          `https://api.covalenthq.com/v1/${chain.id}/address/${address}/balances_v2/`,
          {
            params: {
              key: 'ckey_docs', // Using public demo key for this example
              nft: false,
            }
          }
        );
        
        if (response.data && response.data.data && response.data.data.items) {
          // Filter out tokens with zero balance
          const filteredTokens = response.data.data.items
            .filter(token => token.type === 'cryptocurrency' && parseFloat(token.balance) > 0)
            .sort((a, b) => (b.quote || 0) - (a.quote || 0))
            .slice(0, 10); // Get top 10 tokens by value
            
          setTokens(filteredTokens);
        } else {
          throw new Error('Invalid response from API');
        }
      } catch (err) {
        console.error('Error fetching token data:', err);
        setError(err.message || 'Failed to fetch token data');
        
        // Fallback to mock data for demo purposes
        setTokens([
          {
            contract_name: chain.name,
            contract_ticker_symbol: chain.symbol,
            contract_address: '0x0000000000000000000000000000000000000000',
            logo_url: `https://cryptologos.cc/logos/${chain.name.toLowerCase()}-${chain.symbol.toLowerCase()}-logo.png`,
            balance: '1250000000000000000',
            quote: 2100.50,
            quote_rate: 2100.50,
          },
          ...Array(5).fill().map((_, i) => ({
            contract_name: `Token ${i+1}`,
            contract_ticker_symbol: `TKN${i+1}`,
            contract_address: `0x${Array(40).fill().map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
            logo_url: `https://via.placeholder.com/40?text=T${i+1}`,
            balance: `${Math.random() * 1000000000000000000}`,
            quote: Math.random() * 1000,
            quote_rate: Math.random() * 10,
          }))
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTokens();
  }, [address, chain]);
  
  // Format balance for display
  const formatBalance = (balance, decimals = 18) => {
    const num = parseFloat(balance) / 10**decimals;
    if (num < 0.001) return '< 0.001';
    return num.toFixed(3);
  };
  
  // Format USD value for display
  const formatUSD = (value) => {
    if (!value) return '$0.00';
    if (value < 0.01) return '< $0.01';
    return `$${value.toFixed(2)}`;
  };
  
  // Generate random sparkline data for demo
  const generateSparklineData = () => {
    return Array(10).fill().map(() => Math.random() * 100);
  };
  
  // Draw mini sparkline
  const drawSparkline = (data) => {
    const width = 60;
    const height = 20;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <svg width={width} height={height} className="sparkline">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          points={points}
        />
      </svg>
    );
  };
  
  return (
    <motion.div 
      className="glass-panel neon-purple p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-audiowide text-gradient mb-4">TOKEN OVERVIEW</h2>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-neon-purple rounded-full animate-spin border-t-transparent"></div>
        </div>
      ) : tokens.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 font-orbitron text-gray-400 font-normal">TOKEN</th>
                <th className="text-right py-3 px-4 font-orbitron text-gray-400 font-normal">BALANCE</th>
                <th className="text-right py-3 px-4 font-orbitron text-gray-400 font-normal">VALUE</th>
                <th className="text-right py-3 px-4 font-orbitron text-gray-400 font-normal hidden md:table-cell">PRICE</th>
                <th className="text-right py-3 px-4 font-orbitron text-gray-400 font-normal hidden lg:table-cell">CHART</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token, index) => (
                <motion.tr 
                  key={token.contract_address}
                  className="border-b border-gray-800 hover:bg-gray-900 hover:bg-opacity-40 transition-colors duration-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden mr-3">
                        {token.logo_url ? (
                          <img 
                            src={token.logo_url} 
                            alt={token.contract_ticker_symbol} 
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://via.placeholder.com/40?text=${token.contract_ticker_symbol.substring(0, 2)}`;
                            }}
                          />
                        ) : (
                          <span className="text-xs">{token.contract_ticker_symbol.substring(0, 2)}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-white">{token.contract_ticker_symbol}</div>
                        <div className="text-xs text-gray-400 truncate max-w-[120px]">{token.contract_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-orbitron">
                    {formatBalance(token.balance)}
                  </td>
                  <td className="py-3 px-4 text-right font-orbitron text-neon-purple">
                    {formatUSD(token.quote)}
                  </td>
                  <td className="py-3 px-4 text-right font-orbitron hidden md:table-cell">
                    {formatUSD(token.quote_rate)}
                  </td>
                  <td className="py-3 px-4 text-right text-neon-purple hidden lg:table-cell">
                    {drawSparkline(generateSparklineData())}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <p>No tokens found for this wallet</p>
        </div>
      )}
    </motion.div>
  );
};

export default TokenTable; 