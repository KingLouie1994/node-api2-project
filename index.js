const express = require("express");
const cors = require("cors");

const {
  find,
  findById,
  insert,
  update,
  remove,
  findPostComments,
  findCommentById,
  insertComment
} = require("./data/db");

const server = express();

server.listen(6000, () => {
  console.log("listening on 6000");
});

server.use(express.json());
server.use(cors());

server.post("/api/posts", (req, res) => {
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

server.get("/api/posts", (req, res) => {
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

server.get("/api/posts/:id", (req, res) => {
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
