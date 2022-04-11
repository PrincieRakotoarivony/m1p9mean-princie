const { ObjectId } = require("mongodb");
const { default: mongoose } = require("mongoose");
const { ETATS_COMMANDE, PROFILE_LIVREUR } = require("../utils/constantes");
const { parseMoment } = require("../utils/tools");
const Produit = require("./produit");
const Utilisateur = require("./utilisateur");

const DetailsCommandeSchema = new mongoose.Schema({
    produit: {
        _id: {type: mongoose.Schema.Types.ObjectId, required: true},
        nom: String,
        prix: Number
    },
    qte: {type: Number, required: [true, 'Quantité obligatoire'], min: [1, 'La quantité doit être positive']}
});

const CommandeSchema = new mongoose.Schema({
    client: {type: mongoose.Schema.Types.ObjectId, required: [true, 'Client obligatoire'], ref: 'Utilisateur'},
    detailsResto: [{restaurant: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Restaurant'}, details: [DetailsCommandeSchema], etat: {type: Number, enum: [0, 1, 2], default: 0}}],
    adresse: {type: String, required: [true, 'Adresse obligatoire']},
    livreur: {type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur'},
    etat: {type: Number, enum: Object.values(ETATS_COMMANDE), default: ETATS_COMMANDE.COMMANDEE},
    fraisLivraison: {type: Number, required: true, min: 0},
    dateCommande: {type: Date, default: Date.now(), required: true },
    dateLivree: Date
});

CommandeSchema.methods.genererCommande = async function (produitsQte){
    const {panier, frais} = await Produit.getDetailsPanier(produitsQte);
    const tabIdProduits = Object.keys(panier);
    if(tabIdProduits.length == 0) throw new Error("Votre panier est vide");
    this.fraisLivraison = frais;
    const detailsRestoMap = {};
    tabIdProduits.forEach(idProduit => {
        const p = panier[idProduit];
        const restoKey = p.produit.restaurant.toString();
        if(!detailsRestoMap[restoKey]){
            detailsRestoMap[restoKey] = {restaurant: p.produit.restaurant, details: []};
        }
        detailsRestoMap[restoKey].details.push(p);
    });

    Object.keys(detailsRestoMap)
    .forEach(restoKey => {
        this.detailsResto.push(detailsRestoMap[restoKey]);
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
    const aggregateParams = [
        {
            "$match": crt
        },
        {$unwind: "$detailsResto"},
        {$unwind: "$detailsResto.details"},
        {
            $group: {
                _id: {_id: "$_id", client: "$client", dateCommande: "$dateCommande", 
                adresse: "$adresse", etat: "$etat", fraisLivraison: "$fraisLivraison"},
                details: {$push: "$detailsResto.details"} 
            }
        },
        { $project: {_id: "$_id._id", client: "$_id.client", dateCommande: "$_id.dateCommande", 
            adresse: "$_id.adresse", etat: "$_id.etat", fraisLivraison: "$_id.fraisLivraison", details: 1 
        } },
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
            "$project": {details: 0}
        }
    ];
    const commandes = await Commande.aggregate(aggregateParams)
    .sort(sort)
    .skip((params.page - 1) * params.nPerPage)
    .limit(params.nPerPage)
    .exec();
    aggregateParams.push({"$count": "count"});
    const countResult = await Commande.aggregate(aggregateParams).exec();
    return {commandes, count: countResult.length > 0 ? countResult[0].count : 0};
};

CommandeSchema.statics.getCommandeById = async function (id){
    const aggregateParams = [
        {
            "$match": {_id: new mongoose.Types.ObjectId(id)}
        },
        {$unwind: "$detailsResto"},
        {$unwind: "$detailsResto.details"},
        {
            $group: {
                _id: {_id: "$_id", client: "$client", dateCommande: "$dateCommande", 
                adresse: "$adresse", etat: "$etat", fraisLivraison: "$fraisLivraison"},
                details: {$push: "$detailsResto.details"} 
            }
        },
        { $project: {_id: "$_id._id", client: "$_id.client", dateCommande: "$_id.dateCommande", 
            adresse: "$_id.adresse", etat: "$_id.etat", fraisLivraison: "$_id.fraisLivraison", details: 1 
        } },
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
        }
    ];
    const result = await Commande.aggregate(aggregateParams).exec();
    if(result.length == 0) throw new Error("Commande invalide");
    return result[0];
}

CommandeSchema.statics.getCommandesResto = async function (idRestaurant, params){
    const crt = params.crt ? params.crt : {};
    crt["detailsResto.restaurant"] = idRestaurant;
    const sort = params.sort;
    if(crt.dateMin || crt.dateMax) crt["dateCommande"] = {};
    if(crt.dateMin) crt["dateCommande"]["$gte"] = parseMoment(crt.dateMin);
    if(crt.dateMax) crt["dateCommande"]["$lte"] = parseMoment(crt.dateMax);
    delete crt.dateMin;
    delete crt.dateMax;
    
    const aggregateParams = [
        { $unwind: "$detailsResto" },
        { $match: crt},
        {
            $addFields: {
                "montant": {
                    "$reduce": {
                        "input": "$detailsResto.details",
                        "initialValue": 0,
                        "in": { "$add" : ["$$value",  {"$multiply": ["$$this.produit.prix", "$$this.qte"]}] }
                    }
                }
            }
        },
        {
            $addFields: {
                etatResto: {
                    $cond: {if: {$lte: ["$etat", 2]}, then: "$detailsResto.etat", else: "$etat"} 
                }
            }
        },
        {
            $project: {detailsResto: 0, fraisLivraison: 0}
        }
    ];
    const commandes = await Commande.aggregate(aggregateParams)
    .sort(sort)
    .skip((params.page - 1) * params.nPerPage)
    .limit(params.nPerPage)
    .exec();
    aggregateParams.push({"$count": "count"});
    const countResult = await Commande.aggregate(aggregateParams).exec();
    return {commandes, count: countResult.length > 0 ? countResult[0].count : 0};
    return commandes;
}

CommandeSchema.statics.getCommandeRestoById = async function (idCmd, idRestaurant){
    const crt = {};
    crt["detailsResto.restaurant"] = idRestaurant;
    crt["_id"] = idCmd;
    
    const aggregateParams = [
        { $unwind: "$detailsResto" },
        { $match: crt},
        {
            $addFields: {
                "montant": {
                    "$reduce": {
                        "input": "$detailsResto.details",
                        "initialValue": 0,
                        "in": { "$add" : ["$$value",  {"$multiply": ["$$this.produit.prix", "$$this.qte"]}] }
                    }
                }
            }
        },
        {
            $addFields: {
                etatResto: {
                    $cond: {if: {$lte: ["$etat", 2]}, then: "$detailsResto.etat", else: "$etat"} 
                }
            }
        },
        {
            $lookup: {
                from: "utilisateurs",
                localField: "client",
                foreignField: "_id",
                pipeline: [
                    {$project: {nom: 1, prenom: 1}}
                ],
                as: "clientObj"
            }
        },
        {$unwind: "$clientObj"},
        {
            $project: {fraisLivraison: 0, }
        }
    ];
    const result = await Commande.aggregate(aggregateParams).exec();
    if(result.length == 0) throw new Error("Commande invalide");
    return result[0];
}

CommandeSchema.statics.getCommandesEkaly = async function (params){
    const crt = params.crt ? params.crt : {};
    const sort = params.sort;
    if(crt.dateMin || crt.dateMax) crt["dateCommande"] = {};
    if(crt.dateMin) crt["dateCommande"]["$gte"] = parseMoment(crt.dateMin);
    if(crt.dateMax) crt["dateCommande"]["$lte"] = parseMoment(crt.dateMax);
    delete crt.dateMin;
    delete crt.dateMax;
    const aggregateParams = [
        {
            "$match": crt
        },
        {$unwind: "$detailsResto"},
        {$unwind: "$detailsResto.details"},
        {
            $group: {
                _id: {_id: "$_id", client: "$client", dateCommande: "$dateCommande", 
                adresse: "$adresse", etat: "$etat", fraisLivraison: "$fraisLivraison"},
                montant: {$sum: {$multiply: ["$detailsResto.details.produit.prix", "$detailsResto.details.qte"]}}
            }
        },
        { $project: {_id: "$_id._id", client: "$_id.client", dateCommande: "$_id.dateCommande", 
            adresse: "$_id.adresse", etat: "$_id.etat", fraisLivraison: "$_id.fraisLivraison", montant: 1 
        } },
        {
            "$addFields": {
                "total": { "$add" : ["$montant", "$fraisLivraison"] }
            }
        },
        {
            $lookup: {
                from: "utilisateurs",
                localField: "client",
                foreignField: "_id",
                pipeline: [
                    {$project: {nom: 1, prenom: 1}}
                ],
                as: "clientObj"
            }
        },
        {$unwind: "$clientObj"},
    ];
    const commandes = await Commande.aggregate(aggregateParams)
    .sort(sort)
    .skip((params.page - 1) * params.nPerPage)
    .limit(params.nPerPage)
    .exec();
    aggregateParams.push({"$count": "count"});
    const countResult = await Commande.aggregate(aggregateParams).exec();
    return {commandes, count: countResult.length > 0 ? countResult[0].count : 0};
};

CommandeSchema.statics.getCommandeEkalyById = async function (idCmd){
    const aggregateParams = [
        {
            "$match": {_id: idCmd}
        },
        {$unwind: "$detailsResto"},
        {$unwind: "$detailsResto.details"},
        {
            $group: {
                _id: {_id: "$_id", client: "$client", livreur: "$livreur", dateCommande: "$dateCommande", 
                adresse: "$adresse", etat: "$etat", fraisLivraison: "$fraisLivraison", restaurant: "$detailsResto.restaurant", etatResto:"$detailsResto.etat"},
                montant: {$sum: {$multiply: ["$detailsResto.details.produit.prix", "$detailsResto.details.qte"]}},
                details: {$push: "$detailsResto.details"}
            }
        },
        {
            $lookup: {
                from: "restaurants",
                localField: "_id.restaurant",
                foreignField: "_id",
                pipeline: [
                    {$project: {nom: 1, adresse: 1}}
                ],
                as: "restaurantObj"
            }
        },
        {$unwind: "$restaurantObj"},
        {
            $group: {
                _id: {_id: "$_id._id", client: "$_id.client", livreur: "$_id.livreur", dateCommande: "$_id.dateCommande", 
                adresse: "$_id.adresse", etat: "$_id.etat", fraisLivraison: "$_id.fraisLivraison"},
                montant: {$sum: "$montant"},
                detailsResto: {$push: {details: "$details", restaurant: "$restaurantObj", etat: "$_id.etatResto", montant: "$montant"}}
            }
        },
        { 
            $project: {
                _id: "$_id._id", client: "$_id.client", livreur: "$_id.livreur", dateCommande: "$_id.dateCommande", 
                adresse: "$_id.adresse", etat: "$_id.etat", fraisLivraison: "$_id.fraisLivraison", montant: 1, detailsResto: 1
            } 
        },
        {
            $addFields: {
                total: {$add: ["$montant", "$fraisLivraison"]}
            }
        },
        {
            $lookup: {
                from: "utilisateurs",
                localField: "client",
                foreignField: "_id",
                pipeline: [
                    {$project: {nom: 1, prenom: 1}}
                ],
                as: "clientObj"
            }
        },
        {$unwind: "$clientObj"},
        {
            $lookup: {
                from: "utilisateurs",
                localField: "livreur",
                foreignField: "_id",
                pipeline: [
                    {$project: {nom: 1, prenom: 1}}
                ],
                as: "livreurObj"
            }
        },
        {$unwind: {path: "$livreurObj", preserveNullAndEmptyArrays: true}}
        
    ];
    const result = await Commande.aggregate(aggregateParams).exec();
    if(result.length == 0) throw new Error("Commande invalide");
    return result[0];
};

CommandeSchema.statics.getCommandeEtatAllResto = async function(idCmd){
    const aggregateParams = [
        {
            "$match": {_id: idCmd}
        },
        {
            "$addFields": {
                "countReady": {
                    "$reduce": {
                        "input": "$detailsResto",
                        "initialValue": 0,
                        "in": { "$add" : ["$$value",  {"$cond": {if: {$eq: ["$$this.etat", 2]}, then: 1, else: 0}}] }
                    }
                },
                "count": {$size: "$detailsResto"}
            }
        },
        {
            "$addFields":{
                "ready": {$eq: ["$countReady", "$count"]}
            }
        }
    ];
    const result = await Commande.aggregate(aggregateParams).exec();
    if(result.length == 0) throw new Error("Commande invalide");
    return result[0];
}

CommandeSchema.statics.changerEtatResto = async function (idCmd, idRestaurant, etat){
    await Commande.updateMany(
        {_id: idCmd},
        {$set: {"detailsResto.$[elmt].etat": etat}},
        {arrayFilters: [{"elmt.restaurant": idRestaurant}]}
    ).exec();
    const com = await Commande.findById(idCmd).exec();
    if(!com) throw new Error("Commande invalide");
    if(com.etat == 0 && etat > 0) com.etat = ETATS_COMMANDE.EN_PREPARATION;    
    if(etat == 2){
        const cmd = await Commande.getCommandeEtatAllResto(idCmd);
        if(cmd.ready){
            com.etat = ETATS_COMMANDE.PREPAREE;
        }
    }
    com.save();

};

CommandeSchema.methods.assigner = async function (idLivreur) {
    const livreur = await Utilisateur.findOne({_id: idLivreur, profile: PROFILE_LIVREUR}).exec();
    if(!livreur) throw new Error("Livreur introuvable");
    this.livreur = livreur._id;
    this.etat = ETATS_COMMANDE.ASSIGNEE_LIVREUR;
    this.save();
}

CommandeSchema.statics.getCommandesLivreur = async function (crt){
    const sort = {dateCommande: -1};
    if(crt.dateMin || crt.dateMax) crt["dateCommande"] = {};
    if(crt.dateMin) crt["dateCommande"]["$gte"] = parseMoment(crt.dateMin);
    if(crt.dateMax) crt["dateCommande"]["$lte"] = parseMoment(crt.dateMax);
    delete crt.dateMin;
    delete crt.dateMax;
    const aggregateParams = [
        {
            "$match": crt
        },
        {
            $lookup: {
                from: "utilisateurs",
                localField: "client",
                foreignField: "_id",
                pipeline: [
                    {$project: {nom: 1, prenom: 1}}
                ],
                as: "clientObj"
            }
        },
        {$unwind: "$clientObj"},
    ];

    var aggr = Commande.aggregate(aggregateParams);
    if(crt.etat == ETATS_COMMANDE.LIVREE){
        aggr = aggr.sort({dateLivree: -1}).skip(0).limit(6);
    } else{
        aggr = aggr.sort(sort);
    }
    
    const commandes = await aggr.exec();
    return commandes;
};



const Commande = mongoose.model('Commande', CommandeSchema);

module.exports = Commande;