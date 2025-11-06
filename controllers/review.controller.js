const Listing = require("../models/listing.model.js");
const Review = require("../models/review.model.js");
const { reviewSchema } = require("../schema.js");


module.exports.addReview = async (req, res) => {
  let result = reviewSchema.validate(req.body);
  console.log(result);
  let { id } = req.params;
  let newListing = await Listing.findById(id);
  let { rating, comment } = req.body;
  let newReview = new Review({
    rating: rating,
    comments: comment,
  });
  newReview.author = req.user._id;
  newListing.reviews.push(newReview);
  await newReview.save();
  await newListing.save();
  req.flash("success", "review added!");
  console.log("new review added!");
  res.redirect(`/listing/${id}`);
};

module.exports.deleteReview =  async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "review deleted!");
  res.redirect(`/listing/${id}`);
}