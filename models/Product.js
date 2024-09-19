const pool = require('../config/db');

// Product model
const Product = {
    create: async (data) => {
        const query = `
            INSERT INTO products (sku, name, color, intl_size, size_display, category, price, weight, default_image_url, material, including, package_type, content, product_url, is_plus_size, sku_base, description)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
            RETURNING *`;
        const values = [data.sku, data.name, data.color, data.intl_size, data.size_display, data.category, data.price, data.weight, data.default_image_url, data.material, data.including, data.package_type, data.content, data.product_url, data.is_plus_size, data.sku_base, data.description];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
};

module.exports = Product;
