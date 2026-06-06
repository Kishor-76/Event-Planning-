require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const connectDB = require('./src/config/db')

const eventsRoute = require('./src/routes/events')
const bookingsRoute = require('./src/routes/bookings')
const authRoute = require('./src/routes/auth')

const app = express()

// connect DB
connectDB()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.use('/api/events', eventsRoute)
app.use('/api/bookings', bookingsRoute)
app.use('/api/auth', authRoute)

app.get('/', (req, res) => res.send({ ok: true, message: 'Eventify API' }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
