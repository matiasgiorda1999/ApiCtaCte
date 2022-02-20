const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.get('/ctacte',(req, res) => {
    
    const { fechaDesde, fechaHasta, idCliente } = req.query;

    const sqlSelect = `
            SELECT 
                CtaCte.Fecha,
                RTRIM( Case  WHEN LEFT(ctacte.detalle, 15) <> 'NUESTRA ENTREGA' AND LEFT(ctacte.detalle, 10) <> 'SU ENTREGA' AND ctacte.detalle <> '' and ctacte.detalle is not null THEN CTACTE.DETALLE ELSE TIPOSCOMPROBANTES.NOMBRE END) AS Detalle,
                ctacte.Letra as Letra, 
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
                fcarga as FCtaCte,                
                AFIPPaises.Nombre as Pais,
                AFIPProvincias.Nombre as Provincia,
                AFIPresponsables.Nombre as Responsable,
                ingbrutoscondiciones.Nombre as IngBrutoCondicion 
            FROM 
                CtaCte left join TiposComprobantes on CtaCte.TipoComprobanteId = TiposComprobantes.TipoComprobanteId  
                inner join clientes on ctacte.clienteid = clientes.clienteid
                left join AFIPPaises on clientes.AFIPPaisId = AFIPPaises.AFIPPaisId
                left join AFIPProvincias on clientes.AFIPProvinciaId = AFIPProvincias.AfipProvinciaId
                left join AFIPresponsables on clientes.AFIPResponsableId = AFIPresponsables.AfipResponsableId
                left join ingbrutoscondiciones on clientes.IngBrutosCondicionId = ingbrutoscondiciones.IngBrutosCondicionId 
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