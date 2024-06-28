const db = require("../db");

class LikedListing {
  static async findAll(username) {
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
     FROM liked_listing
     JOIN listing ON liked_listing.listing_id = listing.id
     JOIN address ON listing.address_id = address.id
     WHERE liked_listing.username=$1`,
      [username]
    );
    return result.rows;
  }

  static async getLikedListing(listingId) {
    const result = await db.query(
      `SELECT liked_listing.listing_id,
              liked_listing.username,
              listing.id,
            listing.title,
            listing.description,
            listing.image_url,
            listing.available,
            listing.shared_by_username,
            listing.address_id,
            address.state,
            address.city
      FROM liked_listing
      JOIN listing ON liked_listing.listing_id = listing.id
     JOIN address ON listing.address_id = address.id
      WHERE liked_listing.id=$1`,
      [listingId]
    );
    return result.rows[0];
  }

  static async addLikedListing(username, listingId) {
    const result = await db.query(
      `INSERT INTO liked_listing (username, listing_id)
       VALUES ($1, $2)
       RETURNING username, listing_id`,
      [username, listingId]
    );
    return result.rows[0];
  }

  static async removeLikedListing(username, listingId) {
    await db.query(
      `DELETE FROM liked_listing
       WHERE username = $1 AND listing_id = $2`,
      [username, listingId]
    );
  }
}

module.exports = LikedListing;
