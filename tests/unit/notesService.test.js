const notesService = require('../../services/notesService')

describe('notesService', () => {
  beforeEach(() => {
    notesService._resetForTests([])
  })

  it('generateId returns 1 when store is empty', () => {
    expect(notesService.generateId()).toBe(1)
  })

  it('generateId returns max(id) + 1 with existing notes', () => {
    notesService._resetForTests([
      { id: 1, content: 'a', date: '2022-01-01', important: false },
      { id: 5, content: 'b', date: '2022-01-02', important: true },
    ])
    expect(notesService.generateId()).toBe(6)
  })

  it('create throws when content is missing and returns a note when valid', () => {
    expect(() => notesService.create({ content: '' })).toThrow('content missing')

    const note = notesService.create({ content: 'test note' })
    expect(note.id).toBe(1)
    expect(note.content).toBe('test note')
    expect(note.important).toBe(false)
    expect(note.date).toBeInstanceOf(Date)
  })
})
