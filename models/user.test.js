const db = require("../db.js");
const User = require("./user.js");
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

describe("User Model", () => {
  test("authenticate", async () => {
    const user = await User.authenticate("u1", "password1");
    expect(user).toEqual({
      username: "u1",
      firstName: "First1",
      lastName: "Last1",
      email: "user1@example.com",
    });
  });

  test("register", async () => {
    const user = await User.register({
      username: "newUser",
      password: "password",
      firstName: "New",
      lastName: "User",
      email: "newuser@example.com",
    });
    const found = await db.query(
      "SELECT * FROM users WHERE username = 'newUser'"
    );
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].username).toEqual("newUser");
  });

  test("findAll", async () => {
    const users = await User.findAll();
    expect(users.length).toEqual(2);
  });

  test("get", async () => {
    const user = await User.get("u1");
    expect(user).toEqual({
      username: "u1",
      firstName: "First1",
      lastName: "Last1",
      email: "user1@example.com",
      listings: expect.any(Array),
      liked_listings: expect.any(Array),
    });
  });

  test("update", async () => {
    const updatedUser = await User.update("u1", { firstName: "Updated" });
    expect(updatedUser.firstName).toEqual("Updated");
  });

  test("remove", async () => {
    await User.remove("u1");
    const res = await db.query("SELECT * FROM users WHERE username = 'u1'");
    expect(res.rows.length).toEqual(0);
  });
});
