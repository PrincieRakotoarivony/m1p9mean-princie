const { ObjectId } = require("mongodb");
const { default: mongoose } = require("mongoose");

const ProduitSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nom: {type: String, required: [true, "Nom obligatoire"]},
    description: String,
    cout: {type: Number, required: [true, "Coût obligatoire"], min: [0, "Le coût du plat doit etre positif"]},
    prix: {type: Number, required: [true, "Prix obligatoire"], min: [0, "Le prix du plat doit etre positif"]},
    img: String,
    restaurant: {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true},
    visible: {type: Boolean, default: true, required: true}
});

ProduitSchema.statics.getById = async function(id){
    const p = await Produit.findById(id).exec();
    if(!p) throw new Error("Produit invalide");
    return p;
}

/**
 * 
 * @param {*} params {search, nbrPerPage, page, sort}
 */
ProduitSchema.statics.search = async function(params){
    const crt = params.crt ? params.crt : {};
    const searchRegex = new RegExp(`${params.search ? params.search: ""}`, "i");
    const where = {$or: [{nom: searchRegex}, {description: searchRegex}], ...crt};
    console.log(where);
    const count = await Produit.count(where).exec();
    const result = await Produit.find(where)
        .populate('restaurant')
        .sort(params.sort ? params.sort : {})
        .limit(params.nbrPerPage)
        .skip((params.page - 1) * params.nbrPerPage)
        .exec();
    return {result, count};    
}

/**
 * 
 * @param {*} produitsQte {[produit1]: qte1, [produit2]: qte2, ...}
 */
ProduitSchema.statics.getDetailsPanier = async function (produitsQte){
    const panier = {};
    const tabId = [];
    Object.keys(produitsQte).forEach(idProduit => {
        tabId.push(new ObjectId(idProduit));
    });
    const produits = await Produit.find({_id: {$in: tabId}, visible: true}).exec();
    var frais = 5000;
    produits.forEach((p, index) => {
        const idProduit = p._id.toString();
        const dPanier = {produit: p, qte: produitsQte[idProduit]};
        dPanier.montant = dPanier.qte * p.prix;
        panier[idProduit] = dPanier;
    });
    return {panier, frais};
}

const Produit = mongoose.model('Produit', ProduitSchema);

module.exports = Produit;