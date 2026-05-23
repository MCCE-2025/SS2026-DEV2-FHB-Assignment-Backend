const express = require('express')
const notesService = require('./services/notesService')

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.post('/api/notes', (request, response) => {
  try {
    const note = notesService.create({
      content: request.body.content,
      important: request.body.important || false,
    })
    response.json(note)
  } catch (error) {
    if (error.status === 400) {
      return response.status(400).json({ error: error.message })
    }
    throw error
  }
})

app.get('/api/notes', (req, res) => {
  res.json(notesService.list())
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notesService.remove(id)
  response.status(204).end()
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notesService.get(id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

module.exports = app
