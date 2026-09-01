import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb://127.0.0.1:27017/resume_builder_db';

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// Routes
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'ResumeAI MERN Auth Backend',
    database:
      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Database connection & server start
const startServer = async () => {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await mongoose
        .connect(MONGO_URI)
        .then(() => console.log('✓ MongoDB Connected Successfully'))
        .catch((err) =>
          console.warn(
            '⚠️ MongoDB connection warning (will run in offline fallback mode if DB is not active):',
            err.message
          )
        );
    }

    app.listen(PORT, () => {
      console.log(`🚀 MERN Auth Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server failed to start:', error);
  }
};

startServer();

export default app;
