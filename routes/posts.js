const express = require('express')
const router = express.Router()
const db = require('../data/db.js')
router.use(express.json())

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

module.exports = router
