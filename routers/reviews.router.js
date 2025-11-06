const express = require("express");
let router = express.Router({ mergeParams: true });
const asyncHandler = require("../utils/asyncHandler.js");

const {
  isLoggedIn,
  isReviewAuthor,
  validateReview
} = require("../middleware/auth.middleware.js");
const reviewControllers = require("../controllers/review.controller.js")

router.post(
  "/",
  isLoggedIn,
  asyncHandler(reviewControllers.addReview)
);
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, reviewControllers.deleteReview);

module.exports = router;
