const { default: mongoose } = require("mongoose");
const sha1 = require('sha1');
const moment = require('moment');
const { constantes } = require("../utils");
const Token = require("./token");
const { PROFILE_LIVREUR } = require("../utils/constantes");
const MdpOublie = require("./mdpOublie");
const { generateRandomCode } = require("../utils/tools");
const { sendMail } = require("../utils/mail");

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
    this.profile = constantes.PROFILE_CLIENT;
    const error = this.validateSync();
    if(error) throw error;
    if(!params.confirmMdp || params.confirmMdp != this.mdp)
        throw new Error("Mots de passe non conformes");
    this.mdp = sha1(this.mdp);
    this._id = new mongoose.Types.ObjectId();
    await this.save();
} 

UtilisateurSchema.methods.login = async function (){
    const u = await Utilisateur.findOne({
        mail: new RegExp(`^${this.mail}$`, "i"), 
        mdp: sha1(this.mdp)
    }).exec();
    if(!u) throw new Error("Nom d'utilisateur ou mot de passe invalide");
    const token = new Token({
        _id: new mongoose.Types.ObjectId(), 
        utilisateur: u._id, 
        dateExpiration: moment().add(1, 'h')
    });
    const tokenStr = sha1(u._id + moment());
    token.token = sha1(tokenStr);
    await token.save();
    return {user: u, token: tokenStr};
}

UtilisateurSchema.statics.findUser = async function (token){
    const t = await Token.findToken(token);
    if(!t) throw new Error("InvalidToken");
    return t.utilisateur;
}

UtilisateurSchema.statics.searchLivreur = async function(search){
    const searchRegex = new RegExp(`${search ? search: ""}`, "i");
    const where = {$or: [{nom: searchRegex}, {prenom: searchRegex}], profile: PROFILE_LIVREUR};
    const result = await Utilisateur.find(where)
        .exec();
    return result;    
}

UtilisateurSchema.statics.mdpOublie = async function(mail){
    const u = await Utilisateur.findOne({mail: new RegExp(`^${mail.trim()}$`, "i")}).exec();
    if(!u) throw new Error("Email introuvable");
    const mdpOublie = new MdpOublie();
    mdpOublie.utilisateur = u._id;
    const verifCode = generateRandomCode(6);
    console.log(verifCode);
    const exp = moment().add(3, 'h')
    mdpOublie.verifCode = sha1(verifCode);
    mdpOublie.dateExpiration = exp;
    await mdpOublie.save();
    sendMail({
        to: u.mail,
        subject: 'Réinitialisation du mot de passe',
        html: `<p>Bonjour,</p><p>Trouvez ci-dessous le code de vérification pour réinitialiser votre mot de passe sur E-kaly. Ce code sera éxpiré le ${exp.format("DD/MM/YYYY HH:mm:ss Z")}</p><p>Code de vérification: ${verifCode}</p>`
    });
}


UtilisateurSchema.statics.reinitMdp = async function(params){
    const result = await MdpOublie.aggregate([
            {
                $match: {
                    verifCode: sha1(params.verifCode) 
                }
            },
            {
                $lookup: {
                    from: "utilisateurs",
                    localField: "utilisateur",
                    foreignField: "_id",
                    as: "utilisateurObj"
                }
            },
            {$unwind: "$utilisateurObj"},
            {
                $match: {
                    "utilisateurObj.mail": new RegExp(`^${params.mail.trim()}$`, "i")
                }
            }
        ]).exec();
    if(result.length == 0) throw new Error("Code de vérification invalide");
    if(params.mdp != params.confirmMdp) throw new Error("Mots de passe non conformes");
    const u = await Utilisateur.findById(result[0].utilisateur).exec();
    u.mdp = sha1(params.mdp);
    await u.save();
}

const Utilisateur = mongoose.model('Utilisateur', UtilisateurSchema);


module.exports = Utilisateur;
