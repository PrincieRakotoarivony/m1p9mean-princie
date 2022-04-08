const { default: mongoose } = require("mongoose");

const TokenSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    token: String,
    utilisateur: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Utilisateur'},
    dateExpiration: {type: mongoose.Schema.Types.Date}
});

const Token = mongoose.model('Token', TokenSchema);

module.exports = Token;