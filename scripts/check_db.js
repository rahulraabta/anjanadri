const { neon } = require("@neondatabase/serverless");

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  const sql = neon(connectionString);

  try {
    const result = await sql`SELECT 1 AS ok`;
    console.log("Database connection successful:", result);
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
}

main();
