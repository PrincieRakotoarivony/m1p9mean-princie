const { default: mongoose } = require("mongoose");

const ProfileSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nom: String
});

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;