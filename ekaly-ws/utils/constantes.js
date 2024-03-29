const { default: mongoose } = require("mongoose");

module.exports = {
    PROFILE_CLIENT: new mongoose.Types.ObjectId("62502e5577bc1a7c7c12c108"),
    PROFILE_RESTAURANT: new mongoose.Types.ObjectId("62502e7177bc1a7c7c12c109"),
    PROFILE_EKALY: new mongoose.Types.ObjectId("62502e9077bc1a7c7c12c10b"),
    PROFILE_LIVREUR: new mongoose.Types.ObjectId("62502e8277bc1a7c7c12c10a"),
    ETATS_COMMANDE: {COMMANDEE: 0, EN_PREPARATION: 1, PREPAREE: 2, ASSIGNEE_LIVREUR: 3, EN_LIVRAISON: 4, LIVREE: 5}
}