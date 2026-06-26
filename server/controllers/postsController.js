const { ThrowError } = require('../middleware/errorHandler');
const postsService = require('../services/postsService');

const getAllPostsController = async (req, res, next) => {
  const { search, page, limit, genre, medium, status } = req.query
  const postsPerPage = parseInt(limit) || 10;
  const skip = (parseInt(page || 1) - 1) * postsPerPage;

  try {
    const totalPosts = await postsService.getTotalPosts(search, genre, medium, status);
    const posts = await postsService.getAllPosts(skip, postsPerPage, search, genre, medium, status);
    res.status(200).json({
      totalPosts,
      totalPages: Math.ceil(totalPosts / postsPerPage),
      currentPage: page,
      posts
    });

  } catch (error) {
    next(error);
  }
}

const getPostController = async (req, res, next) => {
    try {
      const id  = parseInt(req.params.id);
      const post = await postsService.getPost(id);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
}

const createPostController = async (req, res, next) => {
    const { title, rate, status, genres, mediums, synopsis, review } = req.body;
    const user_id = req.user.id

    try {
      await postsService.createPost(title, user_id, rate, status, genres, mediums, synopsis, review)
      res.status(200).json({ message: 'Post created successfully'});
    } catch (error) {
      next(error);
    }
}

const updatePostController = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const { title, rate, status, genres, mediums, synopsis, review } = req.body;
  
    const dataToUpdate = Object.fromEntries(
      Object.entries({ title, rate, status, synopsis, review })
            .filter(([_, value]) => value !== undefined)
    )
  
    if (Object.keys(dataToUpdate).length === 0) {
      throw new ThrowError(400, 'No fields provided to update');
    }
  
    try {
      await postsService.updatePost(id, dataToUpdate, genres, mediums);
      const updatedPost = await postsService.getPost(id);
  
      res.status(200).json({ message: 'Post updated successfully', post: updatedPost })
    } catch (error) {
      next(error);
    }
}

const deletePostController = async (req, res, next) => {
    const id = parseInt(req.params.id);
    try {
      await postsService.deletePost(id);
      res.status(200).json({ message: 'Post deleted successfully' })
    } catch (error) {
      next(error);
    }
}

const createPostLikeController = async (req, res, next) => {
  const user_id = req.user.id
  const { post, mode } = req.query
  const post_id = parseInt(post)

  try {
    await postsService.createPostLike(user_id, post_id, mode);
    const post = await postsService.getPost(post_id);
    res.status(200).json({ message: 'Post liked/disliked successfully', post })
  } catch (error) {
    next(error);
  }
}

module.exports = {
    getAllPostsController,
    getPostController,
    createPostController,
    updatePostController,
    deletePostController,
    createPostLikeController
}