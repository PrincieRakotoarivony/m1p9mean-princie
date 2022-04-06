const express = require('express');
const { ObjectId } = require('mongodb');
const {produitsService, authService} = require('../services');
const {responseBuilder, tools} = require('../utils');
 const router = express.Router();

router.post('/', function(req, res){
    produitsService
    .findProduits(req.body)
    .then((result) => {
        res.json(responseBuilder.success(result));
    })
    .catch((error) => {
        res.json(responseBuilder.error(error.message));
    })
});

router.post('/save', async function(req, res){
    try{
        const token = tools.extractToken(req.headers.authorization);
        const tokenUtilisateur = await authService.findTokenUser(token);
        const result = await produitsService.saveProduit(tokenUtilisateur.utilisateur, req.body);
        res.json(responseBuilder.success(result));
    } catch(error){
        res.json(responseBuilder.error(error.message));
    }
});

router.get('/:id_produit', async function(req, res){
    try{
        console.log(req.params.id_produit);
        const result = await produitsService.findOneProduit({_id: new ObjectId(req.params.id_produit)});
        res.json(responseBuilder.success(result));
    } catch(error){
        res.json(responseBuilder.error(error.message));
    }
});

router.put('/:id_produit', async function(req, res){
    try{
        const token = tools.extractToken(req.headers.authorization);
        const tokenUtilisateur = await authService.findTokenUser(token);
        await produitsService.updateProduit(tokenUtilisateur.utilisateur, req.params.id_produit, req.body);
        res.json(responseBuilder.success("Plat modifié"));
    } catch(error){
        console.error(error);
        res.json(responseBuilder.error(error.message));
    }
});

module.exports = router;