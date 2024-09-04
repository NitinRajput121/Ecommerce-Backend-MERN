import express from 'express';
import { allCoupons, applyDsicount, deleteCoupon, newcode } from '../controllers/payment.js';
const app = express.Router();
app.post('/coupon/new', newcode);
app.get('/discount', applyDsicount);
app.get('/coupon/all', allCoupons);
app.delete('/coupon/:id', deleteCoupon);
export default app;
