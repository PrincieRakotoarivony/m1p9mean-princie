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

module.exports = {extractToken, parseMoment};