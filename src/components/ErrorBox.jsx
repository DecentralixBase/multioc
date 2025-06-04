import { motion } from 'framer-motion';

const ErrorBox = ({ message }) => {
  return (
    <motion.div 
      className="glass-panel border border-red-500 p-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-16 h-16 mx-auto mb-4 relative">
        <div className="w-full h-full rounded-full border-2 border-red-500 flex items-center justify-center">
          <motion.div 
            className="w-10 h-10 rounded-full border-2 border-red-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <motion.div 
          className="absolute inset-0 border-2 border-red-500 rounded-full opacity-50"
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      
      <h3 className="text-xl font-audiowide text-red-500 mb-2">ERROR DETECTED</h3>
      <p className="text-gray-300 mb-4">{message || "An error occurred while fetching blockchain data. Please try again."}</p>
      
      <div className="flex flex-col items-center">
        <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-red-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1 }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2 font-orbitron">System diagnostic complete</p>
      </div>
      
      <div className="mt-6">
        <motion.button
          className="border border-red-500 text-red-500 py-2 px-4 rounded-md font-orbitron
            hover:bg-red-500 hover:bg-opacity-10 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
        >
          RETRY SCAN
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ErrorBox; 