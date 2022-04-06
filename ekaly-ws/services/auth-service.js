const {dbconnect} = require('../utils');
const sha1 = require('sha1');
const moment = require('moment');

async function saveToken(db, utilisateur){
    var token = sha1(utilisateur._id + utilisateur.mdp + moment().format('YYYY-MM-DD HH:mm:ss.SSS'))
    var tokenCollection = db.collection('token');
    await tokenCollection.insertOne({
        id_utilisateur: utilisateur._id,
        token: token,
        date_expiration: moment().add(1, 'h').toDate()
    });
    return token;
}

async function login(nomUtilisateur, mdp){
    var db = await dbconnect.getDb();
    var uCollection = db.collection('utilisateur');
    var utilisateur = await uCollection.findOne({nomUtilisateur, mdp: sha1(mdp)});
    if(!utilisateur){
        throw new Error("nom d'utilisateur ou mot de passe invalide");
    }
    var token = await saveToken(db, utilisateur);
    var result = {
        token: token, 
        user: utilisateur
    };
    
    return result;
}

async function logout(token){
    var db = await dbconnect.getDb();
    var tokenCollection = db.collection('token'); 
    await tokenCollection.deleteOne({token: token});
}

async function findTokenUser(token){
    var db = await dbconnect.getDb();
    var tokenCollection = db.collection('token_utilisateur'); 
    var result = await tokenCollection.findOne({token: token, date_expiration: {$gte: new Date()}});
    if(!result) throw new Error("InvalidToken");
    return result;
}

module.exports = {login, logout, findTokenUser}