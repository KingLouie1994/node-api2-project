const express = require("express");
const {
  find,
  findById,
  insert,
  update,
  remove,
  findPostComments,
  findCommentById,
  insertComment
} = require("./db");

const router = express.Router();

router.post("/api/posts", (req, res) => {
  const newPost = {
    title: req.body.title,
    contents: req.body.contents
  };

  if (!newPost.title || !newPost.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }

  insert(newPost)
    .then(post => {
      res.status(201).json(post);
      post;
    })
    .catch(error => {
      res.status(500).json({
        error: "There was an error while saving the post to the database"
      });
    });
});

router.post("/api/posts/:id/comments", (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  findById(id)
    .then(post => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else if (!text) {
        res
          .status(400)
          .json({ errorMessage: "Please provide text for the comment." });
      } else {
        insertComment({ text, post_id: id }).then(comment => {
          res.status(201).json(comment);
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        error: "There was an error while saving the comment to the database"
      });
    });
});

router.get("/api/posts", (req, res) => {
  find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res.status(500).json({
        error: "The posts information could not be retrieved."
      });
    });
});

router.get("/api/posts/:id", (req, res) => {
  const { id } = req.params;
  findById(id)
    .then(post => {
      if (post.length > 0) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        error: "The post information could not be retrieved."
      });
    });
});

router.get("/api/posts/:id/comments", (req, res) => {
  const { id } = req.params;
  findPostComments(id)
    .then(comments => {
      if (comments) {
        res.status(200).json(comments);
      } else {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        error: "The comments information could not be retrieved."
      });
    });
});

router.delete("/api/posts/:id", (req, res) => {
  const { id } = req.params;
  remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(202).json(`Post got deleted`);
      } else {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        error: "The post could not be removed"
      });
    });
});

module.exports = router;
