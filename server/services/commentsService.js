const prisma = require('../prisma/client');
const { getIO } = require('../socket');
const notificationsService = require('./notificationsService');

const getAllComment = async () => {
    const comments = await prisma.comments.findMany({
        include: {
          posts: true, // Include related post for each comment
          users: true // Include related user for each comment
        },
    });
    return comments;
}

const getComment = async (id) => {
    const comment = await prisma.comments.findUnique({
        where: {
          id: id
        },
        include: {
            users: true, // Include user data for each comment
            comments: {
              include: {
                users: true // Include user data for parent comment
              }
            },
            commentlikes: {
              include: {
                users: true,
                comments: true
              }
            },
            commentdislikes: {
              include: {
                users: true,
                comments: true
              }
            }
        }
    });
    return comment;
}

const createComment = async ( post_id, user_id, parent_id, content ) => {
    const newComment = await prisma.comments.create({
        data: {
          post_id: parseInt(post_id),
          user_id: parseInt(user_id),
          parent_id: parent_id ?? null,
          content
        }
    });
    const findComment = await getComment(newComment.id);

    const post = await prisma.posts.findUnique({ where: { id: parseInt(post_id) }, select: { user_id: true, title: true } });
    if (parent_id) {
      const parentComment = await prisma.comments.findUnique({ where: { id: parseInt(parent_id) }, select: { user_id: true } });
      if (parentComment && parentComment.user_id !== user_id) {
        const actor = await prisma.users.findUnique({ where: { id: user_id }, select: { username: true } });
        const notif = await notificationsService.createNotification(
          parentComment.user_id, user_id, 'reply',
          `${actor.username} replied to your comment`,
          post_id, newComment.id
        );
        try { getIO().to(`user:${parentComment.user_id}`).emit('notification', notif); } catch {}
      }
    } else if (post && post.user_id !== user_id) {
      const actor = await prisma.users.findUnique({ where: { id: user_id }, select: { username: true } });
      const notif = await notificationsService.createNotification(
        post.user_id, user_id, 'comment',
        `${actor.username} commented on your post "${post.title.substring(0, 50)}"`,
        post_id, newComment.id
      );
      try { getIO().to(`user:${post.user_id}`).emit('notification', notif); } catch {}
    }

    return findComment;
}

const updateComment = async ( id, dataToUpdate ) => {
    await prisma.comments.update({
        where: {
          id: id
        },
        data: dataToUpdate
    })
    const updatedComment = await getComment(id);
    return updatedComment;
}

const deleteComment = async (id) => {
    await prisma.comments.delete({
        where: {
          id: id
        }
    })
}

const createCommentLike = async ( user_id, comment_id, mode ) => {
    const like = await prisma.commentlikes.findUnique({
        where: {
          comment_id_user_id: {
            comment_id,
            user_id
          }
        }
      })
  
    const dislike = await prisma.commentdislikes.findUnique({
        where: {
          comment_id_user_id: {
            comment_id,
            user_id
          }
        }
      })
  
    if (mode === 'like') {
        if (like) {
          await prisma.commentlikes.delete({
            where: {
              id: like.id
            }
          })
        } else {
          await prisma.commentlikes.create({
          data: {
            comment_id,
            user_id
          }
          })
          if (dislike) {
            await prisma.commentdislikes.delete({
              where: {
                id: dislike.id
              }
            })
          }
          const comment = await prisma.comments.findUnique({ where: { id: comment_id }, select: { user_id: true, post_id: true } });
          if (comment && comment.user_id !== user_id) {
            const actor = await prisma.users.findUnique({ where: { id: user_id }, select: { username: true } });
            const notif = await notificationsService.createNotification(
              comment.user_id, user_id, 'comment_like',
              `${actor.username} liked your comment`,
              comment.post_id, comment_id
            );
            try { getIO().to(`user:${comment.user_id}`).emit('notification', notif); } catch {}
          }
        }
    } 
    else if (mode === 'dislike') {
        if (dislike) {
          // Undo dislike if comment already disliked
          await prisma.commentdislikes.delete({
            where: {
              id: dislike.id
            }
          })
        } else {
          // Proceed to dislike comment
          await prisma.commentdislikes.create({
            data: {
              comment_id,
              user_id
            }
          })
          // Undo like if comment already liked
          if (like) {
            await prisma.commentlikes.delete({
              where: {
                id: like.id
              }
            })
          }
          const comment = await prisma.comments.findUnique({ where: { id: comment_id }, select: { user_id: true, post_id: true } });
          if (comment && comment.user_id !== user_id) {
            const actor = await prisma.users.findUnique({ where: { id: user_id }, select: { username: true } });
            const notif = await notificationsService.createNotification(
              comment.user_id, user_id, 'comment_dislike',
              `${actor.username} disliked your comment`,
              comment.post_id, comment_id
            );
            try { getIO().to(`user:${comment.user_id}`).emit('notification', notif); } catch {}
          }
        }
    }
}

module.exports = {
    getAllComment,
    getComment,
    createComment,
    updateComment,
    deleteComment,
    createCommentLike
}