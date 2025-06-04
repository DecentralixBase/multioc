import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const NFTGrid = ({ address, chain }) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  
  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      setError(null);
      setPage(1);
      
      try {
        // Using Moralis API to get NFTs
        // Note: In a real app, you'd need to use your own API key
        const response = await axios.get(
          `https://deep-index.moralis.io/api/v2/${address}/nft`,
          {
            params: {
              chain: chain.id === 1 ? 'eth' : 
                     chain.id === 137 ? 'polygon' : 
                     chain.id === 56 ? 'bsc' : 'eth',
              format: 'decimal',
              limit: 50,
            },
            headers: {
              'X-API-Key': 'demo-api-key' // Replace with your Moralis API key
            }
          }
        );
        
        if (response.data && response.data.result) {
          setNfts(response.data.result);
        } else {
          throw new Error('Invalid response from API');
        }
      } catch (err) {
        console.error('Error fetching NFT data:', err);
        setError(err.message || 'Failed to fetch NFT data');
        
        // Fallback to mock data for demo purposes
        setNfts(Array(12).fill().map((_, i) => ({
          token_id: `${i+1}`,
          token_address: `0x${Array(40).fill().map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
          name: `NFT #${i+1}`,
          symbol: 'NFT',
          metadata: JSON.stringify({
            name: `NFT #${i+1}`,
            description: `This is a mock NFT #${i+1}`,
            image: `https://picsum.photos/200/300?random=${i+1}`,
            attributes: [
              { trait_type: 'Rarity', value: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'][Math.floor(Math.random() * 5)] },
              { trait_type: 'Type', value: ['Art', 'Collectible', 'Game Item', 'Avatar'][Math.floor(Math.random() * 4)] }
            ]
          })
        })));
      } finally {
        setLoading(false);
      }
    };
    
    fetchNFTs();
  }, [address, chain]);
  
  // Parse NFT metadata
  const parseMetadata = (nft) => {
    try {
      if (!nft.metadata) return null;
      return typeof nft.metadata === 'string' ? JSON.parse(nft.metadata) : nft.metadata;
    } catch (e) {
      console.error('Error parsing NFT metadata:', e);
      return null;
    }
  };
  
  // Get NFT image
  const getNftImage = (nft) => {
    const metadata = parseMetadata(nft);
    if (!metadata) return `https://via.placeholder.com/300?text=NFT+${nft.token_id}`;
    
    // Check various image fields that might be present in metadata
    const imageUrl = metadata.image || 
                    metadata.image_url || 
                    metadata.image_uri || 
                    metadata.animation_url || 
                    `https://via.placeholder.com/300?text=NFT+${nft.token_id}`;
    
    // Handle IPFS URLs
    if (imageUrl.startsWith('ipfs://')) {
      return imageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }
    
    return imageUrl;
  };
  
  // Get NFT name
  const getNftName = (nft) => {
    const metadata = parseMetadata(nft);
    return metadata?.name || nft.name || `NFT #${nft.token_id}`;
  };
  
  // Pagination
  const totalPages = Math.ceil(nfts.length / itemsPerPage);
  const displayedNfts = nfts.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  
  return (
    <motion.div 
      className="glass-panel neon-cyan p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-audiowide text-gradient mb-4">NFT GALLERY</h2>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-2 border-neon-cyan rounded-full animate-spin border-t-transparent"></div>
        </div>
      ) : displayedNfts.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {displayedNfts.map((nft, index) => (
              <motion.div 
                key={`${nft.token_address}-${nft.token_id}`}
                className="glass-panel neon-cyan floating-card overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 255, 245, 0.4)' }}
              >
                <div className="aspect-square overflow-hidden bg-gray-900">
                  <img 
                    src={getNftImage(nft)} 
                    alt={getNftName(nft)}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://via.placeholder.com/300?text=NFT+${nft.token_id}`;
                    }}
                  />
                </div>
                <div className="p-2">
                  <h3 className="text-xs font-medium truncate">{getNftName(nft)}</h3>
                  <p className="text-[10px] text-gray-400 truncate">ID: {nft.token_id}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`px-3 py-1 rounded-md font-orbitron text-sm ${page === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-neon-cyan hover:bg-neon-cyan hover:bg-opacity-10'}`}
              >
                &lt;
              </button>
              
              <div className="flex items-center px-3 font-orbitron text-sm">
                <span className="text-neon-cyan">{page}</span>
                <span className="mx-1 text-gray-500">/</span>
                <span className="text-gray-500">{totalPages}</span>
              </div>
              
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`px-3 py-1 rounded-md font-orbitron text-sm ${page === totalPages ? 'text-gray-500 cursor-not-allowed' : 'text-neon-cyan hover:bg-neon-cyan hover:bg-opacity-10'}`}
              >
                &gt;
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>No NFTs found for this wallet on {chain.name}</p>
        </div>
      )}
    </motion.div>
  );
};

export default NFTGrid; 