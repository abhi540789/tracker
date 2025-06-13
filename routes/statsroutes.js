import express from 'express';
import { getStats } from '../controller/statscontroller.js';
import { helloLimiter } from '../middleware/ratelimit.js';

const router = express.Router();
router.get('/stats', getStats);


router.get('/hello', helloLimiter, (req, res) => {
  res.json({"Hello":"00000000"})
});


router.get('/hello2', helloLimiter, (req, res) => {
  res.send('👋 Hello from the API!');
});


export default router;
