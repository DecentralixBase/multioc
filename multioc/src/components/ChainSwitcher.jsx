import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChainSwitcher = ({ chains, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelect = (chainKey) => {
    onChange(chainKey);
    setIsOpen(false);
  };
  
  const currentChain = chains[selected];
  
  return (
    <div className="relative z-10">
      <motion.button
        className="glass-panel neon-blue py-3 px-6 rounded-md font-orbitron text-neon-blue 
          hover:bg-neon-blue hover:bg-opacity-10 transition-all duration-300 flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: currentChain.color }}></span>
        <span>{currentChain.name}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute mt-2 w-full min-w-[200px] glass-panel neon-blue rounded-md overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="py-1">
              {Object.entries(chains).map(([key, chain]) => (
                <motion.li
                  key={key}
                  className={`px-4 py-2 cursor-pointer flex items-center gap-2 hover:bg-neon-blue hover:bg-opacity-10
                    ${key === selected ? 'bg-neon-blue bg-opacity-10' : ''}`}
                  onClick={() => handleSelect(key)}
                  whileHover={{ x: 5 }}
                >
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: chain.color }}></span>
                  <span>{chain.name}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChainSwitcher; 