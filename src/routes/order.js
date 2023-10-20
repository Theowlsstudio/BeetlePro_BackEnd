import express from "express";
import driverApiGuard from '../middlewares/drivers/apiGuard.js';
import driverCancelOrder from '../controllers/order/driver/cancelOrder.js';
import customerapiGuard from "../middlewares/customers/apiGuard.js";
import customerCancelOrder from '../controllers/order/customers/cancelOrder.js';
import completeUserOrderById from "../controllers/order/customers/completeOrder.js";
import CreateOrder from "../controllers/order/customers/createOrder.js";
import getOrderById from "../controllers/order/getOrderById.js";
import getUserOrders from "../controllers/order/getUserOrders.js";
import acceptOrderById from "../controllers/order/driver/acceptOrderById.js";
import completeOrderById from "../controllers/order/driver/completeOrderById.js";
import getOrdersInProgress from "../controllers/order/customers/getOrdersInProgress.js";
import getDriverInProgressOrders from "../controllers/order/driver/getInProgressOrders.js";
import getOrdersCanceled from "../controllers/order/getOrdersCanceled.js";
import getOrdersCompleted from "../controllers/order/customers/getOrdersCompleteted.js";
import getDriverCompletedOrders from "../controllers/order/driver/getCompletedOrders.js";
import getNewOrders from "../controllers/order/driver/getNewOrders.js";
import pickedUpOrder from "../controllers/order/driver/pickedUpOrder.js";
import getOrderStatus from "../controllers/order/customers/getOrderStatus.js";
import getAllDrivers from "../controllers/order/getAllDrivers.js";
import scheduleOrder from "../controllers/order/customers/scheduleOrder.js";
import getDriverPendingOrders from "../controllers/order/driver/getPendingOrders.js";
import getCustomerPendingOrders from "../controllers/order/driver/getPendingOrders.js";
import getOrderByTrackingId from "../controllers/order/customers/getOrderByTrackingId.js";
import getDriverInfo from "../controllers/order/driver/getDriverInfo.js";
import getOrderDataByTrackingId from "../controllers/order/customers/getOrderDataByTrackingId.js";
import getCustomerInfo from "../controllers/order/customers/getCustomerInfo.js";

const router = express.Router();

router.get('/get-all-drivers', getAllDrivers); // get drivers list  done
router.get('/get-all-orders', customerapiGuard, getUserOrders);   // get user orders  done
router.get('/get/:id', customerapiGuard, getOrderById); //get order by id  done
// router.get('/get-canceled-customer-orders', customerapiGuard, getOrdersCanceled);  // get customer canceled orders
router.get('/get-completed-customer-orders', customerapiGuard, getOrdersCompleted); // get customer completed orders
router.post('/create', customerapiGuard, CreateOrder);  // create order  done
router.post('/schedule-order', customerapiGuard, scheduleOrder);
// router.post('/cancel-user-order', customerapiGuard, customerCancelOrder);  // cancel order
router.get('/get-order-status/:order_id', customerapiGuard, getOrderStatus);   // get order status  done
router.post('/complete-order-by-user', customerapiGuard, completeUserOrderById);  // complete order by user  done
router.get('/get-inprogress-customer-orders', customerapiGuard, getOrdersInProgress); // customer inprogress orders
router.get('/new-driver-orders', driverApiGuard, getNewOrders);  // new driver orders  done
router.post('/accept-order-by-rider', driverApiGuard, acceptOrderById); // accept order > driver  done
router.post('/picked-up-order-by-rider', driverApiGuard, pickedUpOrder); // pick up > driver  done
router.post('/driver-order-complete-api', driverApiGuard, completeOrderById); // deliver order > driver  done
router.post('/cancel-driver-order', driverApiGuard, driverCancelOrder); // cancel order > driver
// router.get('/get-driver-pending-orders', driverApiGuard, getDriverPendingOrders);
// router.get('/get-customer-pending-orders', customerapiGuard, getCustomerPendingOrders);
router.get('/get-order-by-tracking-id/:tracking_id', customerapiGuard, getOrderByTrackingId); // done
router.get('/get-order-data-by-tracking-id/:tracking_id', customerapiGuard, getOrderDataByTrackingId); // done
router.get('/get-driver-info/:id', getDriverInfo);  //done
router.get('/get-customer-info/:id', getCustomerInfo);  //done
router.get('/get-driver-completed-orders', driverApiGuard, getDriverCompletedOrders);
router.get('/get-driver-inprogress-orders', driverApiGuard, getDriverInProgressOrders);


export default router;