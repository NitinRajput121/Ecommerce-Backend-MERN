import express from "express";
import { deleteUser, getAllUser, getUser, newUser } from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";
const app = express.Router();
// /api/user/v1/new   POST
app.post('/new', newUser);
app.get('/all', adminOnly, getAllUser);
app.get('/:id', getUser);
app.delete('/:id', adminOnly, deleteUser);
export default app;
