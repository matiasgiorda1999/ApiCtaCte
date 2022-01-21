const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/empresas',(req,res) => {

    const sqlQuery = `
                    SELECT 
                        * 
                    FROM 
                        empresas`

    mysqlConnection.query(sqlQuery,(error, rows, fields) => {
        if(!error){
            res.json(rows);
        }else{
            res.json({msj: 'No se pudo realizar la consulta', errorMsj: error})
        }
    });
});

router.get('/empresas/:id',(req,res) => {

    const { id } = req.params;
    
    const sqlQuery = `
                    SELECT 
                        e.idempresa,
                        e.nombre,
                        e.imagenURL 
                    FROM 
                        empresas e INNER JOIN usuariosxempresas uxe ON e.idempresa = uxe.idEmpresa 
                    WHERE 
                        uxe.idUsuario = ?`;

    mysqlConnection.query(sqlQuery,[id],(error, rows, fields) => {
        if(!error){
            res.json(rows);
        }else{
            res.json({msj: 'No se pudo realizar la consulta', errorMsj: error})
        }
    });
});
module.exports = router;