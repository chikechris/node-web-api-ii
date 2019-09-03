const express = require('express')
const router = express.Router()
const db = require('../data/db.js')
router.use(express.json())

//Router test on root
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Success!!!' })
})

// Get posts
router.get('/api/posts', (req, res) => {
  db.find()
    .then(result => res.status(201).json(result))
    .catch(error =>
      res
        .status(500)
        .json({ error: 'The posts information could not be retrieved.' })
    )
})

// Get post  by id
router.get('/api/posts/:id', (req, res) => {
  const id = req.params.id

  db.findById(id)
    .then(result => {
      console.log(result.length)
      if (result.length > 0) {
        res.status(201).json(result)
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' })
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'The post information could not be retrieved.' })
    })
})

// GET request for comments using post id:
router.get('/api/posts/:id/comments', (req, res) => {
  const postId = req.params.id
  console.log('id from comments request', postId)

  db.findById(postId)
    .then(posts => {
      if (posts.length > 0) {
        db.findPostComments(Number(postId))
          .then(result => {
            res.status(201).json(result)
          })
          .catch(err => {
            res.status(500).json({
              error: 'The comments information could not be retrieved.'
            })
          })
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' })
      }
    })
    .catch(err => {
      console.log(err)
    })
})

// Post
router.post('/api/posts/:id/comments', (req, res) => {
  const postId = req.params.id
  const commentObject = req.body

  db.findById(postId).then(posts => {
    if (posts.length > 0) {
      if (commentObject.text) {
        db.insertComment(commentObject)
          .then(result => {
            db.findCommentById(result.id)
              .then(result => {
                res.status(201).json(result)
              })
              .catch(err => {
                console.log(err)
              })
          })
          .catch(err => {
            res.status(500).json({
              error:
                'There was an error while saving the comment to the database'
            })
          })
      } else {
        res
          .status(400)
          .json({ errorMessage: 'Please provide text for the comment.' })
      }
    } else {
      res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' })
    }
  })
})

// Delete
router.delete('/api/posts/:id', (req, res) => {
  const postId = req.params.id

  db.findById(postId)
    .then(result => {
      const postDelete = result
      if (result.length > 0) {
        db.remove(postId)
          .then(results => {
            res.status(200).json(postDelete)
          })
          .catch(err => {
            res.status(500).json({ error: 'The post could not be removed' })
          })
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' })
      }
    })
    .catch(error => {
      console.log(error)
    })
})

// Put
router.put('/api/posts/:id', (req, res) => {
  const postId = req.params.id
  const postUpdate = req.body

  console.log(postUpdate)

  db.findById(postId).then(result => {
    if (result.length > 0) {
      if (postUpdate.title && postUpdate.contents) {
        db.update(postId, postUpdate)
          .then(results => {
            db.findById(postId)
              .then(success => {
                res.status(200).json(success)
              })
              .catch(err => {
                console.log(err)
              })
          })
          .catch(err => {
            res
              .status(500)
              .json({ error: 'The post information could not be modified.' })
          })
      } else {
        res.status(400).json({
          errorMessage: 'Please provide title and contents for the post.'
        })
      }
    } else {
      res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' })
    }
  })
})

module.exports = router
