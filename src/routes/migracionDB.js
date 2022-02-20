const express = require('express');
const mysqlConnection = require('../database');
const router = express.Router();

router.post('/migracion',(req,res) => {

    let { clientes, ctactes, tiposcomprobantes, iuclientes, iuctactes, iutiposcomprobantes, empresa } = req.body;

    mysqlConnection.getConnection((err,db) => {
        if(err) {console.log(err)}
        else{
            db.beginTransaction((error) => {
                if(error) {
                    db.rollback(() => {
                        db.release();
                        return;
                    })
                }
                else{        
                    uploadClients(clientes, iuclientes, db, empresa)
                    .then(() => {
                        uploadTypeOfReceipts(tiposcomprobantes, iutiposcomprobantes, db, empresa)
                        .then(() => {
                            uploadCheckingAccount(ctactes, iuctactes, db, empresa)
                            .then(() => {
                                res.send('Migración realizada exitosamente');
                                db.commit();
                                db.release();
                            })
                        })
                    })
                    .catch((error) => {
                        console.log(error)
                        res.send('No se ha podido realizar la migración, por favor contactar con el responsable del sistema'); 
                        db.rollback();
                        db.release();
                    })
                }
            })
        }
    })
});



const uploadClients = (clientes, iuclientes, db, empresa) =>  {
    return new Promise((resolve, reject) => {
        const sqlInsertClient = `
                    INSERT INTO clientes
                        (NroCtaCte, Nombre, PersonaJuridica, CategoriaId, SeccionId, RubroId, Calle, Nro, Piso, 
                        Dpto, CodPostal, CPA, Localidad, AFIPProvinciaId, AFIPPaisId, Tel1, Tel2, Movil, Fax, Email, Web, 
                        NombreFantasia, RamoActividad, AntigFirma, Alquiler, AlquilerPorMes, AlquilerFVto, ContSocialF, 
                        ContSocialFInscrip, ContSocialFVto, Balance, BalanceF, LegalDom, LegalNro, LegalLocalidad, 
                        LegalProvinciaId, FAlta, Baja, FBaja, FUltimaModif, AFIPDocumentoId, NroDoc, AFIPResponsableId, 
                        CUIT, AFIPActividadId, IngBrutosCondicionId, IngBrutosConvenio, IngBrutosNro, IngBrutosJurisdiccionId, 
                        IBFVtoInscripcion, IngBrutosAlicuota0, GanaciasCondicionId, GanFVtoInscripcion, PjeExclusion, 
                        BoletinExclusion, CodImpuestoId, FVtoExclusion, RgRegimenId, CreditoInic, CreditoAutorizo1, CreditoF1, 
                        CreditoModif1, CreditoAutorizo2, CreditoF2, CreditoModif2, CreditoAutorizo3, CreditoF3, ONCCADomicilioId, 
                        InscriptoRFOGL, ONCCADerechoRegId, ONCCAActividadId, ONCCANroOperador, ONCCAClasificacionId, ListaPrecioId, 
                        FormaPagoId, ValoresA, VendedorId, VendAutorizo, VendF, CalculaInt, MercStock, MercPesos, Instalaciones, 
                        InstalPesos, BienesTestimonio, BienesPropiedad, BienesHipoteca, Rodados, Marca1, Modelo1, Dominio1, Marca2, 
                        Modelo2, Dominio2, Marca3, Modelo3, Dominio3, CodPresupuestarioId, Observaciones, cai, SubListaPrecioId, 
                        CobradorId, SisaScoringId, ContabilidadCostos, IngBrutosAlicuota, CUITExpo, ClienteId, EmpresaId) 
                    VALUES
                        (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,
                        ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,
                        ?,?,?)`;

        const sqlUpdateClient = `
            UPDATE clientes 
            SET 
                NroCtaCte=?, Nombre=?, PersonaJuridica=?, CategoriaId=?, SeccionId=?, RubroId=?, Calle=?, Nro=?, Piso=?, 
                Dpto=?, CodPostal=?, CPA=?, Localidad=?, AFIPProvinciaId=?, AFIPPaisId=?, Tel1=?, Tel2=?, Movil=?, Fax=?, 
                Email= ?, Web= ?, NombreFantasia= ?, RamoActividad= ?, AntigFirma= ?, Alquiler= ?, AlquilerPorMes= ?, 
                AlquilerFVto= ?, ContSocialF= ?, ContSocialFInscrip= ?, ContSocialFVto= ?, Balance= ?, BalanceF= ?, LegalDom= ?, 
                LegalNro= ?, LegalLocalidad= ?, LegalProvinciaId= ?, FAlta= ?,Baja= ?, FBaja= ?, FUltimaModif= ?, AFIPDocumentoId= ?, 
                NroDoc= ?, AFIPResponsableId= ?, CUIT= ?, AFIPActividadId= ?, IngBrutosCondicionId= ?, IngBrutosConvenio= ?, 
                IngBrutosNro= ?, IngBrutosJurisdiccionId= ?, IBFVtoInscripcion= ?, IngBrutosAlicuota0= ?, 
                GanaciasCondicionId= ?, GanFVtoInscripcion= ?, PjeExclusion= ?, BoletinExclusion= ?, CodImpuestoId= ?, 
                FVtoExclusion= ?, RgRegimenId= ?, CreditoInic= ?, CreditoAutorizo1= ?, CreditoF1= ?, CreditoModif1= ?, 
                CreditoAutorizo2= ?, CreditoF2= ?, CreditoModif2= ?, CreditoAutorizo3= ?, CreditoF3= ?, ONCCADomicilioId= ?, 
                InscriptoRFOGL= ?, ONCCADerechoRegId= ?, ONCCAActividadId= ?, ONCCANroOperador= ?, ONCCAClasificacionId= ?, 
                ListaPrecioId= ?, FormaPagoId= ?, ValoresA= ?, VendedorId= ?, VendAutorizo= ?, VendF= ?, CalculaInt= ?, MercStock= ?, 
                MercPesos= ?, Instalaciones= ?, InstalPesos= ?, BienesTestimonio= ?, BienesPropiedad= ?, BienesHipoteca=?, 
                Rodados=?, Marca1=?, Modelo1=?, Dominio1=?, Marca2=?, Modelo2=?, Dominio2=?, Marca3=?, Modelo3=?, Dominio3=?, 
                CodPresupuestarioId=?, Observaciones=?, cai=?, SubListaPrecioId=?, CobradorId=?, SisaScoringId=?, 
                ContabilidadCostos=?, IngBrutosAlicuota=?, CUITExpo=?
            WHERE 
                ClienteId= ? AND EmpresaId= ?`;

        let errorInSubmit = false;

        if(iuclientes.length === 0) resolve();

        iuclientes.forEach((iu,i) => {
            let {NroCtaCte, Nombre, PersonaJuridica, CategoriaId, SeccionId, RubroId, Calle, Nro, Piso, 
                Dpto, CodPostal, CPA, Localidad, AFIPProvinciaId, AFIPPaisId, Tel1, Tel2, Movil, Fax, Email, Web, 
                NombreFantasia, RamoActividad, AntigFirma, Alquiler, AlquilerPorMes, AlquilerFVto, ContSocialF, 
                ContSocialFInscrip, ContSocialFVto, Balance, BalanceF, LegalDom, LegalNro, LegalLocalidad, 
                LegalProvinciaId, FAlta, Baja, FBaja, FUltimaModif, AFIPDocumentoId, NroDoc, AFIPResponsableId, 
                CUIT, AFIPActividadId, IngBrutosCondicionId, IngBrutosConvenio, IngBrutosNro, IngBrutosJurisdiccionId, 
                IBFVtoInscripcion, IngBrutosAlicuota0, GanaciasCondicionId, GanFVtoInscripcion, PjeExclusion, 
                BoletinExclusion, CodImpuestoId, FVtoExclusion, RgRegimenId, CreditoInic, CreditoAutorizo1, CreditoF1, 
                CreditoModif1, CreditoAutorizo2, CreditoF2, CreditoModif2, CreditoAutorizo3, CreditoF3, ONCCADomicilioId, 
                InscriptoRFOGL, ONCCADerechoRegId, ONCCAActividadId, ONCCANroOperador, ONCCAClasificacionId, ListaPrecioId, 
                FormaPagoId, ValoresA, VendedorId, VendAutorizo, VendF, CalculaInt, MercStock, MercPesos, Instalaciones, 
                InstalPesos, BienesTestimonio, BienesPropiedad, BienesHipoteca, Rodados, Marca1, Modelo1, Dominio1, Marca2, 
                Modelo2, Dominio2, Marca3, Modelo3, Dominio3, CodPresupuestarioId, Observaciones, cai, SubListaPrecioId, 
                CobradorId, SisaScoringId, ContabilidadCostos, IngBrutosAlicuota, CUITExpo, ClienteId } = JSON.parse(clientes[i]);
            db.query(iu?sqlInsertClient:sqlUpdateClient,
                [ NroCtaCte, Nombre, PersonaJuridica, CategoriaId, SeccionId, RubroId, Calle, Nro, Piso, 
                Dpto, CodPostal, CPA, Localidad, AFIPProvinciaId, AFIPPaisId, Tel1, Tel2, Movil, Fax, Email, Web, 
                NombreFantasia, RamoActividad, AntigFirma, Alquiler, AlquilerPorMes, AlquilerFVto, ContSocialF, 
                ContSocialFInscrip, ContSocialFVto, Balance, BalanceF, LegalDom, LegalNro, LegalLocalidad, 
                LegalProvinciaId, FAlta, Baja, FBaja, FUltimaModif, AFIPDocumentoId, NroDoc, AFIPResponsableId, 
                CUIT, AFIPActividadId, IngBrutosCondicionId, IngBrutosConvenio, IngBrutosNro, IngBrutosJurisdiccionId, 
                IBFVtoInscripcion, IngBrutosAlicuota0, GanaciasCondicionId, GanFVtoInscripcion, PjeExclusion, 
                BoletinExclusion, CodImpuestoId, FVtoExclusion, RgRegimenId, CreditoInic, CreditoAutorizo1, CreditoF1, 
                CreditoModif1, CreditoAutorizo2, CreditoF2, CreditoModif2, CreditoAutorizo3, CreditoF3, ONCCADomicilioId, 
                InscriptoRFOGL, ONCCADerechoRegId, ONCCAActividadId, ONCCANroOperador, ONCCAClasificacionId, ListaPrecioId, 
                FormaPagoId, ValoresA, VendedorId, VendAutorizo, VendF, CalculaInt, MercStock, MercPesos, Instalaciones, 
                InstalPesos, BienesTestimonio, BienesPropiedad, BienesHipoteca, Rodados, Marca1, Modelo1, Dominio1, Marca2, 
                Modelo2, Dominio2, Marca3, Modelo3, Dominio3, CodPresupuestarioId, Observaciones, cai, SubListaPrecioId, 
                CobradorId,SisaScoringId, ContabilidadCostos, IngBrutosAlicuota, CUITExpo, ClienteId, empresa]
                ,(error, rows, fileds) => {
                    if(error){
                        errorInSubmit = true;
                    }
                    if(i === iuclientes.length - 1){
                        if(!errorInSubmit){
                            resolve();
                        }else{
                            reject(error);
                        }
                    }
                })
        });
    });
}

const uploadTypeOfReceipts = (tiposcomprobantes, iutiposcomprobantes, db, empresa) => {
    return new Promise((resolve,reject) => {
        const sqlInsertTypeOfReceipts = `INSERT INTO tiposcomprobantes (Nombre, AfipComprobanteId, CodigoUNIX, DebeHaber, CodigoCtacte,
                                         CodigoIVA, CitiVentas, codigoTipo, EntidadId, NombreAbreviado, Tiponumerador, mueveStock, usaEscaner, 
                                         usaFacturaElectronica, TipoComprobanteId, EmpresaId) 
                                        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        const sqlUpdateTypeOfReceipts = `UPDATE tiposcomprobantes 
                                        SET 
                                            Nombre=?, AfipComprobanteId=?, CodigoUNIX=?, DebeHaber=?, CodigoCtacte=?, 
                                            CodigoIVA=?, CitiVentas=?, codigoTipo=?, EntidadId=?, NombreAbreviado=?, Tiponumerador=?, 
                                            mueveStock=?, usaEscaner=?, usaFacturaElectronica=?
                                        WHERE 
                                            TipoComprobanteId=? AND EmpresaId=?`;
                    
        let errorInSubmit = false;    
    
        if(iutiposcomprobantes.length === 0) resolve();
        
        iutiposcomprobantes.forEach((iu,i) => {
            let {TipoComprobanteId, Nombre, AfipComprobanteId, CodigoUNIX, DebeHaber, CodigoCtacte, CodigoIVA,
                 CitiVentas, codigoTipo, EntidadId, NombreAbreviado, Tiponumerador, mueveStock, usaEscaner, 
                 usaFacturaElectronica } = JSON.parse(tiposcomprobantes[i]);
                        
            db.query(iu?sqlInsertTypeOfReceipts:sqlUpdateTypeOfReceipts,
                [Nombre, AfipComprobanteId, CodigoUNIX, DebeHaber, CodigoCtacte, CodigoIVA, 
                CitiVentas, codigoTipo, EntidadId, NombreAbreviado, Tiponumerador, mueveStock, 
                usaEscaner, usaFacturaElectronica, TipoComprobanteId, empresa], 
                (error, rows, fields) => {
                    if(error) {
                            errorInSubmit = true;
                        }
                    if( i === iutiposcomprobantes.length - 1){
                        if(!errorInSubmit){
                            resolve();
                        }else{
                            reject(error);
                        }
                    }
            });
        });
    });
}

const uploadCheckingAccount = (ctactes, iuctactes, db, empresa) => {
    return new Promise((resolve, reject) => {
        const sqlInsertCtaCte = `INSERT INTO ctacte(ClienteId, Fecha, NroAsiento, TipoComprobanteId, Importe, DH, Gravado, Alicuota, 
            FVto, Cuota, Letra, Prefijo, Nro, Saldo, Cancelado, Detalle, Cotizacion, FCarga, CuentaContableID, 
            cierreMensual, Tieneimagen, FAplica, CtaCteId, EmpresaId) 
                    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        const sqlUpdateCtaCte = `UPDATE ctacte 
                            SET 
                                ClienteId=?, Fecha=?, NroAsiento=?, 
                                TipoComprobanteId=?, Importe=?, DH=?, Gravado=?, 
                                Alicuota=?, FVto=?, Cuota=?, Letra=?, Prefijo=?, Nro=?, 
                                Saldo=?, Cancelado=?, Detalle=?, Cotizacion=?, 
                                FCarga=?, CuentaContableID=?, cierreMensual=?, Tieneimagen=?, FAplica=?
                            WHERE 
                                CtaCteId=? AND EmpresaId=?`;

        let errorInSubmit = false;
        
        if(iuctactes.length === 0) resolve();

        iuctactes.forEach((iu,i) => {
            let {ClienteId, Fecha, NroAsiento, TipoComprobanteId, Importe, DH, Gravado, Alicuota, FVto, Cuota, Letra, 
                Prefijo, Nro, Saldo, Cancelado, Detalle, Cotizacion, FCarga, CuentaContableID, cierreMensual, Tieneimagen, FAplica, CtaCteId} = JSON.parse(ctactes[i]);

            db.query(iu?sqlInsertCtaCte:sqlUpdateCtaCte,
                [ClienteId, Fecha, NroAsiento, TipoComprobanteId, Importe, DH, Gravado, Alicuota, FVto, Cuota, Letra, 
                Prefijo, Nro, Saldo, Cancelado, Detalle, Cotizacion, FCarga, CuentaContableID, cierreMensual, Tieneimagen, FAplica, CtaCteId, empresa],
                (error, rows, fields) => {
                    if(error) {
                        errorInSubmit = true;
                    }
                    if(i === iuctactes.length - 1){
                        if(!errorInSubmit){
                            resolve();
                        }else{
                            reject(error);
                        }
                    }
                })
        });
    });
}

module.exports = router;