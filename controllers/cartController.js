const pool = require('../config/db');

const storeAbandonedCart = async (req, res) => {
    const { email, questionnaireData, cartData } = req.body;

    try {
        await pool.query(
            'INSERT INTO AbandonedCarts (email, questionnaire_data, cart_data) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET questionnaire_data = $2, cart_data = $3',
            [email, questionnaireData, cartData]
        );

        res.status(200).json({ message: 'Abandoned cart stored successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { storeAbandonedCart };
