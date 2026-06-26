const { ThrowError } = require('../middleware/errorHandler');
const commentsService = require('../services/commentsService');

const getAllCommentsController = async (req, res, next) => {
    try {
      const comments = await commentsService.getAllComment();
      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
}

const createCommentController = async (req, res, next) => {
    const { post_id, parent_id, content } = req.body;
    const user_id = req.user.id
  
    try {
      const comment = await commentsService.createComment(post_id, user_id, parent_id, content);
      res.status(200).json({ message: 'Comment added successfully', comment });
    } catch (error) {
      next(error);
    }
}

const updateCommentController = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const { content } = req.body;
  
    const dataToUpdate = Object.fromEntries(
      Object.entries({ content })
            .filter(([_, value]) => value !== undefined)
    );
  
    if (Object.keys(dataToUpdate).length === 0) {
      throw new ThrowError(400, 'No fields provided to update');
    }
  
    try {
      const updatedComment = await commentsService.updateComment(id, dataToUpdate);
      res.status(200).json({ message: 'Comment updated successfully', comment: updatedComment })
    } catch (error) {
      next(error);
    }
}

const deleteCommentController = async (req, res, next) => {
    const id = parseInt(req.params.id);
    try {
      await commentsService.deleteComment(id);
      res.status(200).json({ message: 'Comment deleted successfully' })
    } catch(error) {
      next(error);
    }
}

const createCommentLikeController = async (req, res, next) => {
  const user_id = req.user.id
  const { comment, mode } = req.query
  const comment_id = parseInt(comment)

  try {
    await commentsService.createCommentLike(user_id, comment_id, mode);
    const comment = await commentsService.getComment(comment_id);

    res.status(200).json({ message: 'Comment liked/disliked successfully', comment })
  } catch (error) {
    next(error);
  }
}

module.exports = {
    getAllCommentsController,
    createCommentController,
    updateCommentController,
    deleteCommentController,
    createCommentLikeController
}