const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/empresas',(req,res) => {

    const sqlSelect = `
                    SELECT 
                        * 
                    FROM 
                        empresas`

    mysqlConnection.getConnection((err, db) => {
        if(err) console.log(err)

        else{
            db.query(sqlSelect,(error, rows, fields) => {
                if(!error){
                    res.json(rows);
                }else{
                    res.json({msj: 'No se pudo realizar la consulta', errorMsj: error});
                }
            });
            db.release();
        }
    });
});

router.get('/empresas/:id',(req,res) => {

    const { id } = req.params;
    
    const sqlSelect = `
                    SELECT 
                        e.idempresa,
                        e.nombre,
                        e.imagenURL 
                    FROM 
                        empresas e INNER JOIN usuariosxempresas uxe ON e.idempresa = uxe.idEmpresa 
                    WHERE 
                        uxe.idUsuario = ?`;

    mysqlConnection.getConnection((err, db) => {
        if(err) console.log(err)
        
        else{
            db.query(sqlSelect,[id],(error, rows, fields) => {
                if(!error){
                    res.json(rows);
                }else{
                    res.json({msj: 'No se pudo realizar la consulta', errorMsj: error})
                }
            });
            db.release();
        }
    });
});
module.exports = router;