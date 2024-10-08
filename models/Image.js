// models/Image.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  imageUrl: String,
  imageName: String,
});

module.exports = mongoose.model('Image', imageSchema);
