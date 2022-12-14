const router = require('express').Router();
const itemQueries = require("../db/queries/orders");

router.put("/", (req, res) => {
  itemQueries.emptyCart(req.body.orderId)
  .then(() => {
    return res.json('Successfully changed order status to false')
  })
  .catch((err) => {
    res.status(500).json({ error: err.message });
  })
});

module.exports = router;