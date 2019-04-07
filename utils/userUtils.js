
var constants = require('../utils/constants/constants');
var _ = require('lodash');

module.exports.getFirebaseUserId = function (req, res, admin) {
    // Retrieve the auth token from the header
    const idToken = req.get(constants.AUTHORIZATION);
    if (_.isEmpty(idToken) || !_.isString(idToken)) {
        // Return 403, auth token is not present.
        res.status(403).send({ error: 'Forbidden.' });
    }

    // Find the user from Firebase
    return admin.auth().verifyIdToken(idToken)
            .then(function (decodedToken) {
                // User has been identified, can proceed to next set of calls.
                return decodedToken.uid;
            }).catch(function (error) {
                res.status(403).send({ error: 'Forbidden.' });
            });
};

module.exports.getCurrentUser = function (req, res, admin) {
    const firebaseId = getFirebaseUserId(req, res, admin);

    User.findOne({ _id: firebaseId }, function (err, user) {
        return user;
    });
};