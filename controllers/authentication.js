const User = require('../models/user');
var admin = require('firebase-admin');
var constants = require('../utils/constants/constants');
var serviceAccount = require('../config/firebase.json');
var userUtils = require('../utils/userUtils');
var loggingUtils = require('../utils/loggingUtils');
var _ = require('lodash');

admin.initializeApp({
    credential: admin
        .credential
        .cert(serviceAccount),
    databaseURL: constants.FIREBASE_DATABASE_URL
});

/**
 * Middleware to ensure a user is logged in before completing any additional calls.
 */
exports.isAuthorized = function (req, res, next) {
    // Retrieve the auth token from the header
    const idToken = req.get(constants.AUTHORIZATION);

    // If token is empty or not a string, forbid the authorization.
    if (_.isEmpty(idToken) || !_.isString(idToken)) {
        res.status(403).send({ error: 'Forbidden.' });
    }

    // Verify ID Token with firebase
    admin.auth().verifyIdToken(idToken)
    .then(function (decodedToken) {
        User.findOne({ _id: decodedToken.uid }, function (err, user) {
            if (err) return next(err);

            // User could not be found.  Doesn't exist in system.
            if (!user) return res.status(403).send({ error: 'Forbidden.' });

            res.currentUser = {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName
            };

            return next();
        });
    }).catch(function (error) {
        res.status(403).send({ error: 'Forbidden.' });
    });
};

/**
 * Utility to get current user data
 */
exports.currentUserAccountData = function (req, res, next) {

    // User has been identified, can proceed to next set of calls.
    admin.auth().getUser(res.currentUser._id)
    .then(function (userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        let currentUser = {
            _id: res.currentUser._id,
            firstName: res.currentUser.firstName,
            lastName: res.currentUser.lastName,
            email: userRecord.toJSON().email
        };

        // Database lookup is required
        User.findOne({ _id: res.currentUser._id }, function (err, user) {
            if (err) return next(err);

            // User could not be found.  Doesn't exist in system.
            if (!user) return res.status(403).send({ error: 'Forbidden.' });

            // Address expand parameter is present, add it to the response
            if(_.includes(req.query.expand, constants.ADDRESS)) {
                currentUser.address = user.address;
            }

            // Birthdate expand parameter is present, add it to the response
            if(_.includes(req.query.expand, constants.BIRTHDATE)) {
                currentUser.birthdate = user.birthdate;
            }

            res.status(200).send(currentUser);
        });
    })
    .catch(function (error) {
        res.status(403).send({ error: 'Forbidden.' });
    });
};

/**
 * Completes the signup process for a user and creates an instance in the mongo database.
 */
exports.signup = function (req, res, next) {
    userUtils.getFirebaseUserId(req, res, admin)
    .then((uid) => {
        User.findOne({ _id: uid }, function (err, existingUser) {
            // TODO: Need to create middleware to handle errors and log on them
            if (err) return next(err);

            // User already exists with that firebase ID
            if (existingUser) return res.status(204).send();

            const { firstName, lastName } = req.body;

            // If a user does NOT exist, create a record in the mongo DB
            const user = new User({ _id: uid, firstName: firstName, lastName: lastName });

            // Save the user to our Mongo DB
            user.save(function (err) {
                if (err) return next(err);

                // User was saved, update the client
                res.status(204).send();
            });
        });
    }).catch((error) => {
        res.status(400).send({message: 'User could not be created.'});
    });
};
