const { default: mongoose } = require("mongoose");

const ProduitSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nom: {type: String, required: [true, "Nom obligatoire"]},
    description: String,
    cout: {type: Number, required: [true, "Coût obligatoire"], min: [0, "Le coût du plat doit etre positif"]},
    prix: {type: Number, required: [true, "Prix obligatoire"], min: [0, "Le prix du plat doit etre positif"]},
    img: String,
    restaurant: {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true}
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
    const result = await Produit.find({$or: [{nom: searchRegex}, {description: searchRegex}], ...crt})
        .sort(params.sort ? params.sort : {})
        .limit(params.nbrPerPage)
        .skip((params.page - 1) * params.nbrPerPage)
        .exec();
    return result;    
}

const Produit = mongoose.model('Produit', ProduitSchema);





module.exports = Produit;