const express = require('express');
const { default: mongoose } = require('mongoose');
const { Commande, Utilisateur } = require('../models');
const {responseBuilder, tools} = require('../utils');
const { constantes } = require('../utils');
const { PROFILE_RESTAURANT } = require('../utils/constantes');
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


router.post('/resto', async function(req, res){
    try{
        const token = tools.extractToken(req.headers.authorization);
        const u = await Utilisateur.findUser(token);
        if(!u.profile.equals(PROFILE_RESTAURANT)) 
            throw new Error("Pas d'autorisation");
        const commandes = await Commande.getCommandesResto(u.restaurant, req.body);
        res.json(responseBuilder.success(commandes));
    } catch(error){
        console.log(error);
        res.json(responseBuilder.error(error));
    }
});

router.get('/resto/:id', async function(req, res){
    try{
        const token = tools.extractToken(req.headers.authorization);
        const u = await Utilisateur.findUser(token);
        if(!u.profile.equals(PROFILE_RESTAURANT)) 
            throw new Error("Pas d'autorisation");
        const cmd = await Commande.getCommandeRestoById(new mongoose.Types.ObjectId(req.params.id), u.restaurant);
        res.json(responseBuilder.success(cmd));
    } catch(error){
        console.log(error);
        res.json(responseBuilder.error(error));
    }
});

module.exports = router;