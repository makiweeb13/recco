const notificationsService = require('../services/notificationsService');

const getNotificationsController = async (req, res, next) => {
  const { page, limit } = req.query;
  const notifsPerPage = parseInt(limit) || 20;
  const skip = (parseInt(page || 1) - 1) * notifsPerPage;

  try {
    const notifications = await notificationsService.getNotifications(req.user.id, skip, notifsPerPage);
    const unreadCount = await notificationsService.getUnreadCount(req.user.id);
    res.status(200).json({ notifications, unreadCount });
  } catch (error) {
    next(error);
  }
};

const getUnreadCountController = async (req, res, next) => {
  try {
    const count = await notificationsService.getUnreadCount(req.user.id);
    res.status(200).json({ count });
  } catch (error) {
    next(error);
  }
};

const markAsReadController = async (req, res, next) => {
  try {
    await notificationsService.markAsRead(req.params.id, req.user.id);
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
};

const markAllAsReadController = async (req, res, next) => {
  try {
    await notificationsService.markAllAsRead(req.user.id);
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotificationsController,
  getUnreadCountController,
  markAsReadController,
  markAllAsReadController
};
