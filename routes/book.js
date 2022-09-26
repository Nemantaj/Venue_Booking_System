const express = require("express");
const bookController = require("../controller/book.controller");

const router = express.Router();

router.get("/create-venue/:userId", bookController.createVenue);
router.get("/get-venues", bookController.getVenues);
router.get("/get-venue/:venueId", bookController.getVenue);
router.get("/get-recipts/:userId", bookController.getRecipts);
router.post("/book-seats/:userId", bookController.bookSeats);

module.exports = router;
