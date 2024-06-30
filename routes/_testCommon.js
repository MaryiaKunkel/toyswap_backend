"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Listing = require("../models/listing");
const LikedListing = require("../models/likedListing");
const { createToken } = require("../helpers/tokens");

async function commonBeforeAll() {
  // Clear the tables
  await db.query("DELETE FROM review");
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM address");
  await db.query("DELETE FROM listing");
  await db.query("DELETE FROM liked_listing");

  await User.register({
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
  });

  await User.register({
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
  });

  const listing1 = await Listing.create({
    title: "Listing1",
    description: "Description1",
    image_url: "http://listing1.img",
    available: true,
    shared_by_username: "u1",
    state: "CA",
    city: "San Francisco",
  });

  const listing2 = await Listing.create({
    title: "Listing2",
    description: "Description2",
    image_url: "http://listing2.img",
    available: true,
    shared_by_username: "u2",
    state: "NY",
    city: "New York",
  });

  await LikedListing.addLikedListing("u1", listing1.id);
  await LikedListing.addLikedListing("u2", listing2.id);
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

const u1Token = createToken({ username: "u1" });
const u2Token = createToken({ username: "u2" });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
};
