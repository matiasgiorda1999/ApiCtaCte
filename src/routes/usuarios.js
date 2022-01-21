const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/usuarios',(req,res) => {
    const{ nombre, contraseña} = req.query;
    
    const sqlQuery = `
                SELECT 
                    nombre 
                FROM 
                    usuarios 
                WHERE 
                    nombre=? AND contraseña=?`;

    mysqlConnection.query(sqlQuery,[nombre,contraseña],(error, rows, fields) => {
        if(!error){
            if(rows.length > 0){
                res.json({msj: 'Correcto'});
            }
            else{
                res.json({msj: 'Incorrecto'})
            }
        }else{
            res.json({msj: 'No se pudo realizar la consulta', errorMsj: error})
        }
    });
});

module.exports = router;
