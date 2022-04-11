const { default: mongoose } = require("mongoose");

const MdpOublieSchema = new mongoose.Schema({
    utilisateur: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Utilisateur'},
    verifCode: {type: String, required: true},
    dateExpiration: Date
});

const MdpOublie = mongoose.model('MdpOublie', MdpOublieSchema);

module.exports = MdpOublie;