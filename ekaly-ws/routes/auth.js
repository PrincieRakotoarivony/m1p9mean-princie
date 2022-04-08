const express = require('express');
const { Utilisateur } = require('../models');
const {authService} = require('../services');
const {responseBuilder, tools} = require('../utils');
 const router = express.Router();

router.post('/login', async function(req, res){
    try{
        const u = new Utilisateur(req.body);
        const token = await u.login();
        res.json(responseBuilder.success(token));
    } catch(err){
        res.json(responseBuilder.error(err));
    }
});

router.post('/signUp', async function(req, res){
    try{
        const u = new Utilisateur(req.body);
        await u.signUp({confirmMdp: req.body.confirmMdp});
        res.json(responseBuilder.success(u._id));
    } catch(err){
        res.json(responseBuilder.error(err));
    }
});

router.delete('/logout', async function(req, res){
    try{
        const token = tools.extractToken(req.headers.authorization);
        await authService.logout(token);
        res.json(responseBuilder.success("Utilisateur déconnecté"));
    } catch(error){
        res.json(responseBuilder.error(error.message));
    }
});

module.exports = router;