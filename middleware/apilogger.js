import ApiLog from "../models/apilog.js";

const apiLogger = async (req, res, next) => {
  const ignoredPaths = [
    '/favicon.ico',
    '/favicon.png',
    '/chart.min.js',
    '/.well-known/appspecific/com.chrome.devtools.json',
    'https://tracker-dun-chi.vercel.app/'
  ];
  if (ignoredPaths.includes(req.originalUrl)) return next();

  const start = process.hrtime(); // start timer
  let ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip;

  // Normalize localhost addresses
  if (ip === '::1' || ip === '::ffff:127.0.0.1') {
    ip = '127.0.0.1';
  }

  res.on('finish', async () => {
    const diff = process.hrtime(start);
    const responseTime = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2); // ms

    await ApiLog.findOneAndUpdate(
      {
        method: req.method,
        endpoint: req.originalUrl,
        ip
      },
      {
        $inc: { count: 1 },
        $set: {
          lastAccessed: new Date(),
          responseTime: parseFloat(responseTime)
        }
      },
      { upsert: true, new: true }
    );
  });

  next();
};

export default apiLogger;
