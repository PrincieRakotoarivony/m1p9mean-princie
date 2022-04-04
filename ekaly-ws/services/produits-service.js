const {dbconnect} = require('../utils');

async function findProduits(params){
    const db = await dbconnect.getDb();
    const produitCollection = db.collection('produit');
    var produits = await produitCollection
        .find({...params.crt, nom: {$regex: new RegExp(`.*${params.search}.*`), $options: 'i'}})
        .sort({nom: 1})
        .skip((params.pageNumber - 1) * params.nPerPage)
        .limit(params.nPerPage)
        .toArray();
    return produits;
}

module.exports = {findProduits};