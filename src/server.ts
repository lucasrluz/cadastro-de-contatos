import express from 'express'
import { userRoute } from './route/UserRoute'

const app = express()

app.use(express.json())
app.use(userRoute)

app.listen(3333)
