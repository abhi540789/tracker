import mongoose from 'mongoose';

const apiLogSchema = new mongoose.Schema({
  method: {
    type: String,
    required: true
  },
  endpoint: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 1
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  responseTime: {
    type: Number,
    default: 0
  }
});

const ApiLog = mongoose.model('ApiLog', apiLogSchema);

export default ApiLog;
