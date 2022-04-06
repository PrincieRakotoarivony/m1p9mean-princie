function extractToken(authorization){
    if(!authorization) throw new Error("Pas d'autorisation");
    var token = authorization.substring('Bearer '.length);
    return token;
}

module.exports = {extractToken};