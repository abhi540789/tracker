import ApiLog from "../models/apilog.js";

const apiLogger = async (req, res, next) => {
  const ignoredPaths = [
    '/favicon.ico',
    '/favicon.png',
    '/api/stats',
    '/chart.min.js',
    '/.well-known/appspecific/com.chrome.devtools.json',
    'https://tracker-dun-chi.vercel.app/'
  ];
  if (ignoredPaths.includes(req.originalUrl)) return next();

  let ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip;

  // Normalize localhost addresses
  if (ip === '::1' || ip === '::ffff:127.0.0.1') {
    ip = '127.0.0.1';
  }

  await ApiLog.findOneAndUpdate(
    {
      method: req.method,
      endpoint: req.originalUrl,
      ip
    },
    {
      $inc: { count: 1 },
      $set: { lastAccessed: new Date() }
    },
    { upsert: true, new: true }
  );

  next();
};


export default apiLogger;
