const express = require('express');
const { Utilisateur, Token } = require('../models');
const {responseBuilder, tools} = require('../utils');
 const router = express.Router();

router.post('/login', async function(req, res){
    try{
        const u = new Utilisateur(req.body);
        const result = await u.login();
        res.json(responseBuilder.success(result));
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

router.get('/user', async function(req, res){
    try{
        const token = tools.extractToken(req.headers.authorization);
        const u = await Utilisateur.findUser(token);
        res.json(responseBuilder.success(u));
    } catch(err){
        res.json(responseBuilder.error(err));
    }
});

router.delete('/logout', async function(req, res){
    try{
        const token = tools.extractToken(req.headers.authorization);
        await Token.rmvToken(token);
        res.json(responseBuilder.success("Utilisateur déconnecté"));
    } catch(error){
        res.json(responseBuilder.error(error.message));
    }
});

router.get('/mdpOublie', async function(req, res){
    try{
        await Utilisateur.mdpOublie(req.query.mail);
        res.json(responseBuilder.success("success"));
    } catch(err){
        console.log(err);
        res.json(responseBuilder.error(err));
    }
});

router.post('/reinitMdp', async function(req, res){
    try{
        await Utilisateur.reinitMdp(req.body);
        res.json(responseBuilder.success("success"));
    } catch(err){
        console.log(err);
        res.json(responseBuilder.error(err));
    }
});

module.exports = router;