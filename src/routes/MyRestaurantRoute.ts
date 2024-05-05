import express from "express";
import multer from "multer";
import MyRestaurantController from "../controllers/MyRestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyRestaurantRequest } from "../middleware/validation";

const router =express.Router();

// multer(package) controller
const storage = multer.memoryStorage();
const upload =multer({
    storage: storage,
    limits: {
        fileSize: 5* 1024*1024 //5mb (for readability,5 x 1mb)
    },
});

router.get(
  "/order",
  jwtCheck,
  jwtParse,
  MyRestaurantController.getMyRestaurantOrders
);



//GET/api/myrestaurant
router.get(
    "/",
    jwtCheck,
    jwtParse,
    MyRestaurantController.getMyRestaurant
  );
  // patch just updates 1 enitity
  router.patch(
    "/order/:orderId/status",
    jwtCheck,
    jwtParse,
    MyRestaurantController.updateOrderStatus
  );

// /api/my/restaurant createmyrestaurant endpoint
router.post("/", upload.single("imageFile") ,validateMyRestaurantRequest , jwtCheck , jwtParse ,MyRestaurantController.createMyRestaurant);

//put /api/myrestaurant (update)
router.put(
    "/",
    upload.single("imageFile"),
    validateMyRestaurantRequest,
    jwtCheck,
    jwtParse,
    MyRestaurantController.updateMyRestaurant
  );

export default router;