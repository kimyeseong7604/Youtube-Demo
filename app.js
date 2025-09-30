const express = require('express')
const app = express()
app.use(express.json());

app.listen(7777)

const userRouter = require('./routes/users.js')
const channelRouter = require('./routes/channels')

app.use('/', userRouter)
app.use('/channels', channelRouter)