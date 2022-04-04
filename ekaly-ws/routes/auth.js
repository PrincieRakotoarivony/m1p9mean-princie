const express = require('express');
const {authService} = require('../services');
const {responseBuilder, tools} = require('../utils');
 const router = express.Router();

router.post('/login', async function(req, res){
    authService
    .login(req.body.nomUtilisateur, req.body.mdp)
    .then((result) => {
        res.json(responseBuilder.success(result));
    })
    .catch((error) => {
        res.json(responseBuilder.error(error.message));
    })
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