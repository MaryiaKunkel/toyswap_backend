"use strict";

/** Routes for reviews. */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const {
  ensureLoggedIn,
  ensureCorrectUser,
  authenticateJWT,
} = require("../middleware/auth");
const Review = require("../models/review");

const router = express.Router({ mergeParams: true });

/** POST / { review } => { review }
 *
 * review should be { reviewer_username, reviewed_username,review_text, review_date}
 *
 * Returns { id, reviewer_username, reviewed_username, review_text, review_date }
 *
 * Authorization required: log in
 */

router.post("/new", async function (req, res, next) {
  try {
    //   const validator = jsonschema.validate(req.body, reviewNewSchema);
    //   if (!validator.valid) {
    //     const errs = validator.errors.map((e) => e.stack);
    //     throw new BadRequestError(errs);
    //   }
    const reviewer_username = res.locals.user.username;
    const reviewData = { ...req.body, reviewer_username };
    const review = await Review.create(reviewData);
    return res.status(201).json({ review });
  } catch (err) {
    return next(err);
  }
});

/** GET / =>
 *   { reviews: [ { id, reviewer_username, reviewed_username, review_text, review_date}, ...] }
 *
 * Authorization required: lig in
 */

router.get("/users/:username", async function (req, res, next) {
  try {
    const reviews = await Review.findAll();
    return res.json({ reviews });
  } catch (err) {
    return next(err);
  }
});

/** GET /[listingId] => { listing }
 *
 * Returns { id, title, description, image_url, available, shared_by_username, address }
 *   where address is { state, city }
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  try {
    const listing = await Listing.get(req.params.id);
    return res.json({ listing });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[listingId]  { fld1, fld2, ... } => { listing }
 *
 * Data can include: { title, description, image_url, available address }
 *
 * Returns { id, title, description, image_url, available, shared_by_username, address_id}
 *
 * Authorization required: correct user
 */

router.patch("/:id", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, listingUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const listing = await Listing.update(req.params.id, req.body);
    return res.json({ listing });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: correct user
 */

router.delete("/:id", async function (req, res, next) {
  try {
    await Listing.remove(req.params.id);
    return res.json({ deleted: +req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
