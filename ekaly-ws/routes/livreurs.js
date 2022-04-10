
const express = require('express');
const { default: mongoose } = require('mongoose');
const { Utilisateur } = require('../models');
const {responseBuilder, tools, mail} = require('../utils');
const { constantes } = require('../utils');
 const router = express.Router();

router.get('/', async function(req, res){
    try{
        const result = await Utilisateur.searchLivreur(req.query.search);
        res.json(responseBuilder.success(result));
    } catch(error){
        res.json(responseBuilder.error(error));
    }
});

module.exports = router;