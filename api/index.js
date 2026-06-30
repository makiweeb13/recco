const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../server/.env') });

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const routes = require('../server/routes');
app.use('/api/users', routes.usersRoutes);
app.use('/api/posts', routes.postsRoutes);
app.use('/api/comments', routes.commentsRoutes);
app.use('/api/notifications', routes.notificationsRoutes);

const { errorHandler } = require('../server/middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
