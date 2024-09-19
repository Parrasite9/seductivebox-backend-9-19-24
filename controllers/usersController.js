const pool = require('../config/db');

// Create User and store questionnaire responses
const createUser = async (req, res) => {
    const { email, questionnaireData, cartData } = req.body;

    try {
        // Insert user data
        const userResult = await pool.query(
            'INSERT INTO Users (email) VALUES ($1) RETURNING id', [email]
        );

        const userId = userResult.rows[0].id;

        // Store user questionnaire responses in UserResponses
        await pool.query(
            'INSERT INTO UserResponses (user_id, responses) VALUES ($1, $2)',
            [userId, questionnaireData]
        );

        // Store cart data
        await pool.query(
            'INSERT INTO AbandonedCarts (user_id, cart_data) VALUES ($1, $2)',
            [userId, cartData]
        );

        res.status(201).json({ message: 'User created and data saved' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Recover abandoned cart
const recoverCart = async (req, res) => {
    const { email } = req.params;

    try {
        const cartResult = await pool.query(
            'SELECT cart_data FROM AbandonedCarts WHERE email = $1', [email]
        );

        if (cartResult.rows.length === 0) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json(cartResult.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { createUser, recoverCart };
