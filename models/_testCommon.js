// _testCommon.js
const bcrypt = require("bcrypt");

const db = require("../db");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
  console.log("Deleting liked_listing...");
  await db.query("DELETE FROM liked_listing");
  console.log("Deleting review...");
  await db.query("DELETE FROM review");
  console.log("Deleting listing...");
  await db.query("DELETE FROM listing");
  console.log("Deleting users...");
  await db.query("DELETE FROM users");

  await db.query(`
    INSERT INTO users (username, password, first_name, last_name, email)
    VALUES ('u1', 'password1', 'First1', 'Last1', 'user1@example.com'),
           ('u2', 'password2', 'First2', 'Last2', 'user2@example.com')`);

  await db.query(`
    INSERT INTO listing (title, description, image_url, shared_by_username, address_id)
    VALUES ('Listing1', 'Description1', 'http://listing1.img', 'u1', 1)`);

  await db.query(`
    INSERT INTO liked_listing (username, listing_id)
    VALUES ('u1', 1)`);

  await db.query(`
    INSERT INTO address (id, state, city)
    VALUES (1, 'CA', 'Los Angeles')`);

  await db.query(`
    INSERT INTO review (reviewer_username, reviewed_username, review_text, review_date)
    VALUES ('u1', 'u2', 'Great!', '2023-01-01')`);
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

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};
