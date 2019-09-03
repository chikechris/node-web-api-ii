const express = require('express')
const postsRouter = require('./routes/posts.js')

const server = express()



server.use('/api/posts', postsRouter)

server.listen(8000, () => {
  console.log('Port running on 8000')
})
