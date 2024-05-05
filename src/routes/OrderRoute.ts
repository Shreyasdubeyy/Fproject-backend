import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import OrderController from "../controllers/OrderController";

const router = express.Router();

// order details
router.get("/", jwtCheck, jwtParse, OrderController.getMyOrders);

// post since we are creatng a session
router.post(
  "/checkout/create-checkout-session",
  jwtCheck,
  jwtParse,
  OrderController.createCheckoutSession
);

//endpoint for webhook
router.post("/checkout/webhook", OrderController.stripeWebhookHandler);

export default router;