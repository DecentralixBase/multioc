import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <motion.div 
      className="glass-panel neon-blue p-8 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-24 h-24 mb-6">
        <motion.div 
          className="absolute inset-0 border-2 border-neon-blue rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute inset-2 border-2 border-neon-purple rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute inset-4 border-2 border-neon-cyan rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-neon-blue rounded-full pulse" />
        </div>
      </div>
      
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-audiowide text-neon-blue mb-2">SCANNING BLOCKCHAIN</h3>
        <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-neon-blue"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2 font-orbitron">Fetching on-chain data...</p>
      </motion.div>
    </motion.div>
  );
};

export default Loader; 