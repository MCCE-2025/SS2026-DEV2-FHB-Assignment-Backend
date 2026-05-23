const defaultNotes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2022-01-10T17:30:31.098Z',
    important: true,
  },
  {
    id: 2,
    content: 'Browser can execute only Javascript',
    date: '2022-01-10T18:39:34.091Z',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2022-01-10T19:20:14.298Z',
    important: true,
  },
]

let notes = [...defaultNotes]

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

const list = () => notes

const get = (id) => notes.find(note => note.id === id)

const create = ({ content, important = false }) => {
  if (!content) {
    const error = new Error('content missing')
    error.status = 400
    throw error
  }

  const note = {
    content,
    important,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)
  return note
}

const remove = (id) => {
  notes = notes.filter(note => note.id !== id)
}

const _resetForTests = (seed = []) => {
  notes = seed.map(note => ({ ...note }))
}

module.exports = {
  list,
  get,
  create,
  remove,
  generateId,
  _resetForTests,
}
