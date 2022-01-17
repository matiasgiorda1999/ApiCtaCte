const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.post('/ctacte',(req,res) => {
    const { ClienteId, Fecha, NroAsiento, TipoComprobanteId, Importe, DH, Gravado, Alicuota, FVto, Cuota,
            Letra, Prefijo, Nro, Saldo, Cancelado, Detalle, Cotizacion, FCarga, Fpago, MovCajaId } = req.body;
    
    const sqlQuery = `INSERT INTO ctacte VALUES(${ClienteId},${Fecha},${NroAsiento},${TipoComprobanteId},${Importe}
                        ,${DH},${Gravado},${Alicuota},${FVto},${Cuota},${Letra},${Prefijo},${Nro},${Saldo}
                        ,${Cancelado},${Detalle},${Cotizacion},${FCarga},${Fpago},${MovCajaId})`
    
    mysqlConnection.query(sqlQuery,(error, rows, fields) => {
        if(!error){
            res.json({msj: 'Registro ctacte insertado exitosamente'});
        }else{
            res.json({msj: 'No se ha podido insertar el registro ctacte', errorMsj: error})
        }
    });
});

router.put('/ctacte/:ctacteid',(req,res) => {
    const CtaCteId = req.params.ctacteid;
    
    const { ClienteId, Fecha, NroAsiento, TipoComprobanteId, Importe, DH, Gravado, Alicuota, FVto, Cuota,
            Letra, Prefijo, Nro, Saldo, Cancelado, Detalle, Cotizacion, FCarga, Fpago, MovCajaId } = req.body;
    
    const sqlQuery = `UPDATE ctacte SET ClienteId=${ClienteId}, Fecha=${Fecha}, NroAsiento=${NroAsiento}, 
                TipoComprobanteId=${TipoComprobanteId}, Importe=${Importe}, DH=${DH}, Gravado=${Gravado}, 
                Alicuota=${Alicuota}, FVto=${FVto}, Cuota=${Cuota}, Letra=${Letra}, Prefijo=${Prefijo}, Nro=${Nro}, 
                Saldo=${Saldo}, Cancelado=${Cancelado}, Detalle=${Detalle}, Cotizacion=${Cotizacion}, 
                FCarga=${FCarga}, Fpago=${Fpago}, MovCajaId=${MovCajaId}
                WHERE CtaCteId=${CtaCteId}`
    
    mysqlConnection.query(sqlQuery,(error, rows, fields) => {
        if(!error){
            res.json({msj: 'Registro ctacte modificado exitosamente'});
        }else{
            res.json({msj: 'No se ha podido modificar el registro ctacte', errorMsj: error})
        }
    });
});

module.exports = router;