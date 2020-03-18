const express = require('express');
const userDB =  require("./userDb");
const postDB = require("../posts/postDb");

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  userDB
  .insert(req.body)
  .then(u => {
    res.status(201).json(u);
  })
  .catch(() => {
    res.status(500).json({
      message: "could not post user"
    });
  });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  postDb
    .insert(req.body)
    .then(p => {
      res.status(201).json(p);
    })
    .catch(() => {
      res.status(500).json({
        message: "could not post to DB"
      });
    });
});

router.get('/', (req, res) => {
  userDb
  .get()
  .then(u => {
    res.status(200).json(u);
  })
  .catch(() => {
    res.status(500).json({
      message: "could not get users"
    });
  });
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  userDb
  .getUserPosts(req.user.id)
  .then(u => {
    res.status(200).json(u);
  })
  .catch(() => {
    res.status(500).json({
      message: "could not get posts"
    });
  });
});

router.delete('/:id', validateUserId, (req, res) => {
  userDb
  .remove(req.user.id)
  .then(u => {
    res.status(200).json(u);
  })
  .catch(() => {
    res.status(500).json({
      message: "could not delete user"
    });
  });
});

router.put('/:id', validateUserId, (req, res) => {
  userDb
  .update(req.user.id, req.body)
  .then(u => {
    res.status(200).json(u);
  })
  .catch(() => {
    res.status(500).json({
      message: "could not update user"
    });
  });
});

//custom middleware

function validateUserId(req, res, next) {
  userDB
  .getById(req.params.id)
  .then(u => {
    if (u) {
      req.user = u;
      next();
    } else {
      res.status(400).json({
        message: "invalid user id"
      });
    }
  })
  .catch(() => {
    res.status(500).json({
      message: "error retrieving the user id"
    });
  });
}

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({
      message: "missing user data"
    });
  } else if (!req.body.name) {
    res.status(400).json({
      message: "missing required name field"
    });
  }
  next();
}

function validatePost(req, res, next) {
  response = {
    text: req.body.text,
    user_is: req.params.id
  };
  if (!req.body) {
    res.status(400).json({
      message: "missing post data"
    });
  } else if (!req.body.text) {
    res.status(400).json({
      message: "missing required text field"
    });
  } else {
    req.body = response;
    next();
  }
}

module.exports = router;
