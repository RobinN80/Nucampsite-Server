const express = require("express");
const Favorite = require("../models/favorite");
const authenticate = require("../authenticate");
const cors = require("./cors");
const { RequestTimeout } = require("http-errors");

const favoriteRouter = express.Router();

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate("favorite.user")
      .populate("favorite.campsites")
      .then((favorite) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorite);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          // when favorite document exists,  new campsites to favorite object
          req.body.forEach((favoritecampsite) => {
            if (!favorite.campsites.includes(favoritecampsite._id)) {
              favorite.campsites.push(favoritecampsite._id);
            }
          });

          favorite
            .save()
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err) => next(err));
        } else {
          //when no favorite document found, create a favorite and add campsites
          Favorite.create({ user: req.user._id })
            .then((favorite) => {
              req.body.forEach((favoritecampsite) => {
                if (!favorite.campsites.includes(favoritecampsite._id)) {
                  favorite.campsites.push(favoritecampsite._id);
                }
              });
              favorite
                .save()
                .then((favorite) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(favorite);
                })
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("Put operation is not available with /favorites");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user_id })
      .then((favorite) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorite);
      })
      .catch((err) => next(err));
  });

favoriteRouter
  .route("/:campsiteId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      `GET request is not available on with /favorites/ ${req.params.campsiteId}`
    );
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then((favorite) => {
      if (favorite) {
        // check if campsiteId exists
        if (favorite.campsites.includes(req.params.campsiteId)) {
            // respond with message that campsite already exists
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end("This campsite is already one of your favorites"); 
        } else {
          // add it to favorite.campsite, save, respond with document
          favorite.campsites.push(req.params.campsiteId);
          favorite
            .save()
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err = next(err)));
        }
      } else {
        // create new favorite document, Favorite.create({ user: req.user._id, campsites: [req.params.campsiteId] })
        favorite.create({
          user: req.user._id,
          campsites: [req.params.campsiteId],
        });
        favorite
          .save()
          .then((favorite) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorite);
          })
          .catch((err) => next(err));
      }
    });
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`Put request not available on favorites/${req.params.campsiteId}`);
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          // if favorites document exists
          if (favorite.campsites.indexOf(req.params.campsiteId) >= 0) {
            // remove campsite
            const index = favorite.campsites.indexOf(req.params.campsiteId);
            favorite.campsites.splice(index, 1);

            favorite
              .save()
              .then((favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
              })
              .catch((err) => next(err));
          } else {
            //send message that it does not exist
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/plain");
            res.end("There are no favorites to delete");
          }
        }
      })
      .catch((err) => next(err));
  });

module.exports = favoriteRouter;
