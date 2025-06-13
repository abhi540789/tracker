import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import apiLogger from './middleware/apilogger.js';
import statsRoutes from './routes/statsroutes.js'
import dashboardRoutes from './routes/dashboard.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use('/', dashboardRoutes);
app.use(apiLogger);
app.use(express.json());
app.use('/api', statsRoutes);
    
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));



//app.get('/api/hello', (req, res) => { res.json({ message: 'Hello, world!' });});
//app.get('/api/hello2', (req, res) => { res.json({ message: 'Hello, world! 2' });});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
