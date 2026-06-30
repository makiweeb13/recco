const prisma = require('../prisma/client');

const createNotification = async (user_id, actor_id, type, message, post_id, comment_id) => {
  return prisma.notifications.create({
    data: {
      user_id: parseInt(user_id),
      actor_id: parseInt(actor_id),
      type,
      message,
      post_id: post_id ? parseInt(post_id) : null,
      comment_id: comment_id ? parseInt(comment_id) : null
    },
    include: {
      actors: {
        select: { username: true, profile_picture: true }
      }
    }
  });
};

const getNotifications = async (user_id, skip, limit) => {
  return prisma.notifications.findMany({
    where: { user_id: parseInt(user_id) },
    orderBy: { created_at: 'desc' },
    skip: skip || 0,
    take: limit || 20,
    include: {
      actors: {
        select: { username: true, profile_picture: true }
      }
    }
  });
};

const getUnreadCount = async (user_id) => {
  return prisma.notifications.count({
    where: { user_id: parseInt(user_id), read: false }
  });
};

const markAsRead = async (id, user_id) => {
  return prisma.notifications.updateMany({
    where: { id: parseInt(id), user_id: parseInt(user_id) },
    data: { read: true }
  });
};

const markAllAsRead = async (user_id) => {
  return prisma.notifications.updateMany({
    where: { user_id: parseInt(user_id), read: false },
    data: { read: true }
  });
};

module.exports = {
  createNotification,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead
};
