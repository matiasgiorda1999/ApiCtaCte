const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.post('/ctacte',(req,res) => {
    const { ClienteId, Fecha, NroAsiento, TipoComprobanteId, Importe, DH, Gravado, Alicuota, FVto, Cuota,
            Letra, Prefijo, Nro, Saldo, Cancelado, Detalle, Cotizacion, FCarga, Fpago, MovCajaId } = req.body;
    
    const sqlInsert = `
            INSERT INTO ctacte 
            VALUES
                (${ClienteId},${Fecha},${NroAsiento},${TipoComprobanteId},${Importe}
                ,${DH},${Gravado},${Alicuota},${FVto},${Cuota},${Letra},${Prefijo},${Nro},${Saldo}
                ,${Cancelado},${Detalle},${Cotizacion},${FCarga},${Fpago},${MovCajaId})`
    
    mysqlConnection.getConnection((err, db) => {
        if(err) console.log(err)

        else{
            db.query(sqlInsert,(error, rows, fields) => {
                if(!error){
                    res.json({msj: 'Registro ctacte insertado exitosamente'});
                }else{
                    res.json({msj: 'No se ha podido insertar el registro ctacte', errorMsj: error});
                }
            });
            db.release();
        }
    });
});

router.put('/ctacte/:ctacteid',(req,res) => {
    const CtaCteId = req.params.ctacteid;
    
    const { ClienteId, Fecha, NroAsiento, TipoComprobanteId, Importe, DH, Gravado, Alicuota, FVto, Cuota,
            Letra, Prefijo, Nro, Saldo, Cancelado, Detalle, Cotizacion, FCarga, Fpago, MovCajaId } = req.body;
    
    const sqlUpdate = `
                UPDATE ctacte 
                SET 
                    ClienteId=${ClienteId}, Fecha=${Fecha}, NroAsiento=${NroAsiento}, 
                    TipoComprobanteId=${TipoComprobanteId}, Importe=${Importe}, DH=${DH}, Gravado=${Gravado}, 
                    Alicuota=${Alicuota}, FVto=${FVto}, Cuota=${Cuota}, Letra=${Letra}, Prefijo=${Prefijo}, Nro=${Nro}, 
                    Saldo=${Saldo}, Cancelado=${Cancelado}, Detalle=${Detalle}, Cotizacion=${Cotizacion}, 
                    FCarga=${FCarga}, Fpago=${Fpago}, MovCajaId=${MovCajaId}
                WHERE 
                    CtaCteId=${CtaCteId}`
    
    mysqlConnection.getConnection((err, db) => {
        if(err) console.log(err)

        else{
            db.query(sqlUpdate,(error, rows, fields) => {
                if(!error){
                    res.json({msj: 'Registro ctacte modificado exitosamente'});
                }else{
                    res.json({msj: 'No se ha podido modificar el registro ctacte', errorMsj: error});
                }
            });
            db.release();
        }
    });
});

router.get('/ctacte',(req, res) => {
    
    const { fechaDesde, fechaHasta, idCliente } = req.query;

    const sqlSelect = `
            SELECT 
                CtaCte.Fecha,
                RTRIM( Case  WHEN LEFT(ctacte.detalle, 15) <> 'NUESTRA ENTREGA' AND LEFT(ctacte.detalle, 10) <> 'SU ENTREGA' AND ctacte.detalle <> '' and ctacte.detalle is not null THEN CTACTE.DETALLE ELSE TIPOSCOMPROBANTES.NOMBRE END) AS Detalle,
                ctacte.Letra as L, 
                Prefijo as Suc, 
                ctacte.Nro as Numero, 
                case when dh <> 0 then  importe  else null end AS Debe, 
                case when dh= 0 then  importe  else null end AS Haber, 0 as Saldo,  
                case when fvto > '${fechaHasta}' then fvto else null end AS Vencimiento,
                Case When fvto <= '${fechaHasta}' then 0 else 1 end AS Avencer,
                ctacteid,
                ctacte.TipoComprobanteId,  
                (Select sum(case when dh <> 0 then  importe else -importe  end ) from ctacte cc where cc.clienteid = ctacte.clienteid and (fecha < '${fechaDesde}' and (fvto < '${fechaDesde}' or fvto is null))   ) AS SaldoIni,
                Cancelado,
                fcarga as FCtaCte 
            FROM 
                CtaCte left join TiposComprobantes on CtaCte.TipoComprobanteId = TiposComprobantes.TipoComprobanteId  
                inner join clientes on ctacte.clienteid = clientes.clienteid 
            WHERE 
                ((fecha between '${fechaDesde}' and '${fechaHasta}') or (fecha < '${fechaDesde}' and fvto >= '${fechaDesde}'))  and ctacte.clienteid = ${idCliente} Order by 1,haber`

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
})
module.exports = router;