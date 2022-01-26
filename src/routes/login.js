const express = require('express');
const jwt = require('jsonwebtoken');
const mysqlConnection = require('../database');
const router = express.Router();

router.post('/login',(req,res) => {

    const {email, password} = req.body;

    const sqlSelect = `
            SELECT 
                *
            FROM
                usuarios
            WHERE
                email=?
                AND contrasena=?`;
    let user;

    mysqlConnection.getConnection((err,db) => {
        if(err) console.log(err)

        else{
            db.query(sqlSelect,[email, password], (error, rows, fields) => {
                if(!error){
                    if(rows.length !== 0){
                        user = rows[0]
                        if(user){
                            jwt.sign({user: user}, 'secretKey', (err, token) => {
                                res.json({
                                    token: token
                                })
                            });
                        }
                    }else{
                        res.json({msj: 'Usuario inexistente'})
                    }
                }else{
                    res.json({msj: 'No se pudo realizar la consulta', errorMsj: error});
                }
            });
        }
        db.release();
    });
});

module.exports = router;