const { default: mongoose } = require("mongoose");
const { ETATS_COMMANDE } = require("../utils/constantes");

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


const Commande = mongoose.model('Commande', CommandeSchema);

module.exports = Commande;