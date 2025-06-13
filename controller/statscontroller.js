import ApiLog from '../models/apilog.js';

export const getStats = async (req, res) => {
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

    const requestsByEndpoint = await ApiLog.aggregate([
      {
        $group: {
          _id: "$endpoint",
          count: { $sum: "$count" }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const topIPs = await ApiLog.aggregate([
      {
        $group: {
          _id: "$ip",
          count: { $sum: "$count" }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      totalRequests,
      avgResponseTime,
      requestsByEndpoint,
      topIPs
    });

  } catch (err) {
    res.status(500).json({ error: 'Error fetching stats' });
  }
};
