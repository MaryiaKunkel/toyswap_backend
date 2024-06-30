"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for listings. */

class Listing {
  /** Create a listing (from data), update db, return new listing data.
   *
   * data should be { title, description,  image_url, available, shared_by_username }
   *
   * Returns { title, description, image_url, available, shared_by_username }
   **/

  static async create(data) {
    // Insert the address first
    const addresses = await db.query(`SELECT * FROM address`);

    const addressResult = await db.query(
      `INSERT INTO address (state, city)
      VALUES ($1, $2)
      RETURNING id`,
      [data.state, data.city]
    );

    const addressId = addressResult.rows[0].id;

    // Insert the listing with the address_id
    const result = await db.query(
      `INSERT INTO listing (title,
                             description,
                             image_url,
                             shared_by_username,
                             address_id)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, title, description, image_url, shared_by_username, address_id`,
      [
        data.title,
        data.description,
        data.image_url,
        data.shared_by_username,
        addressId,
      ]
    );
    let listing = result.rows[0];
    console.log("Inserted listing in DB: ", listing);

    return listing;
  }

  /** Find all listings (optional filter on searchFilters).
   *
   * searchFilters (all optional):
   * - address
   * - title (will find case-insensitive, partial matches)
   *
   * Returns [{ id, title, description, image_url, available, shared_by_username }, ...]
   * */

  static async findAll({ title } = {}) {
    const result = await db.query(
      `SELECT listing.id,
              listing.title,
              listing.description,
              listing.image_url,
              listing.available,
              listing.shared_by_username,
              listing.address_id,
              address.state,
              address.city
       FROM listing
       JOIN address ON listing.address_id = address.id`
    );
    return result.rows;
  }

  /** Given a listing id, return data about listing.
   *
   * Returns { id, title, description, image_url, available, shared_by_username, address }
   *   where address is { state, city }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const listingRes = await db.query(
      `SELECT id,
              title,
              description,
              image_url,
              available,
              shared_by_username,
              address_id
           FROM listing
           WHERE id = $1`,
      [id]
    );

    const listing = listingRes.rows[0];

    if (!listing) throw new NotFoundError(`No listing: ${id}`);

    const addressRes = await db.query(
      `SELECT id,
              state,
              city
           FROM address
           WHERE id = $1`,
      [listing.address_id]
    );

    delete listing.address_id;
    listing.address = addressRes.rows[0];

    return listing;
  }

  /** Update listing data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include: { title, description, image_url, available address }
   *
   * Returns { id, title, description, image_url, available, shared_by_username, address_id}
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE listing 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id,
                                title,
                                description,
                                image_url,
                                available,
                                shared_by_username,
                                address_id`;
    const result = await db.query(querySql, [...values, id]);
    const listing = result.rows[0];

    if (!listing) throw new NotFoundError(`No listing: ${id}`);

    return listing;
  }

  /** Delete given listing from database; returns undefined.
   *
   * Throws NotFoundError if listing not found.
   **/

  static async remove(id) {
    const result = await db.query(
      `DELETE
           FROM listing
           WHERE id = $1
           RETURNING id`,
      [id]
    );
    const listing = result.rows[0];

    if (!listing) throw new NotFoundError(`No listing: ${id}`);
  }
}

module.exports = Listing;
