const Listing = require("../models/listing.model.js");
const { listingSchema } = require("../schema.js");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAPBOX_KEY;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  let allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
};

module.exports.newListing = async (req, res) => {
  // let result = listingSchema.validate(req.body);
  // console.log(result);

  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.location,
      limit: 1,
    })
    .send();
  let geometryLocation = response.body.features[0].geometry
  console.log(geometryLocation)

  let url = req.file.path;
  let filename = req.file.filename;

  let { title, image, description, price, location, country } = req.body;
  let listing = await Listing.insertOne({
    title,
    description,
    image,
    price,
    location,
    country,
  });
  listing.owner = req.user._id;
  listing.image = { url, filename };
  listing.geometry = geometryLocation;
  let savedListing = await listing.save();
  console.log(savedListing);
  req.flash("success", "New listing added!");
  console.log("added new listing !");
  res.redirect("/listing");
};

module.exports.addListing = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.getListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("geometry")
    .populate("owner");
  if (!listing) {
    req.flash("error", "listing doesn't exixts!");
  }
  // let coordinates = listing.geometry.coordinates;
  console.log(listing)
  res.render("listings/show.ejs", { listing });
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "listing doesn't exixts!");
    res.redirect("/listing");
  }
  let orginalImage = listing.image.url;
  orginalImage = orginalImage.replace("/upload", "/upload/h_100,w_150");
  res.render("listings/edit.ejs", { listing, orginalImage });
};

module.exports.updateListing = async (req, res) => {
  let { title, image, description, price, location, country } = req.body;
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(
    id,
    {
      title,
      description,
      image,
      price,
      location,
      country,
    },
    { new: true }
  );
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "listing updated!");
  res.redirect(`/listing/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "listing deleted!");
  res.redirect("/listing");
};
