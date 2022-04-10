const { ObjectId } = require("mongodb");
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
    qte: {type: Number, required: [true, 'Quantité obligatoire'], min: [1, 'La quantité doit être positive']},
    etat: {type: Number, enum: [0, 1], default: 0}
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
    console.log(params);
    const aggregateParams = [
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
            "$match": crt
        },
        {
            "$project": {details: 0}
        }
    ];
    const commandes = await Commande.aggregate(aggregateParams)
    .sort(sort)
    .skip((params.page - 1) * params.nPerPage)
    .limit(params.nPerPage)
    .exec();
    console.log(commandes);
    aggregateParams.push({"$count": "count"});
    const countResult = await Commande.aggregate(aggregateParams).exec();
    return {commandes, count: countResult[0].count};
};

CommandeSchema.statics.getCommandeById = async function (id){
    const aggregateParams = [
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
            "$match": {_id: new mongoose.Types.ObjectId(id)}
        }
    ];
    const result = await Commande.aggregate(aggregateParams).exec();
    if(result.length == 0) throw new Error("Commande invalide");
    return result[0];
}

CommandeSchema.statics.getCommandesResto = async function (idRestaurant){
    console.log('idResto', idRestaurant);
    const commandes = await Commande.aggregate([
        { $unwind: "$details" },
        { $match: {"details.produit.restaurant": new mongoose.Types.ObjectId(idRestaurant) } },
        { 
            $group: {
                _id: {_id: "$_id"},
                details: {$push: "$details"}
            } 
        }
    ]).exec();
    return commandes;
}

const Commande = mongoose.model('Commande', CommandeSchema);

module.exports = Commande;