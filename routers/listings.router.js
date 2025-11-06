const express = require("express");
let router = express.Router({ mergeParams: true });
const asyncHandler = require("../utils/asyncHandler.js");
const {
  isLoggedIn,
  isOwner,
  validateListing,
} = require("../middleware/auth.middleware.js");
const listingControllers = require("../controllers/listing.controller.js")
let multer = require("multer")
let {storage} = require("../cloudconfig.js")
let upload = multer({storage})

router.get("/", asyncHandler(listingControllers.index));
router.post("/new",upload.single("image"), asyncHandler(listingControllers.newListing));
router.get("/add", isLoggedIn, listingControllers.addListing);

router.get("/:id", asyncHandler(listingControllers.getListing));
router.get(
  "/edit/:id",
  isLoggedIn,
  isOwner,
  asyncHandler(listingControllers.editListing)
);
router.put(
  "/update/:id",
  isLoggedIn,
  isOwner,
  upload.single("image"),
  asyncHandler(listingControllers.updateListing)
);
router.delete(
  "/delete/:id",
  isLoggedIn,
  isOwner,
  asyncHandler(listingControllers.deleteListing)
);

module.exports = router;
