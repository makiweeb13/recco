const express = require('express');
const cors = require('cors');
const http = require('http');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { initIO } = require('./socket');
const { errorHandler } = require('./middleware/errorHandler');

// Configure CORS to allow frontend origin and allow credentials
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
};

// Middleware
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
dotenv.config();

const PORT = process.env.PORT || 5000;

// Import routes
const routes = require('./routes');

// Routes
app.use('/api/users', routes.usersRoutes);
app.use('/api/posts', routes.postsRoutes);
app.use('/api/comments', routes.commentsRoutes);
app.use('/api/notifications', routes.notificationsRoutes);

app.use(errorHandler);

// HTTP server + Socket.io
const server = http.createServer(app);
initIO(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
