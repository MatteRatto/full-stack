const express = require("express");
const router = express.Router();
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
} = require("../controllers/postsController");

const { protect } = require("../middleware/auth");
const { validatePost } = require("../utils/validator");

router.use(protect);

router.get("/", getPosts);

router.get("/my-posts", getMyPosts);

router.get("/:id", getPost);

router.post("/", validatePost, createPost);

router.put("/:id", validatePost, updatePost);

router.delete("/:id", deletePost);

module.exports = router;
