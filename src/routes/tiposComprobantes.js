const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.post('/tiposcomprobantes',(req,res) => {
    const { Nombre, AfipComprobanteId, CodigoUNIX, DebeHaber, CodigoCtacte, CodigoIVA, CitiVentas, ServicioId } = req.body;
    
    const sqlInsert = `
            INSERT INTO tiposcomprobantes 
            VALUES
                (${Nombre},${AfipComprobanteId},${CodigoUNIX},${DebeHaber}
                ,${CodigoCtacte},${CodigoIVA},${CitiVentas},${ServicioId})`
    
    mysqlConnection.getConnection((err, db) => {
        if(err) console.log(err)

        else{
            db.query(sqlInsert,(error, rows, fields) => {
                if(!error){
                    res.json({msj: 'Registro tiposcomprobantes insertado exitosamente'});
                }else{
                    res.json({msj: 'No se ha podido insertar el registro tiposcomprobantes', errorMsj: error});
                }
            });
            db.release();
        }
    });
});

router.put('/tiposcomprobantes/:tipocomprobanteid',(req,res) => {
    const TipoComprobanteId = req.params.tipocomprobanteid;
    
    const { Nombre, AfipComprobanteId, CodigoUNIX, DebeHaber, CodigoCtacte, CodigoIVA, CitiVentas, ServicioId } = req.body;
    
    const sqlUpdate = `
                UPDATE tiposcomprobantes 
                SET 
                    Nombre=${Nombre}, AfipComprobanteId=${AfipComprobanteId}, 
                    CodigoUNIX=${CodigoUNIX}, DebeHaber=${DebeHaber}, CodigoCtacte=${CodigoCtacte}, CodigoIVA=${CodigoIVA}, 
                    CitiVentas=${CitiVentas}, ServicioId=${ServicioId}
                WHERE 
                    TipoComprobanteId=${TipoComprobanteId}`

    
    mysqlConnection.getConnection((err, db) => {
        if(err) console.log(err)

        else{
            db.query(sqlUpdate,(error, rows, fields) => {
                if(!error){
                    res.json({msj: 'Registro tiposcomprobantes modificado exitosamente'});
                }else{
                    res.json({msj: 'No se ha podido modificar el registro tiposcomprobantes', errorMsj: error});
                }
            });
            db.release();
        }
    });
});

module.exports = router;