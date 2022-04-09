const { default: mongoose } = require("mongoose");
const { ETATS_COMMANDE } = require("../utils/constantes");
const { parseMoment } = require("../utils/tools");
const Produit = require("./produit");

const DetailsCommandeSchema = new mongoose.Schema({
    produit: {
        _id: {type: mongoose.Schema.Types.ObjectId, required: true},
        restaurant: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Restaurant'},
        nom: String,
        prix: Number
    },
    qte: {type: Number, required: [true, 'Quantité obligatoire'], min: [1, 'La quantité doit être positive']}
});

const CommandeSchema = new mongoose.Schema({
    client: {type: mongoose.Schema.Types.ObjectId, required: [true, 'Client obligatoire'], ref: 'Utilisateur'},
    details: [DetailsCommandeSchema],
    adresse: {type: String, required: [true, 'Adresse obligatoire']},
    livreur: {type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur'},
    etat: {type: Number, enum: Object.values(ETATS_COMMANDE), default: ETATS_COMMANDE.COMMANDEE},
    fraisLivraison: {type: Number, required: true, min: 0},
    dateCommande: {type: Date, default: Date.now(), required: true }
});

CommandeSchema.methods.genererCommande = async function (produitsQte){
    const {panier, frais} = await Produit.getDetailsPanier(produitsQte);
    const tabIdProduits = Object.keys(panier);
    this.fraisLivraison = 0;
    if(tabIdProduits.length > 0) this.fraisLivraison = frais;
    tabIdProduits.forEach(idProduit => {
        this.details.push(panier[idProduit]);
    });
    this.dateCommande = Date.now();
    await this.save();
}

CommandeSchema.statics.getCommandes = async function (params){
    const crt = params.crt ? params.crt : {};
    const sort = params.sort;
    if(crt.dateMin || crt.dateMax) crt["dateCommande"] = {};
    if(crt.dateMin) crt["dateCommande"]["$gte"] = parseMoment(crt.dateMin);
    if(crt.dateMax) crt["dateCommande"]["$lte"] = parseMoment(crt.dateMax);
    delete crt.dateMin;
    delete crt.dateMax;
    const commandes = await Commande.aggregate([
        {
            "$addFields": {
                "montant": {
                    "$reduce": {
                        "input": "$details",
                        "initialValue": 0,
                        "in": { "$add" : ["$$value",  {"$multiply": ["$$this.produit.prix", "$$this.qte"]}] }
                    }
                }
            }
        },
        {
            "$addFields": {
                "total": { "$add" : ["$montant", "$fraisLivraison"] }
            }
        },
        {
            "$match": {...crt, "details": {"$elemMatch": { "produit.restaurant": new mongoose.Types.ObjectId("62506e4c8ab7fea143cf6a18")}}}
        },
        {
            "$sort": sort
        },
        /*{
            "$project": {details: 0}
        }*/
    ]).exec();
    return commandes;
};

const Commande = mongoose.model('Commande', CommandeSchema);

module.exports = Commande;