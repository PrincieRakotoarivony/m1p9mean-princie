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

router.post('/client', async function(req, res){
    try{
        const token = tools.extractToken(req.headers.authorization);
        const u = await Utilisateur.findUser(token);
        const params = req.body;
        const crt = params.crt ? params.crt : {}; 
        crt.client = u._id;
        params.crt = crt;
        const commandes = await Commande.getCommandes(params);
        res.json(responseBuilder.success(commandes));
    } catch(error){
        console.log(error);
        res.json(responseBuilder.error(error));
    }
});

router.get('/:id', async function(req, res){
    try{
        const cmd = await Commande.getCommandeById(req.params.id);
        res.json(responseBuilder.success(cmd));
    } catch(error){
        console.log(error);
        res.json(responseBuilder.error(error));
    }
});

/*
router.get('/resto/:id', async function(req, res){
    try{
        const commandes = await Commande.getCommandesResto(req.params.id);
        res.json(responseBuilder.success(commandes));
    } catch(error){
        console.log(error);
        res.json(responseBuilder.error(error));
    }
});
*/
module.exports = router;