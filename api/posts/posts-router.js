// implement your posts router here
const express = require('express')
const router = express.Router()

const posts = require('./posts-model')

// eslint-disable-next-line no-unused-vars
router.get('/', (req, res) => {
  posts.find()
    .then( allPosts => {
      res.status(200).json(allPosts)
    })
    .catch( () => {
      res.status(500).json({ message: "The posts information could not be retrieved" })
    })
})

router.get('/:id', (req, res) => {
  posts.findById(req.params.id)
    .then( post => {
      if(post)
        res.status(200).json(post)
      else
        res.status(404).json({ message: "The post with the specified ID does not exist" })
    })
    .catch( () => {
      res.status(500).json({ message: "The post information could not be retrieved" })
    })
})

router.get('/:id/comments', (req, res) => {
  posts.findPostComments(req.params.id)
    .then( comments => {
      console.log(comments)
      if(comments.length)
        res.status(200).json(comments)
      else
        res.status(404).json({ message: "The post with the specified ID does not exist" })
    })
    .catch( () => {
      res.status(500).json({ message: "The comments information could not be retrieved" })
    })
})

router.post('/', (req, res) => {
  const { title, contents } = req.body
  console.log(title, contents)
  if(title && contents)
    posts.insert({title, contents})
      .then( post => {
        res.status(201).json({...post, title, contents}) // for some reason it only returns an id?
      })
      .catch( () => {
        res.status(500).json({ message: "There was an error while saving the post to the database" })
      })
  else
    res.status(400).json({ message: "Please provide title and contents for the post" })
})

router.put('/:id', (req, res) => {
  const { title, contents } = req.body
  const id = req.params.id
  if(title && contents)
    posts.update(req.params.id, {id, title, contents})
      .then( post => {
        console.log(post) // why is this returning a 1??
        if(post)
          res.status(200).json({id: 1*req.params.id, title, contents}) // and ofc the id has to be an int and not a string
        else
          res.status(404).json({ message: "The post with the specified ID does not exist" })
      })
      .catch( () => {
        res.status(500).json({ message: "The post information could not be modified" })
      })
  else
    res.status(400).json({ message: "Please provide title and contents for the post" })
})


router.delete('/:id', async (req, res) => {
  let post
  try {
    post = await posts.findById(req.params.id)
  } catch {
    res.status(500).json({ message: "The post could not be removed" })
  }
  if(post)
    posts.remove(req.params.id)
      .then( notPost => {
        if(notPost) // WHY DO YOU KEEP RETURNING 1???
          res.status(200).json(post)
        else
          res.status(404).json({ message: "The post with the specified ID does not exist" })
      })
      .catch( (err) => {
        console.log(post, err)
        res.status(500).json({ message: "The post could not be removed" })
      })
  else
    res.status(404).json({ message: "The post with the specified ID does not exist" })
})

// router.delete('/:id', async (req, res) => {
//   posts.findById(req.params.id)
//     .then( post => {
//       if(post)
//         return posts.remove(req.params.id) // made an oopsie
//       else
//         return false
//     })
//     .then( post => {
//       if(post)
//         res.status(200).json(post)
//       else
//         res.status(404).json({ message: "The post with the specified ID does not exist" })
//     })
//     .catch( (err) => {
//       console.log(err)
//       res.status(500).json({ message: "The post could not be removed" })
//     })
// })

// doesn't work because helper functions are not sensible
// router.delete('/:id', (req, res) => {
//   posts.remove(req.params.id)
//     .then( post => {
//       if(post) // WHY DO YOU KEEP RETURNING 1???
//         res.status(200).json(post)
//       else
//         res.status(404).json({ message: "The post with the specified ID does not exist" })
//     })
//     .catch( () => {
//       res.status(500).json({ message: "The post could not be removed" })
//     })
    
// })

module.exports = router