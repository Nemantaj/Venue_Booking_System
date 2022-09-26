const Venue = require("../model/Book");
const Reserve = require("../model/Reserve");

exports.createVenue = (req, res, next) => {
  const showNameReq = req.query.showname;
  const userId = req.params.userId;

  console.log(showNameReq);

  if (!showNameReq || !userId) {
    const error = new Error("Showname is required to create a venue.");
    error.title = "Error Occured";
    error.statusCode = 422;
    throw error;
  }

  const newShow = new Venue({
    showName: showNameReq,
    createdBy: userId,
  });

  return newShow
    .save()
    .then((result) => {
      if (!result) {
        const error = new Error(
          "An error occured while trying to create a venue."
        );
        error.title = "Error Occured";
        error.statusCode = 422;
        throw error;
      }

      res.status(200).json({ result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getVenues = (req, res, next) => {
  Venue.find()
    .then((result) => {
      if (!result) {
        const error = new Error(
          "An error occured while trying to retrieve venues."
        );
        error.title = "Error Occured";
        error.statusCode = 422;
        throw error;
      }

      res.status(200).json({ result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.bookSeats = (req, res, next) => {
  const userId = req.params.userId;
  const seats = req.body.seats;
  const venueId = req.body.venueId;

  console.log(seats);
  console.log(venueId);

  let venueCache;
  let recipt;

  if (!userId || !seats || !venueId) {
    const error = new Error("There was an error while sending data to server.");
    error.title = "Error Occured";
    error.statusCode = 422;
    throw error;
  }

  Venue.findOne({ _id: venueId })
    .then((venueData) => {
      if (!venueData) {
        const error = new Error(
          "There was an error while sending data to server."
        );
        error.title = "Error Occured";
        error.statusCode = 422;
        throw error;
      }

      let seatsList = [...venueData.seats];

      for (const seatNo of seats) {
        if (seatsList[seatNo] === 0) {
          seatsList[seatNo] = 1;
        } else {
          const error = new Error(
            "The seats you are trying to book is already booked."
          );
          error.title = "Error Occured";
          error.statusCode = 422;
          throw error;
        }
      }

      venueData.seats = seatsList;
      venueCache = venueData;

      return Reserve.find({ venueId: venueId, bookedSeats: { $in: seats } });
    })
    .then((result) => {
      if (!result) {
        const error = new Error(
          "There was an error while sending data to server."
        );
        error.title = "Error Occured";
        error.statusCode = 422;
        throw error;
      }

      const newReserve = new Reserve({
        userId: userId,
        bookedSeats: seats,
        venueId: venueId,
      });
      return newReserve.save();
    })
    .then((result) => {
      if (!result) {
        const error = new Error(
          "There was an error while sending data to server."
        );
        error.title = "Error Occured";
        error.statusCode = 422;
        throw error;
      }

      recipt = result;

      return venueCache.save();
    })
    .then((result) => {
      if (!result) {
        const error = new Error(
          "There was an error while sending data to server."
        );
        error.title = "Error Occured";
        error.statusCode = 422;
        throw error;
      }
      res.status(200).json({ result, recipt });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getVenue = (req, res, next) => {
  const venueId = req.params.venueId;

  if (!venueId) {
    const error = new Error("Could not find a matching venue.");
    error.title = "Error Occured";
    error.statusCode = 422;
    throw error;
  }

  Venue.findById(venueId)
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find a matching venue.");
        error.title = "Error Occured";
        error.statusCode = 422;
        throw error;
      }

      res.status(200).json({ result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getRecipts = (req, res, next) => {
  const userId = req.params.userId;

  if (!userId) {
    const error = new Error("Could not find any recipts.");
    error.title = "Error Occured";
    error.statusCode = 422;
    throw error;
  }

  Reserve.find({ userId: userId })
    .populate("venueId", ["showName", "_id"])
    .sort({_id: -1})
    .then((result) => {
      res.status(200).json({ result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
