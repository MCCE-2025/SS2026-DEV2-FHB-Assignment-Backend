const request = require('supertest')
const app = require('../../app')
const notesService = require('../../services/notesService')

describe('notes API', () => {
  beforeEach(() => {
    notesService._resetForTests([
      {
        id: 1,
        content: 'seed note',
        date: '2022-01-10T17:30:31.098Z',
        important: false,
      },
    ])
  })

  it('GET /api/notes returns all notes and GET /api/notes/:id returns one or 404', async () => {
    const listResponse = await request(app).get('/api/notes')
    expect(listResponse.status).toBe(200)
    expect(listResponse.body).toHaveLength(1)
    expect(listResponse.body[0].content).toBe('seed note')

    const foundResponse = await request(app).get('/api/notes/1')
    expect(foundResponse.status).toBe(200)
    expect(foundResponse.body.id).toBe(1)

    const missingResponse = await request(app).get('/api/notes/999')
    expect(missingResponse.status).toBe(404)
  })

  it('POST /api/notes creates a note or returns 400 when content is missing', async () => {
    const createResponse = await request(app)
      .post('/api/notes')
      .send({ content: 'new note', important: true })
    expect(createResponse.status).toBe(200)
    expect(createResponse.body.content).toBe('new note')
    expect(createResponse.body.important).toBe(true)

    const listResponse = await request(app).get('/api/notes')
    expect(listResponse.body).toHaveLength(2)

    const badResponse = await request(app)
      .post('/api/notes')
      .send({ important: true })
    expect(badResponse.status).toBe(400)
    expect(badResponse.body.error).toBe('content missing')
  })

  it('DELETE /api/notes/:id removes a note', async () => {
    const deleteResponse = await request(app).delete('/api/notes/1')
    expect(deleteResponse.status).toBe(204)

    const listResponse = await request(app).get('/api/notes')
    expect(listResponse.body).toHaveLength(0)
  })
})
