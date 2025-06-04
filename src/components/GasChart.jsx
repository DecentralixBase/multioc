import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import axios from 'axios';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const GasChart = ({ address, chain }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Using Covalent API to get transactions
        const response = await axios.get(
          `https://api.covalenthq.com/v1/${chain.id}/address/${address}/transactions_v2/`,
          {
            params: {
              key: 'ckey_docs', // Using public demo key for this example
              "page-size": 20,
              "page-number": 0,
            }
          }
        );
        
        if (response.data && response.data.data && response.data.data.items) {
          setTransactions(response.data.data.items);
        } else {
          throw new Error('Invalid response from API');
        }
      } catch (err) {
        console.error('Error fetching transaction data:', err);
        setError(err.message || 'Failed to fetch transaction data');
        
        // Fallback to mock data for demo purposes
        setTransactions(Array(20).fill().map((_, i) => ({
          block_signed_at: new Date(Date.now() - (i * 86400000)).toISOString(),
          gas_spent: Math.floor(Math.random() * 200000) + 21000,
          gas_price: Math.floor(Math.random() * 100) + 10,
          value: `${Math.random() * 10}`,
          tx_hash: `0x${Array(64).fill().map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
          successful: Math.random() > 0.1 // 10% chance of failed transaction
        })));
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, [address, chain]);
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };
  
  // Format gas for display
  const formatGas = (gas) => {
    return (gas / 1000000).toFixed(2);
  };
  
  // Prepare chart data
  const chartData = {
    labels: transactions.slice(0, 10).map(tx => formatDate(tx.block_signed_at)).reverse(),
    datasets: [
      {
        label: 'Gas Used (Gwei)',
        data: transactions.slice(0, 10).map(tx => tx.gas_spent / 1000000).reverse(),
        borderColor: 'rgba(0, 163, 255, 1)',
        backgroundColor: 'rgba(0, 163, 255, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(0, 163, 255, 1)',
        pointBorderColor: '#fff',
        pointRadius: 4,
        tension: 0.4,
        fill: true,
      }
    ]
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(14, 17, 23, 0.8)',
        titleColor: '#00a3ff',
        bodyColor: '#fff',
        borderColor: 'rgba(0, 163, 255, 0.3)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => {
            return `Date: ${tooltipItems[0].label}`;
          },
          label: (tooltipItem) => {
            return `Gas: ${tooltipItem.raw.toFixed(2)} Gwei`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          font: {
            family: "'Orbitron', sans-serif",
            size: 10
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          font: {
            family: "'Orbitron', sans-serif",
            size: 10
          }
        }
      }
    }
  };
  
  return (
    <motion.div 
      className="glass-panel neon-blue p-6 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-audiowide text-gradient mb-4">GAS USAGE</h2>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-neon-blue rounded-full animate-spin border-t-transparent"></div>
        </div>
      ) : transactions.length > 0 ? (
        <div className="h-64">
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <p>No transaction data found for this wallet</p>
        </div>
      )}
      
      {!loading && transactions.length > 0 && (
        <div className="mt-4">
          <div className="text-xs text-gray-400 flex justify-between">
            <span>Last {transactions.length} transactions</span>
            <span className="text-neon-blue">
              Avg Gas: {formatGas(transactions.reduce((acc, tx) => acc + tx.gas_spent, 0) / transactions.length)} Gwei
            </span>
          </div>
          
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-2 font-orbitron text-gray-400 font-normal">DATE</th>
                  <th className="text-right py-2 font-orbitron text-gray-400 font-normal">GAS USED</th>
                  <th className="text-right py-2 font-orbitron text-gray-400 font-normal">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 5).map((tx, index) => (
                  <motion.tr 
                    key={tx.tx_hash}
                    className="border-b border-gray-800"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="py-2">{formatDate(tx.block_signed_at)}</td>
                    <td className="py-2 text-right font-orbitron text-neon-blue">{formatGas(tx.gas_spent)} Gwei</td>
                    <td className="py-2 text-right">
                      <span className={`inline-block w-2 h-2 rounded-full ${tx.successful ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default GasChart; 