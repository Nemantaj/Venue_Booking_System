const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reserveSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    bookedSeats: [{ type: Number }],
    venueId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Venues"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reserve", reserveSchema);
