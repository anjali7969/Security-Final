const express = require("express");
const router = express.Router();

// ✅ Handle Payment Checkout (Redirect to Payment Gateway)
router.get("/checkout/:orderId", async (req, res) => {
    const { orderId } = req.params;

    // Simulated Payment Page (Redirect to External Gateway if Needed)
    return res.status(200).json({
        message: "Redirect to payment gateway",
        paymentUrl: `http://localhost:5173/payment-success/${orderId}` // Redirect to frontend confirmation
    });
});

module.exports = router;
// ✅ Created a new route to handle payment checkout and redirect to the payment gateway.