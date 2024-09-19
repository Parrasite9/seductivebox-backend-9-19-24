const pool = require('../config/db');

// ProductVariation model
const ProductVariation = {
    create: async (data) => {
        const query = `
            INSERT INTO productvariations (product_id, sku_variant, color, intl_size, size_display, price, weight, materials, including, package_type, is_plus_size)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *`;
        const values = [data.product_id, data.sku_variant, data.color, data.intl_size, data.size_display, data.price, data.weight, data.materials, data.including, data.package_type, data.is_plus_size];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
};

module.exports = ProductVariation;
