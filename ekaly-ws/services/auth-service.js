const {dbconnect} = require('../utils');
const sha1 = require('sha1');
const moment = require('moment');

async function saveToken(db, utilisateur){
    const token = sha1(utilisateur._id + utilisateur.mdp + moment().format('YYYY-MM-DD HH:mm:ss.SSS'))
    const tokenCollection = db.collection('token');
    await tokenCollection.insertOne({
        id_utilisateur: utilisateur._id,
        token: token,
        date_expiration: moment().add(1, 'h').toDate()
    });
    utilisateur.token = token;
}

async function login(nomUtilisateur, mdp){
    const db = await dbconnect.getDb();
    const uCollection = db.collection('utilisateur');
    const result = await uCollection.findOne({nomUtilisateur, mdp: sha1(mdp)});
    if(result === null){
        throw new Error("nom d'utilisateur ou mot de passe invalide");
    }
    await saveToken(db, result);
    return result;
}


module.exports = {login}