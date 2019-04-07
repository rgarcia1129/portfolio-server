const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define our model
const userSchema = new Schema({
   _id: {
      type: String,
      unique: true
   },
   firstName: String,
   lastName: String,
   birthdate: Date,
   address: Map
});

// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;