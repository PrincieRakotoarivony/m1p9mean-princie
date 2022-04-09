const express = require('express');
const { default: mongoose } = require('mongoose');
const { Commande, Utilisateur } = require('../models');
const {responseBuilder, tools} = require('../utils');
const { constantes } = require('../utils');
const router = express.Router();

router.post('/save', async function(req, res){
    try{
        const token = tools.extractToken(req.headers.authorization);
        const u = await Utilisateur.findUser(token);
        const cmd = new Commande({adresse: req.body.adresse, client: u._id});
        await cmd.genererCommande(req.body.panier);
        res.json(responseBuilder.success(cmd._id));
    } catch(error){
        console.log(error);
        res.json(responseBuilder.error(error));
    }
});

router.post('/', async function(req, res){
    try{
        const commandes = await Commande.getCommandes(req.body);
        res.json(responseBuilder.success(commandes));
    } catch(error){
        console.log(error);
        res.json(responseBuilder.error(error));
    }
});

module.exports = router;