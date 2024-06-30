// review.test.js
const Review = require("../models/review");
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

describe("Review Model", () => {
  let reviewID;
  test("create", async () => {
    const review = await Review.create({
      reviewer_username: "u1",
      reviewed_username: "u2",
      review_text: "Excellent service!",
      review_date: "2024-06-10",
    });
    expect(review).toEqual({
      id: expect.any(Number),
      reviewer_username: "u1",
      reviewed_username: "u2",
      review_text: "Excellent service!",
      review_date: "2024-06-10",
    });
    reviewID = review.id;
    console.log("reviewID: ", reviewID);
  });

  test("findAll", async () => {
    const reviews = await Review.findAll();
    expect(reviews.length).toBeGreaterThanOrEqual(1);
  });

  test("get", async () => {
    const review = await Review.get(reviewID - 1);
    expect(review).toEqual([
      {
        id: reviewID - 1,
        reviewer_username: "u1",
        reviewed_username: "u2",
        review_text: "Great!",
        review_date: "2024-06-10",
      },
    ]);
  });
});
