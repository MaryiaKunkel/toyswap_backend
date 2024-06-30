"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for reviews. */

class Review {
  /** Create a review (from data), update db, return new review data.
   *
   * data should be { reviewer_username, reviewed_username, review_text, review_date }
   *
   * Returns { reviewer_username, reviewed_username, review_text, review_date }
   **/

  static async create(data) {
    // Insert the review
    const result = await db.query(
      `INSERT INTO review (reviewer_username,
                             reviewed_username,
                             review_text,
                             review_date)
           VALUES ($1, $2, $3, $4)
           RETURNING id, reviewer_username,
                      reviewed_username,
                      review_text,
                      review_date`,
      [
        data.reviewer_username,
        data.reviewed_username,
        data.review_text,
        data.review_date,
      ]
    );
    let review = result.rows[0];
    review.review_date = review.review_date.toISOString().split("T")[0];

    console.log("Inserted review in DB: ", review);

    return review;
  }

  /** Find all reviews.
   *
   * Returns [{ id, reviewer_username, reviewed_username, review_text, review_date }, ...]
   * */

  static async findAll() {
    const result = await db.query(
      `SELECT review.id,
              review.reviewer_username,
              review.reviewed_username,
              review.review_text,
              review.review_date
       FROM review`
    );
    return result.rows;
  }

  /** Given a review id, return data about review.
   *
   * Returns { id, reviewer_username, reviewed_username, review_text, review_date  }
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const result = await db.query(
      `SELECT id, reviewer_username, reviewed_username, review_text, review_date 
           FROM review
           WHERE id = $1`,
      [id]
    );
    console.log(result);
    let review = result.rows[0];
    console.log(review);
    review.review_date = review.review_date.toISOString().split("T")[0];
    return result.rows;
  }
}

module.exports = Review;
