// listing.test.js
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

describe("Listing Model", () => {
  let listingId;
  test("create", async () => {
    const listing = await Listing.create({
      title: "Listing3",
      description: "Description3",
      image_url: "http://listing3.img",
      shared_by_username: "u1",
      state: "TX",
      city: "Austin",
    });
    listingId = listing.id;

    expect(listing).toEqual({
      id: listingId,
      title: "Listing3",
      description: "Description3",
      image_url: "http://listing3.img",
      shared_by_username: "u1",
      address_id: expect.any(Number),
    });
  });

  test("findAll", async () => {
    const listings = await Listing.findAll();
    expect(listings.length).toBeGreaterThanOrEqual(1);
  });

  test("get", async () => {
    const listing = await Listing.get(listingId - 1);
    expect(listing).toEqual({
      id: listingId - 1,
      title: "Listing1",
      description: "Description1",
      image_url: "http://listing1.img",
      available: true,
      shared_by_username: "u1",
      address: {
        id: expect.any(Number),
        state: "CA",
        city: "Los Angeles",
      },
    });
  });

  test("update", async () => {
    const listing = await Listing.update(listingId - 1, { title: "NewTitle1" });
    expect(listing.title).toBe("NewTitle1");
  });

  test("remove", async () => {
    await Listing.remove(listingId - 1);
    const res = await db.query(`SELECT * FROM listing WHERE id=$1`, [
      listingId,
    ]);
    expect(res.rows.length).toBe(0);
  });
});
