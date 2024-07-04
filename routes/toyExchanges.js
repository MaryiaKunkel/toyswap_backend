"use strict";

/** Routes for toy exchanges. */

const express = require("express");
const { BadRequestError } = require("../expressError");
const {
  ensureLoggedIn,
  ensureCorrectUser,
  authenticateJWT,
} = require("../middleware/auth");
const ToyExchange = require("../models/toyExchange");

const router = express.Router({ mergeParams: true });

/** POST / { toyExchange } => { toyExchange }
 *
 * toyExchange should be { listing_id, shared_by_username, shared_to_username, exchange_date }
 *
 * Returns { id, listing_id, shared_by_username, shared_to_username, exchange_date }
 *
 * Authorization required: log in
 */

router.post("/", async function (req, res, next) {
  console.log("were in the routes");
  try {
    console.log(res.locals);
    const toyExchangeData = { ...req.body };
    const toyExchange = await ToyExchange.create(toyExchangeData);
    return res.status(201).json({ toyExchange });
  } catch (err) {
    return next(err);
  }
});

/** GET / =>
 *   { listings: [ { id, title, description,  image_url, available, shared_by_username }, ...] }
 *
 * Can provide search filter in query:
 * - address
 * - title (will find case-insensitive, partial matches)

 * Authorization required: none
 */

router.get("/:currentUser", async function (req, res, next) {
  console.log("we are in routes");
  try {
    const toyExchanges = await ToyExchange.get(req.params.currentUser);
    return res.json({ toyExchanges });
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

// router.get("/:id", async function (req, res, next) {
//   try {
//     const listing = await Listing.get(req.params.id);
//     return res.json({ listing });
//   } catch (err) {
//     return next(err);
//   }
// });

/** PATCH /[listingId]  { fld1, fld2, ... } => { listing }
 *
 * Data can include: { title, description, image_url, available address }
 *
 * Returns { id, title, description, image_url, available, shared_by_username, address_id}
 *
 * Authorization required: correct user
 */

// router.patch("/:id", async function (req, res, next) {
//   try {
//     const validator = jsonschema.validate(req.body, listingUpdateSchema);
//     if (!validator.valid) {
//       const errs = validator.errors.map((e) => e.stack);
//       throw new BadRequestError(errs);
//     }

//     const listing = await Listing.update(req.params.id, req.body);
//     return res.json({ listing });
//   } catch (err) {
//     return next(err);
//   }
// });

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: correct user
 */

// router.delete("/:id", async function (req, res, next) {
//   try {
//     await Listing.remove(req.params.id);
//     return res.json({ deleted: +req.params.id });
//   } catch (err) {
//     return next(err);
//   }
// });

module.exports = router;
