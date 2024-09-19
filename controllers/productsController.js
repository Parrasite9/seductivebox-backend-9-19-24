const fastcsv = require('fast-csv');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const pool = require('../config/db'); // Pool for PostgreSQL connection
const ProductVariation = require('../models/ProductVariation');

exports.importProducts = (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).send('No files were uploaded.');
    }

    const file = req.files.file;
    const filepath = path.join(__dirname, '../uploads/', file.name);

    // Move the file to the uploads directory
    file.mv(filepath, (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        const stream = fs.createReadStream(filepath);
        const products = [];

        const csvStream = fastcsv
            .parse({ headers: true })
            .on('data', async (data) => {
                // Parse HTML content to extract image URLs
                const $ = cheerio.load(data['Content']);
                const imageUrls = [];
                
                $('img').each((index, img) => {
                    const url = $(img).attr('src');
                    if (url) {
                        imageUrls.push(url);
                    }
                });

                const productData = {
                    sku: data['SKU'],
                    name: data['Name'],
                    color: data['Color'],
                    intl_size: data['INTL Size'],
                    category: data['categories'],
                    price: parseFloat(data['Price($)']),
                    default_image_url: data['DefaultPicUrl'],
                    material: data['Materials'],
                    including: data['Including'],
                    package_type: data['Package_Type'],
                    content: [data[11]],
                    product_url: data['Product_Url']
                };

                products.push(productData);

                try {
                    // Insert each product into the database
                    const query = `
                        INSERT INTO products 
                        (sku, name, color, intl_size, category, price, default_image_url, material, including, package_type, content, product_url) 
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                        RETURNING *`;

                    const values = [
                        productData.sku,
                        productData.name,
                        productData.color,
                        productData.intl_size,
                        productData.category,
                        productData.price,
                        productData.default_image_url,
                        productData.material,
                        productData.including,
                        productData.package_type,
                        productData.content,
                        productData.product_url
                    ];

                    await pool.query(query, values);
                } catch (error) {
                    console.error('Error inserting product:', error.message);
                }
            })
            .on('end', () => {
                res.status(200).send('Products imported successfully!');
            });

        stream.pipe(csvStream);
    });
};
