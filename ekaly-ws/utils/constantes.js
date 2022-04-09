const { default: mongoose } = require("mongoose");

module.exports = {
    PROFILE_CLIENT: new mongoose.Types.ObjectId("62502e5577bc1a7c7c12c108"),
    PROFILE_RESTAURANT: new mongoose.Types.ObjectId("62502e7177bc1a7c7c12c109"),
    ETATS_COMMANDE: {COMMANDEE: 1, EN_PREPARATION: 2, PREPAREE: 3, ASSIGNEE_LIVREUR: 4, EN_LIVRAISON: 5, LIVREE: 6}
}