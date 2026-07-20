const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

const JSON_DB_FILE = path.join(__dirname, '../../db.json')
let isMockMode = false

// Helper to read JSON DB
function readJsonDb() {
  if (!fs.existsSync(JSON_DB_FILE)) {
    const initialData = {
      users: [],
      bookings: [],
      events: [
        {
          _id: '64b0f1a2c8a2a5e4d2a1b101',
          title: 'Sunset Garden Wedding',
          category: 'Wedding',
          date: 'Mar 15, 2026',
          venue: 'Grand Hyatt, Mumbai',
          description: "A romantic garden wedding with sunset views and premium catering.",
          image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600',
        },
        {
          _id: '64b0f1a2c8a2a5e4d2a1b102',
          title: 'Corporate Annual Gala',
          category: 'Corporate',
          date: 'Mar 20, 2026',
          venue: 'Taj Palace, Delhi',
          description: 'Celebrate your company achievements with style and sophistication.',
          image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
        },
        {
          _id: '64b0f1a2c8a2a5e4d2a1b103',
          title: 'Milestone Birthday Bash',
          category: 'Birthday',
          date: 'Mar 25, 2026',
          venue: 'The Oberoi, Bangalore',
          description: 'Make turning 30 memorable with an exclusive rooftop celebration.',
          image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600',
        },
        {
          _id: '64b0f1a2c8a2a5e4d2a1b104',
          title: 'Live Jazz Night',
          category: 'Concert',
          date: 'Apr 1, 2026',
          venue: 'JW Marriott, Pune',
          description: 'An evening of soulful jazz under the stars with premium bar.',
          image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600',
        },
        {
          _id: '64b0f1a2c8a2a5e4d2a1b105',
          title: 'Traditional Wedding Ceremony',
          category: 'Wedding',
          date: 'Apr 10, 2026',
          venue: 'Leela Palace, Udaipur',
          description: 'A grand traditional wedding with royal treatment and heritage charm.',
          image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600',
        },
        {
          _id: '64b0f1a2c8a2a5e4d2a1b106',
          title: 'Product Launch Party',
          category: 'Corporate',
          date: 'Apr 15, 2026',
          venue: 'Four Seasons, Mumbai',
          description: 'Launch your product with a buzz-worthy event for media and clients.',
          image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600',
        }
      ]
    }
    fs.writeFileSync(JSON_DB_FILE, JSON.stringify(initialData, null, 2))
  }
  try {
    return JSON.parse(fs.readFileSync(JSON_DB_FILE, 'utf8'))
  } catch (err) {
    return { users: [], bookings: [], events: [] }
  }
}

// Helper to write JSON DB
function writeJsonDb(data) {
  fs.writeFileSync(JSON_DB_FILE, JSON.stringify(data, null, 2))
}

class MockQuery {
  constructor(promise) {
    this.promise = promise
  }
  sort(options) {
    return this
  }
  populate(field) {
    this.promise = this.promise.then(async (data) => {
      const db = readJsonDb()
      const populateDoc = (doc) => {
        if (!doc) return doc
        if (field === 'event' && doc.event) {
          const targetId = typeof doc.event === 'object' ? (doc.event._id || doc.event.id) : doc.event
          const matchedEvent = db.events.find(e => e._id?.toString() === targetId?.toString() || e.id?.toString() === targetId?.toString())
          return { ...doc, event: matchedEvent || doc.event }
        }
        return doc
      }
      if (Array.isArray(data)) {
        return data.map(populateDoc)
      }
      return populateDoc(data)
    })
    return this
  }
  select(fields) {
    this.promise = this.promise.then(data => {
      const excludeFields = (doc) => {
        if (!doc) return doc
        const newDoc = { ...doc }
        if (fields.includes('-password')) {
          delete newDoc.password
        }
        return newDoc
      }
      if (Array.isArray(data)) return data.map(excludeFields)
      return excludeFields(data)
    })
    return this
  }
  then(resolve, reject) {
    return this.promise.then(resolve, reject)
  }
  catch(reject) {
    return this.promise.catch(reject)
  }
}

function getCollectionKey(modelName) {
  if (modelName === 'Event') return 'events'
  if (modelName === 'Booking') return 'bookings'
  if (modelName === 'User') return 'users'
  return modelName.toLowerCase() + 's'
}

function mockModel(Model) {
  const collectionKey = getCollectionKey(Model.modelName)

  Model.find = function(filter = {}) {
    const p = Promise.resolve().then(() => {
      const db = readJsonDb()
      let docs = db[collectionKey] || []
      if (filter && Object.keys(filter).length > 0) {
        docs = docs.filter(doc => {
          for (const key in filter) {
            if (key === '$or' && Array.isArray(filter.$or)) {
              const matchesOr = filter.$or.some(cond => {
                return Object.entries(cond).some(([k, val]) => {
                  if (val && val.$regex) {
                    const regex = new RegExp(val.$regex, val.$options || 'i')
                    return regex.test(doc[k] || '')
                  }
                  return doc[k] === val
                })
              })
              if (!matchesOr) return false
            } else if (filter[key] && filter[key].$regex) {
              const regex = new RegExp(filter[key].$regex, filter[key].$options || 'i')
              if (!regex.test(doc[key] || '')) return false
            } else {
              if (doc[key] !== filter[key]) return false
            }
          }
          return true
        })
      }
      return docs
    })
    return new MockQuery(p)
  }

  Model.findOne = function(filter = {}) {
    const p = Promise.resolve().then(() => {
      const db = readJsonDb()
      const docs = db[collectionKey] || []
      const found = docs.find(doc => {
        for (const key in filter) {
          if (doc[key] !== filter[key]) return false
        }
        return true
      })
      return found || null
    })
    return new MockQuery(p)
  }

  Model.findById = function(id) {
    const p = Promise.resolve().then(() => {
      const db = readJsonDb()
      const docs = db[collectionKey] || []
      const found = docs.find(doc => doc._id === id || doc.id === id || doc._id?.toString() === id?.toString())
      return found || null
    })
    return new MockQuery(p)
  }

  Model.findByIdAndUpdate = function(id, update, options = {}) {
    const p = Promise.resolve().then(() => {
      const db = readJsonDb()
      const docs = db[collectionKey] || []
      const index = docs.findIndex(doc => doc._id === id || doc.id === id || doc._id?.toString() === id?.toString())
      if (index === -1) return null
      
      const existing = docs[index]
      let updated = { ...existing }
      const changes = update.$set || update
      for (const key in changes) {
        updated[key] = changes[key]
      }
      
      docs[index] = updated
      db[collectionKey] = docs
      writeJsonDb(db)
      return updated
    })
    return new MockQuery(p)
  }

  Model.findByIdAndDelete = function(id) {
    const p = Promise.resolve().then(() => {
      const db = readJsonDb()
      const docs = db[collectionKey] || []
      const index = docs.findIndex(doc => doc._id === id || doc.id === id || doc._id?.toString() === id?.toString())
      if (index === -1) return null
      const deleted = docs.splice(index, 1)[0]
      db[collectionKey] = docs
      writeJsonDb(db)
      return deleted
    })
    return new MockQuery(p)
  }

  Model.deleteMany = function(filter = {}) {
    const p = Promise.resolve().then(() => {
      const db = readJsonDb()
      db[collectionKey] = []
      writeJsonDb(db)
      return { deletedCount: 0 }
    })
    return new MockQuery(p)
  }

  Model.insertMany = function(arr) {
    const p = Promise.resolve().then(() => {
      const db = readJsonDb()
      const docs = db[collectionKey] || []
      const toInsert = arr.map(item => {
        return {
          _id: item._id || new mongoose.Types.ObjectId().toString(),
          ...item,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      })
      db[collectionKey] = [...docs, ...toInsert]
      writeJsonDb(db)
      return toInsert
    })
    return new MockQuery(p)
  }

  Model.prototype.save = function() {
    return Promise.resolve().then(() => {
      const db = readJsonDb()
      const docs = db[collectionKey] || []
      const id = this._id || this.id || new mongoose.Types.ObjectId().toString()
      this._id = id
      
      const index = docs.findIndex(doc => doc._id === id || doc.id === id || doc._id?.toString() === id?.toString())
      const docData = { ...this._doc }
      if (!docData._id) docData._id = id
      docData.createdAt = docData.createdAt || new Date().toISOString()
      docData.updatedAt = new Date().toISOString()
      
      if (index === -1) {
        docs.push(docData)
      } else {
        docs[index] = docData
      }
      
      db[collectionKey] = docs
      writeJsonDb(db)
      
      this._doc = docData
      Object.assign(this, docData)
      return this
    })
  }
}

// Hook mongoose.model to auto-mock when in mock mode
const originalModel = mongoose.model
mongoose.model = function(name, schema) {
  const Model = originalModel.apply(this, arguments)
  if (isMockMode) {
    mockModel(Model)
  }
  return Model
}

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/eventify'
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 2000,
    })
    console.log('MongoDB connected')
  } catch (err) {
    console.warn('MongoDB connection failed. Switching to JSON File DB mode...')
    isMockMode = true
    for (const modelName of mongoose.modelNames()) {
      mockModel(mongoose.model(modelName))
    }
  }
}

module.exports = connectDB
