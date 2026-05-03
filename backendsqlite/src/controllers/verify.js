const status = require('http-status')
const userModel = require('../models/users.js')
const has = require('has-keys')
const CodeError = require('../util/CodeError.js')
const bcrypt = require('bcrypt')
const jws = require('jws')
require('mandatoryenv').load(['TOKENSECRET'])
const { TOKENSECRET } = process.env


module.exports = {
    async verifyToken(req, res, next){
        if (!has(req.headers, ['x-access-token'])) throw new CodeError('Token is required', status.FORBIDDEN)
        const token = req.headers['x-access-token']
        const decodedToken = jws.decode(token);
        if (!decodedToken) {
            throw new CodeError('Invalid token', status.UNAUTHORIZED);
        }
        // Verify the signature of the token using the secret key
        const isValid = jws.verify(token, 'HS256', TOKENSECRET);
        if (!isValid) {
            throw new CodeError('Invalid token signature', status.UNAUTHORIZED);
        }
        const {payload} = decodedToken;
        const user = await userModel.findOne({where: {email: payload}});
        if (!user) {
            throw new CodeError('User not found', status.NOT_FOUND);
        }
        //const user = await getUser(checkToken(token));
        if (!user) {throw new CodeError('User not found', status.FORBIDDEN)}
        req.user = user;
        req.login = decodedToken;
        next();
    },
    async verifyAdmin(req,res,next){
        // Code vérifiant que le login est admin (présent si une fonction middleware
        // a au préalable ajouté le login dans req)
        if (!req.user.isAdmin)
          // Provoque une réponse en erreur avec un code de retour 403 
          throw new CodeError ('User is not an admin', status.FORBIDDEN);
        // On appelle la fonction middleware suivante que si la condition est vérifiée
        next()
      },
    async verifyGroupes(req,res,next) {
        next();
    }
}