// likedListing.test.js
const LikedListing = require("../models/likedListing");
const Listing = require("../models/listing");

const db = require("../db");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("LikedListing Model", () => {
  test("findAll", async () => {
    const likedListings = await LikedListing.findAll("u1");
    expect(likedListings).toEqual([
      {
        id: expect.any(Number),
        title: "Listing1",
        description: "Description1",
        image_url: "http://listing1.img",
        available: true,
        shared_by_username: "u1",
        address_id: 1,
        state: "CA",
        city: "Los Angeles",
      },
    ]);
  });

  test("getLikedListing", async () => {
    const listing = await Listing.create({
      title: "Listing3",
      description: "Description3",
      image_url: "http://listing3.img",
      shared_by_username: "u1",
      state: "TX",
      city: "Austin",
    });

    const listingId = listing.id;
    const username = listing.shared_by_username;

    const addedListing = await LikedListing.addLikedListing(
      username,
      listingId
    );

    const likedListing = await LikedListing.getLikedListing(listingId);

    expect(likedListing).toEqual({
      id: expect.any(Number),
      listing_id: listingId,
      username: "u1",
      title: "Listing3",
      description: "Description3",
      image_url: "http://listing3.img",
      available: true,
      shared_by_username: "u1",
      address_id: expect.any(Number),
      state: "TX",
      city: "Austin",
    });
  });

  test("addLikedListing", async () => {
    const listing = await Listing.create({
      title: "Listing3",
      description: "Description3",
      image_url: "http://listing3.img",
      shared_by_username: "u1",
      state: "TX",
      city: "Austin",
    });

    const listingId = listing.id;
    const likedListing = await LikedListing.addLikedListing("u1", listingId);
    expect(likedListing).toEqual({
      username: "u1",
      listing_id: expect.any(Number),
    });
  });

  test("removeLikedListing", async () => {
    await LikedListing.removeLikedListing("u1", 1);
    const res = await db.query(
      "SELECT * FROM liked_listing WHERE username='u1' AND listing_id=1"
    );
    expect(res.rows.length).toBe(0);
  });
});
