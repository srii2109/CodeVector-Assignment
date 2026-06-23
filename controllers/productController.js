const pool = require("../db");

const getProducts = async (req, res) => {
  try {

    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;

    const cursorTime = req.query.cursorTime;
    const cursorId = req.query.cursorId;

    let query = `
      SELECT *
      FROM products
    `;

    const values = [];
    const conditions = [];

    let index = 1;

    if (category) {
      conditions.push(`category = $${index++}`);
      values.push(category);
    }

    if (cursorTime && cursorId) {
      conditions.push(
        `(updated_at, id) < ($${index++}, $${index++})`
      );

      values.push(cursorTime);
      values.push(cursorId);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += `
      ORDER BY updated_at DESC, id DESC
      LIMIT $${index}
    `;

    values.push(limit);

    const result = await pool.query(query, values);

    let nextCursor = null;

    if (result.rows.length > 0) {
      const lastItem =
        result.rows[result.rows.length - 1];

      nextCursor = {
        updated_at: lastItem.updated_at,
        id: lastItem.id
      };
    }

    res.json({
      totalReturned: result.rows.length,
      nextCursor,
      products: result.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
};

module.exports = {
  getProducts
};