const {dbconnect} = require('../utils');
const { PROFILE_RESTAURANT } = require('../utils/constantes');

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

async function saveProduit(utilisateur, produit){
    if(utilisateur.id_profile != PROFILE_RESTAURANT)
        throw new Error("Pas d'autorisation");
    produit.id_restaurant = utilisateur.id_restaurant;   
    produit.visible = true;
    const db = await dbconnect.getDb();
    const produitCollection = db.collection('produit');
    const result = await produitCollection.insertOne(produit);
    return result.insertedId;
}

async function findOneProduit(crt){
    const db = await dbconnect.getDb();
    const produitCollection = db.collection('produit');
    var produit = await produitCollection
        .findOne(crt)
    return produit;
}

module.exports = {findProduits, saveProduit, findOneProduit};