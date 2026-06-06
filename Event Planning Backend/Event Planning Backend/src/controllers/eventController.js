const Event = require('../models/Event')

exports.getEvents = async (req, res) => {
  try {
    const { category, search } = req.query
    const filter = {}
    if (category && category !== 'All') filter.category = category
    if (search) {
      const q = search.toLowerCase()
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { venue: { $regex: q, $options: 'i' } },
      ]
    }
    const events = await Event.find(filter).sort({ date: 1 })
    res.json(events)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: 'Event not found' })
    res.json(event)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.createEvent = async (req, res) => {
  try {
    const ev = new Event(req.body)
    const saved = await ev.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.updateEvent = async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updated)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
