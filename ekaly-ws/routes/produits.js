const express = require('express');
const { default: mongoose } = require('mongoose');
const { Produit, Utilisateur } = require('../models');
const {responseBuilder, tools, mail} = require('../utils');
const { constantes } = require('../utils');
 const router = express.Router();

router.post('/', async function(req, res){
    try{
        const result = await Produit.search(req.body);
        res.json(responseBuilder.success(result));
    } catch(error){
        res.json(responseBuilder.error(error));
    }
});

router.post('/save', async function(req, res){
    try{
        const token = tools.extractToken(req.headers.authorization);
        const u = await Utilisateur.findUser(token);
        if(!u.profile.equals(constantes.PROFILE_RESTAURANT)) 
            throw new Error("Pas d'autorisation");
        const produit = new Produit(req.body);
        produit._id = new mongoose.Types.ObjectId();
        produit.restaurant = u.restaurant;
        await produit.save();
        res.json(responseBuilder.success(produit._id));
    } catch(error){
        res.json(responseBuilder.error(error));
    }
});

router.get('/:id', async function(req, res){
    try{
        const result = await Produit.getById(req.params.id);
        res.json(responseBuilder.success(result));
    } catch(error){
        res.json(responseBuilder.error(error));
    }
});

router.put('/:id', async function(req, res){
    try{
        const token = tools.extractToken(req.headers.authorization);
        const u = await Utilisateur.findUser(token);
        const produit = await Produit.getById(req.params.id);
        if(!u.profile.equals(constantes.PROFILE_RESTAURANT) || !u.restaurant.equals(produit.restaurant)) 
            throw new Error("Pas d'autorisation");
        ["nom", "description", "cout", "prix", "img", "visible"].forEach(key => {
            produit[key] = req.body[key];
        });
        await produit.save();
        res.json(responseBuilder.success("Plat modifié"));
    } catch(error){
        res.json(responseBuilder.error(error));
    }
});

router.post('/panier', async function(req, res){
    try{
        const panier = await Produit.getDetailsPanier(req.body);
        res.json(responseBuilder.success(panier));
    } catch(error){
        res.json(responseBuilder.error(error));
    }
});

router.get('/mail/send', async function (req, res){
    try{
        await mail.sendMail({
            from: 'ekaly.no-reply@gmail.com',
            to: 'princierakotoarivony4@gmail.com',
            subject: 'test send mail',
            html: '<h1>Welcome</h1><p>That was easy!</p>'
        });
        res.json(responseBuilder.success("Mail sent"));
    } catch(error){
        res.json(responseBuilder.error(error));
    }
});

module.exports = router;