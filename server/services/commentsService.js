const prisma = require('../prisma/client');

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
          // Undo like if comment already liked
          await prisma.commentlikes.delete({
            where: {
              id: like.id
            }
          })
        } else { 
          // Proceed to like comment
          await prisma.commentlikes.create({
          data: {
            comment_id,
            user_id
          }
          })
          // Undo dislike if comment already disliked
          if (dislike) {
            await prisma.commentdislikes.delete({
              where: {
                id: dislike.id
              }
            })
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