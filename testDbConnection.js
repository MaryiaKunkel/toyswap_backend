const { Client } = require("pg");

const client = new Client({
  connectionString:
    "postgresql://maryiakunkel:newpassword@localhost:5432/toyswap_test",
});

client
  .connect()
  .then(() => {
    console.log("Connected to database");
    return client.query("SELECT 1");
  })
  .then((result) => {
    console.log("Query executed successfully", result.rows);
    return client.end();
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });
