const express = require("express");
const router = new express.Router();
const { ensureLoggedIn } = require("../middleware/auth");
const LikedListing = require("../models/likedListing");

router.get("/", async (req, res, next) => {
  try {
    const { username } = req.params;
    const likedListings = await LikedListing.findAll(username);
    return res.status(200).json({ likedListings });
  } catch (err) {
    return next(err);
  }
});

router.get("/:listingId", async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const likedListings = await LikedListing.getLikedListing(listingId);
    return res.status(200).json({ likedListings });
  } catch (err) {
    return next(err);
  }
});

router.post("/:listingId", async (req, res, next) => {
  try {
    const username = res.locals.user.username;
    const { listingId } = req.params;
    await LikedListing.addLikedListing(username, listingId);
    return res.status(201).json({ message: "Listing added to favorites" });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:listingId", async (req, res, next) => {
  try {
    const username = res.locals.user.username;
    const { listingId } = req.params;
    await LikedListing.removeLikedListing(username, listingId);
    return res.status(200).json({ message: "Listing removed from favorites" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
