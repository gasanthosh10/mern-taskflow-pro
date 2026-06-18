import dotenv from 'dotenv';
import { createApp } from './app.js';
import { connectDb } from './config/db.js';

dotenv.config();

const port = process.env.PORT || 5000;

const startServer = async () => {
  await connectDb(process.env.MONGO_URI);
  const app = createApp();

  app.listen(port, () => {
    console.log(`TaskFlow Pro API running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});

