const express = require('express');
const { default: mongoose } = require('mongoose');
const { Commande, Utilisateur } = require('../models');
const {responseBuilder, tools} = require('../utils');
const moment = require('moment');
const { constantes } = require('../utils');
const { PROFILE_RESTAURANT, PROFILE_EKALY, PROFILE_LIVREUR, ETATS_COMMANDE } = require('../utils/constantes');
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

router.post('/ekaly', async function(req, res){
    try{
       /*  const token = tools.extractToken(req.headers.authorization);
        const u = await Utilisateur.findUser(token);
        if(!u.profile.equals(PROFILE_EKALY)) 
            throw new Error("Pas d'autorisation"); */
        const commandes = await Commande.getCommandesEkaly(req.body);
        res.json(responseBuilder.success(commandes));
    } catch(error){
        console.log(error);
        res.json(responseBuilder.error(error));
    }
});

router.get('/ekaly/:id', async function(req, res){
    try{
       /*  const token = tools.extractToken(req.headers.authorization);
        const u = await Utilisateur.findUser(token);
        if(!u.profile.equals(PROFILE_EKALY)) 
            throw new Error("Pas d'autorisation"); */
        const cmd = await Commande.getCommandeEkalyById(new mongoose.Types.ObjectId(req.params.id));
        res.json(responseBuilder.success(cmd));
    } catch(error){
        console.log(error);
        res.json(responseBuilder.error(error));
    }
});

router.post('/resto/:id/etat', async function(req, res){
    try{
        const etat = req.query.etat;
        const token = tools.extractToken(req.headers.authorization);
        const u = await Utilisateur.findUser(token);
        if(!u.profile.equals(PROFILE_RESTAURANT))
            throw new Error("Pas d'autorisation");
        await Commande.changerEtatResto(new mongoose.Types.ObjectId(req.params.id), u.restaurant, etat);    
        res.json(responseBuilder.success("success"));
    } catch(error){
        console.log(error);
        res.json(responseBuilder.error(error));
    }
});

router.get('/:id/assigner', async function(req, res){
    try{
        const cmd = await Commande.findById(new mongoose.Types.ObjectId(req.params.id)).exec();
        if(!cmd) throw new Error("Commande invalide");
        await cmd.assigner(new mongoose.Types.ObjectId(req.query.idLivreur));
        res.json(responseBuilder.success("success"));
    } catch(error){
        console.log(error);
        res.json(responseBuilder.error(error));
    }
});

router.post('/livreur/etat', async function(req, res){
    try{
        const token = tools.extractToken(req.headers.authorization);
        const u = await Utilisateur.findUser(token);
        if(!u.profile.equals(PROFILE_LIVREUR))
            throw new Error("Pas d'autorisation");
        const crt = req.body ? req.body : {};  
        crt.livreur = u._id;  
        const commandes = await Commande.getCommandesLivreur(crt);
        res.json(responseBuilder.success(commandes));
    } catch(error){
        console.log(error);
        res.json(responseBuilder.error(error));
    }
});

router.post('/:id/etat-livraison', async function(req, res){
    try{
        const token = tools.extractToken(req.headers.authorization);
        const u = await Utilisateur.findUser(token);
        if(!u.profile.equals(PROFILE_LIVREUR))
            throw new Error("Pas d'autorisation");
        const cmd = await Commande.findById(new mongoose.Types.ObjectId(req.params.id));
        if(!cmd.livreur.equals(u._id))
            throw new Error("Pas d'autorisation");
        cmd.etat = req.query.etat;    
        if(cmd.etat == ETATS_COMMANDE.LIVREE){
            cmd.dateLivree = moment();
        }
        cmd.save();
        res.json(responseBuilder.success("success"));
    } catch(error){
        console.log(error);
        res.json(responseBuilder.error(error));
    }
});

router.post('/restaurant/benefice', async function(req, res){
    try{
        const token = tools.extractToken(req.headers.authorization);
        const u = await Utilisateur.findUser(token);
        if(!u.profile.equals(PROFILE_RESTAURANT)) 
            throw new Error("Pas d'autorisation");
        const result = await Commande.getBeneficesResto(new mongoose.Types.ObjectId(u.restaurant), req.body);
        res.json(responseBuilder.success(result));
    } catch(error){
        console.log(error);
        res.json(responseBuilder.error(error));
    }
});

module.exports = router;