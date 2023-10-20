import express from 'express';
import apiGuardCustomers from '../middlewares/customers/apiGuard.js';
import apiGuardDrivers from '../middlewares/drivers/apiGuard.js';
import createReviewCustomer from '../controllers/review/customer/createReview.js';
import createReviewDriver from '../controllers/review/driver/createReview.js';

const router = express.Router();

router.post('/customer-write-review', apiGuardCustomers, createReviewCustomer);
router.post('/driver-write-review', apiGuardDrivers, createReviewDriver);


export default router;