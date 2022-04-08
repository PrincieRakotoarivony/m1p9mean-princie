const express = require('express');
const mongoose = require('mongoose');
const { Utilisateur } = require('../models');
const {responseBuilder, tools} = require('../utils');
 const router = express.Router();

router.get('/', async function (req, res){
    try{
        const u = {};
        await u.save();
        res.json(responseBuilder.success(u._id));
    } catch(err){
        res.json(responseBuilder.error(err));
    }
});

 module.exports = router;