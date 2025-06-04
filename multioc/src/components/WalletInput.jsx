import { useState } from 'react';
import { motion } from 'framer-motion';

const WalletInput = ({ onSubmit }) => {
  const [address, setAddress] = useState('');
  const [isValid, setIsValid] = useState(true);
  
  const validateEthereumAddress = (address) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!address) {
      setIsValid(false);
      return;
    }
    
    const isValidAddress = validateEthereumAddress(address);
    setIsValid(isValidAddress);
    
    if (isValidAddress) {
      onSubmit(address);
    }
  };
  
  return (
    <motion.div 
      className="w-full md:w-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setIsValid(true);
            }}
            placeholder="Enter wallet address (0x...)"
            className={`w-full py-3 px-4 bg-opacity-20 bg-black backdrop-blur-md 
              border ${isValid ? 'border-neon-blue' : 'border-red-500'} 
              rounded-md focus:outline-none focus:ring-2 focus:ring-neon-blue 
              font-orbitron text-sm`}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <div className={`w-2 h-2 rounded-full ${address ? 'bg-neon-blue pulse' : 'bg-gray-600'}`}></div>
          </div>
        </div>
        
        <motion.button
          type="submit"
          className="glass-panel neon-blue py-3 px-6 rounded-md font-orbitron text-neon-blue 
            hover:bg-neon-blue hover:bg-opacity-10 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ANALYZE
        </motion.button>
      </form>
      
      {!isValid && (
        <motion.p 
          className="text-red-500 text-xs mt-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Please enter a valid Ethereum address (0x followed by 40 hexadecimal characters)
        </motion.p>
      )}
    </motion.div>
  );
};

export default WalletInput; 