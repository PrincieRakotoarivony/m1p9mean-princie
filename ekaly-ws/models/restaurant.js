const { default: mongoose } = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nom: String,
    adresse: String,
    img: String
});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

module.exports = Restaurant;