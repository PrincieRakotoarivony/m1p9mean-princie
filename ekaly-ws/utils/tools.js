const moment = require('moment');

function extractToken(authorization){
    if(!authorization) throw new Error("Pas d'autorisation");
    var token = authorization.substring('Bearer '.length);
    return token;
}

function parseMoment(dateStr){
    const m = moment(dateStr).toDate();
    return m;
}

function generateRandomDigit(){
    return Math.floor(Math.random()*10);
}

function generateRandomCode(n){
    var code = "";
    for(let i=0; i<n; i++){
        code += generateRandomDigit();
    }
    return code;
}
module.exports = {extractToken, parseMoment, generateRandomCode};