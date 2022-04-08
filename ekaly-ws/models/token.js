const moment = require('moment');
const sha1 = require('sha1');
const { default: mongoose } = require("mongoose");

const TokenSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    token: String,
    utilisateur: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Utilisateur'},
    dateExpiration: {type: mongoose.Schema.Types.Date}
});

TokenSchema.statics.findToken = async function (tokenStr) {
    const token = await Token
    .findOne({token: sha1(tokenStr), match: {dateExpiration: {$gte: moment()}}})
    .populate('utilisateur')
    .exec();
    return token;
}

TokenSchema.statics.rmvToken = async function (token){
    await Token.deleteOne({token: sha1(token)});
}

const Token = mongoose.model('Token', TokenSchema);




module.exports = Token;