"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for toy exchanges. */

class ToyExchange {
  /** Create a toy exchange (from data), update db, return new listing data.
   *
   * data should be { listing_id, shared_by_username, shared_to_username, exchange_date }
   *
   * Returns { id, listing_id, shared_by_username, shared_to_username, exchange_date }
   **/

  static async create(data) {
    // Insert the listing with the address_id
    const result = await db.query(
      `INSERT INTO toy_exchange (listing_id,
                                shared_by_username,
                                shared_to_username,
                                exchange_date)
           VALUES ($1, $2, $3, $4)
           RETURNING id, listing_id, shared_by_username, shared_to_username, exchange_date`,
      [
        data.listing_id,
        data.shared_by_username,
        data.shared_to_username,
        data.exchange_date,
      ]
    );
    let toyExchange = result.rows[0];
    console.log("Inserted toy_exchange in DB: ", toyExchange);

    return toyExchange;
  }

  /** Given a current user username, return data about toy exchange.
   *
   * Returns { id, listing_id, shared_by_username, shared_to_username, exchange_date }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(currentUser) {
    console.log("we are in models");
    const toyExchangeRes = await db.query(
      `SELECT id,
              listing_id,
              shared_by_username,
              shared_to_username,
              exchange_date
           FROM toy_exchange
           WHERE shared_to_username = $1`,
      [currentUser]
    );
    const toyExchange = toyExchangeRes.rows;

    if (!toyExchange)
      throw new NotFoundError(`No toy exchanges: ${currentUser}`);
    return toyExchange;
  }
}

module.exports = ToyExchange;
