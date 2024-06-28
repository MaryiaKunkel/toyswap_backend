// likedListing.test.js
const LikedListing = require("../models/likedListing");
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
        id: 1,
        title: "Listing1",
        description: "Description1",
        image_url: "http://listing1.img",
        available: true,
        shared_by_username: "u1",
        address_id: 1,
        state: "CA",
        city: "San Francisco",
      },
    ]);
  });

  test("getLikedListing", async () => {
    const likedListing = await LikedListing.getLikedListing(1);
    expect(likedListing).toEqual({
      listing_id: 1,
      username: "u1",
      id: 1,
      title: "Listing1",
      description: "Description1",
      image_url: "http://listing1.img",
      available: true,
      shared_by_username: "u1",
      address_id: 1,
      state: "CA",
      city: "San Francisco",
    });
  });

  test("addLikedListing", async () => {
    const likedListing = await LikedListing.addLikedListing("u1", 2);
    expect(likedListing).toEqual({
      username: "u1",
      listing_id: 2,
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
