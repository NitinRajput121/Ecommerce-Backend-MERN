import express from 'express'
import { allOrders, deleteOrder, getSingleOrder, myOrders, newOrder, processOrder } from '../controllers/order.js'

const app = express.Router()


app.post('/new',newOrder)

app.get('/my',myOrders)

app.get('/all',allOrders)

app.route('/:id').get(getSingleOrder).put(processOrder).delete(deleteOrder)



export default app