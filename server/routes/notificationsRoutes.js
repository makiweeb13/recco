const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/', authenticateToken, notificationsController.getNotificationsController);
router.get('/unread-count', authenticateToken, notificationsController.getUnreadCountController);
router.put('/:id/read', authenticateToken, notificationsController.markAsReadController);
router.put('/read-all', authenticateToken, notificationsController.markAllAsReadController);

module.exports = router;
