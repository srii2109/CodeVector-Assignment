const pool = require("../db");

const categories = [
  "Electronics",
  "Fashion",
  "Books",
  "Sports",
  "Furniture"
];

async function seedProducts() {

  try {

    const batchSize = 5000;
    const totalRecords = 200000;

    console.log("Starting seed...");

    for (let i = 0; i < totalRecords; i += batchSize) {

      const values = [];
      const placeholders = [];

      let paramCount = 1;

      for (let j = 0; j < batchSize; j++) {

        const productNumber = i + j;

        const name = `Product-${productNumber}`;

        const category =
          categories[
            Math.floor(
              Math.random() * categories.length
            )
          ];

        const price =
          (Math.random() * 10000).toFixed(2);

        const createdAt = new Date(
          Date.now() -
          Math.floor(Math.random() * 365) *
          24 * 60 * 60 * 1000
        );

        const updatedAt = new Date(
          createdAt.getTime() +
          Math.floor(Math.random() * 100000000)
        );

        values.push(
          name,
          category,
          price,
          createdAt,
          updatedAt
        );

        placeholders.push(
          `($${paramCount++},$${paramCount++},$${paramCount++},$${paramCount++},$${paramCount++})`
        );
      }

      await pool.query(
        `
        INSERT INTO products
        (name, category, price, created_at, updated_at)
        VALUES
        ${placeholders.join(",")}
        `,
        values
      );

      console.log(
        `${Math.min(i + batchSize, totalRecords)} inserted`
      );
    }

    console.log("Seeding completed");

    process.exit();

  } catch (error) {

    console.error(error);

    process.exit(1);
  }
}

seedProducts();