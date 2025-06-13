import express from 'express';
import ApiLog from '../models/apilog.js';

const router = express.Router();


router.get('/dashboard', async (req, res) => {
  try {
    const totalRequestsAgg = await ApiLog.aggregate([
      { $group: { _id: null, total: { $sum: "$count" } } }
    ]);
    const totalRequests = totalRequestsAgg[0]?.total || 0;

    const avgResponseAgg = await ApiLog.aggregate([
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: "$responseTime" }
        }
      }
    ]);
    const avgResponseTime = avgResponseAgg[0]?.avgResponseTime?.toFixed(2) || "0.00";

    const endpointStats = await ApiLog.aggregate([
      {
        $group: {
          _id: "$endpoint",
          count: { $sum: "$count" }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const ipStats = await ApiLog.aggregate([
      {
        $group: {
          _id: "$ip",
          count: { $sum: "$count" }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.render('dashboard', {
      totalRequests,
      avgResponseTime,
      endpointStats,
      ipStats
    });

  } catch (err) {
    console.error('Dashboard Error:', err);
    res.status(500).send('Failed to load dashboard');
  }
});

export default router;