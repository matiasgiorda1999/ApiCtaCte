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
                        e.idempresa, e.CUIT, e.nombre, e.imagenURL, e.calle, e.numeroCalle, e.Localidad, 
                        ap.Nombre AS Provincia, 
                        apa.Nombre AS Pais, 
                        ar.Nombre AS Responsable, 
                        ib.Nombre AS IngBrutoCondicion
                        
                    FROM 
                        empresas e 
                        INNER JOIN usuariosxempresas uxe ON e.idempresa = uxe.idEmpresa 
                        INNER JOIN afipprovincias ap ON e.AFIPProvinciaId = ap.AfipProvinciaId
                        INNER JOIN afippaises apa ON e.AFIPPaisId = apa.AFIPPaisId
                        INNER JOIN afipresponsables ar ON e.AFIPResponsableId = ar.AfipResponsableId
                        INNER JOIN ingbrutoscondiciones ib ON e.AFIPIngBrutosId = ib.IngBrutosCondicionId
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