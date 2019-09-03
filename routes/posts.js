const express = require('express')
const router = express.Router()
const db = require('../data/db.js')
router.use(express.json())

// Get
router.get('/', (req, res) => {
  db.find()
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        message: 'The post information could not be retrieved.'
      })
    })
})

router.get('/:id', (req, res) => {
  const postId = req.params.id
  db.findById(postId)
    .then(post => {
      if (post) {
        res.status(200).json(post)
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

module.exports = router
