// Vercel API handler
export default function handler(req, res) {
  // This is a simple API that just serves as a health check
  res.status(200).json({
    status: 'ok',
    message: 'MULTIOC Analytics API is running',
    timestamp: new Date().toISOString()
  });
} 