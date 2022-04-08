const { default: mongoose } = require("mongoose");
const sha1 = require('sha1');
const { PROFILE_CLIENT } = require("../utils/constantes");

const UtilisateurSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    mail: {
        type: String, 
        required: [true, 'Adresse e-mail obligatoire'], 
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Adresse e-mail invalide'],
        index: [true, 'Adresse e-mail déjà utilisée'],
        unique: [true]
    },
    nom: {type: String},
    prenom: {type: String},
    mdp: {type: String, required: [true, 'Mot de passe obligatoire']},
    profile: {type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true},
    restaurant: {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'}
});


UtilisateurSchema.methods.signUp = async function (params){
    this.profile = PROFILE_CLIENT;
    const error = this.validateSync();
    if(error) throw error;
    if(!params.confirmMdp || params.confirmMdp != this.mdp)
        throw new Error("Mots de passe non conformes");
    this.mdp = sha1(this.mdp);
    this._id = new mongoose.Types.ObjectId();
    await this.save();
} 

const Utilisateur = mongoose.model('Utilisateur', UtilisateurSchema);


module.exports = Utilisateur;
