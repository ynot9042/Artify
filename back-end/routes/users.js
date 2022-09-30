// Example file to see how to get users from DB 


const express = require("express");
const router = express.Router();
const itemQueries = require("../db/queries/users");

router.get("/", (req, res) => {
  itemQueries.getArtByUser(2)
  .then((users) => {
    return res.json(users)
  })
  .catch((err) => {
    res.status(500).json({ error: err.message });
  })
});


module.exports = router;