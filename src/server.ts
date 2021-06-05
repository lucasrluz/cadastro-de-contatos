import express from 'express'
import { userRoute } from './route/UserRoute'
import { contactRoute } from './route/contactRoute'

const app = express()

app.use(express.json())
app.use(userRoute)
app.use(contactRoute)

app.listen(3333)
