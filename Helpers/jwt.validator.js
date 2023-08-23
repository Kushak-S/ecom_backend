const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
    sign_jwt: (payload)=>{
        return jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '3d'});
    },

    verify_jwt: (req, res, next)=>{
        const auth_token = req.headers.authorization;
        if(!auth_token) return res.status(401).send('Access denied!');
        const token = auth_token.split(' ')[1];
        try{
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload)=>{
                if(err) return res.status(400).send('Invalid token!');
                req.user = payload;
                next();
            });
        }catch(err){
            res.status(400).send('Invalid token!');
        }
    },

    verify_user: (req, res, next)=>{
        module.exports.verify_jwt(req, res, ()=>{
            if(req.user.id === req.params.uid) next();
            else return res.status(401).send('Access denied!');
        });
    },

    verify_admin: (req, res, next)=>{
        module.exports.verify_user(req, res, ()=>{
            if(req.user.isAdmin) next();
            else return res.status(401).send('Access denied!');
        });
    },
}