const Post = require("../models/Post");

// @desc    Get all posts with pagination
// @route   GET /api/posts
// @access  Private
const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search;

    let result;
    if (search) {
      result = await Post.search(search, page, limit);
    } else {
      result = await Post.findAll(page, limit);
    }

    res.status(200).json({
      success: true,
      data: result.posts,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Private
const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post non trovato",
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Titolo e contenuto sono obbligatori",
      });
    }

    const post = await Post.create({
      user_id: req.user.id,
      title,
      content,
    });

    res.status(201).json({
      success: true,
      message: "Post creato con successo",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (solo autore del post)
const updatePost = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Titolo e contenuto sono obbligatori",
      });
    }

    const updatedPost = await Post.update(req.params.id, req.user.id, {
      title,
      content,
    });

    res.status(200).json({
      success: true,
      message: "Post aggiornato con successo",
      data: updatedPost,
    });
  } catch (error) {
    if (
      error.message.includes("non trovato") ||
      error.message.includes("permessi")
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (solo autore del post)
const deletePost = async (req, res, next) => {
  try {
    const deleted = await Post.delete(req.params.id, req.user.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Post non trovato o non hai i permessi per eliminarlo",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post eliminato con successo",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's posts
// @route   GET /api/posts/my-posts
// @access  Private
const getMyPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await Post.findByUserId(req.user.id, page, limit);

    res.status(200).json({
      success: true,
      data: result.posts,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
};
