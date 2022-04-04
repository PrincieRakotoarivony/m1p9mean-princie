const express = require('express');
const {produitsService} = require('../services');
const {responseBuilder, tools} = require('../utils');
 const router = express.Router();

router.post('/', async function(req, res){
    produitsService
    .findProduits(req.body)
    .then((result) => {
        res.json(responseBuilder.success(result));
    })
    .catch((error) => {
        res.json(responseBuilder.error(error.message));
    })
});


module.exports = router;