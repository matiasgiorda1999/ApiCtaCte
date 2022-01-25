const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

router.post('/clientes',(req,res) => {
    const { NroCtaCte, Nombre, PersonaJuridica, CategoriaId, SeccionId, RubroId, Calle, Nro, Piso, Dpto, CodPostal, CPA, 
        Localidad, AFIPProvinciaId, AFIPPaisId, Tel1, Tel2, Movil, Fax, Email, Web, NombreFantasia, RamoActividad, AntigFirma, 
        Alquiler, AlquilerPorMes, AlquilerFVto, ContSocialF, ContSocialFInscrip, ContSocialFVto, Balance, BalanceF, LegalDom, 
        LegalNro, LegalLocalidad, LegalProvinciaId, FAlta, Baja, FBaja, FUltimaModif, AFIPDocumentoId, NroDoc, AFIPResponsableId, 
        CUIT, AFIPActividadId, IngBrutosCondicionId, IngBrutosConvenio, IngBrutosNro, IngBrutosJurisdiccionId, IBFVtoInscripcion, 
        IngBrutosAlicuota0, GanaciasCondicionId, GanFVtoInscripcion, PjeExclusion, BoletinExclusion, CodImpuestoId, FVtoExclusion, 
        RgRegimenId, CreditoInic, CreditoAutorizo1, CreditoF1, CreditoModif1, CreditoAutorizo2, CreditoF2, CreditoModif2, 
        CreditoAutorizo3, CreditoF3, ONCCADomicilioId, InscriptoRFOGL, ONCCADerechoRegId, ONCCAActividadId, ONCCANroOperador, 
        ONCCAClasificacionId, ListaPrecioId, FormaPagoId, ValoresA, VendedorId, VendAutorizo, VendF, CalculaInt, MercStock, 
        MercPesos, Instalaciones, InstalPesos, BienesTestimonio, BienesPropiedad, BienesHipoteca, Rodados, Marca1, Modelo1, 
        Dominio1, Marca2, Modelo2, Dominio2, Marca3, Modelo3, Dominio3, CodPresupuestarioId, Observaciones, cai, SubListaPrecioId, 
        CobradorId } = req.body;
    
    const sqlInsert = `
                INSERT INTO clientes 
                VALUES 
                    (${NroCtaCte}, ${Nombre}, ${PersonaJuridica}, ${CategoriaId}, ${SeccionId}, 
                    ${RubroId}, ${Calle}, ${Nro}, ${Piso}, ${Dpto}, ${CodPostal}, ${CPA}, ${Localidad}, ${AFIPProvinciaId}, 
                    ${AFIPPaisId}, ${Tel1}, ${Tel2}, ${Movil}, ${Fax}, ${Email}, ${Web}, ${NombreFantasia}, ${RamoActividad}, 
                    ${AntigFirma}, ${Alquiler}, ${AlquilerPorMes}, ${AlquilerFVto}, ${ContSocialF}, ${ContSocialFInscrip}, 
                    ${ContSocialFVto}, ${Balance}, ${BalanceF}, ${LegalDom}, ${LegalNro}, ${LegalLocalidad}, ${LegalProvinciaId}, 
                    ${FAlta}, ${Baja}, ${FBaja}, ${FUltimaModif}, ${AFIPDocumentoId}, ${NroDoc}, ${AFIPResponsableId}, ${CUIT}, 
                    ${AFIPActividadId}, ${IngBrutosCondicionId}, ${IngBrutosConvenio}, ${IngBrutosNro}, ${IngBrutosJurisdiccionId}, 
                    ${IBFVtoInscripcion}, ${IngBrutosAlicuota0}, ${GanaciasCondicionId}, ${GanFVtoInscripcion}, ${PjeExclusion}, 
                    ${BoletinExclusion}, ${CodImpuestoId}, ${FVtoExclusion}, ${RgRegimenId}, ${CreditoInic}, ${CreditoAutorizo1}, 
                    ${CreditoF1}, ${CreditoModif1}, ${CreditoAutorizo2}, ${CreditoF2}, ${CreditoModif2}, ${CreditoAutorizo3}, 
                    ${CreditoF3}, ${ONCCADomicilioId}, ${InscriptoRFOGL}, ${ONCCADerechoRegId}, ${ONCCAActividadId}, ${ONCCANroOperador}, 
                    ${ONCCAClasificacionId}, ${ListaPrecioId}, ${FormaPagoId}, ${ValoresA}, ${VendedorId}, ${VendAutorizo}, ${VendF}, 
                    ${CalculaInt}, ${MercStock}, ${MercPesos}, ${Instalaciones}, ${InstalPesos}, ${BienesTestimonio}, ${BienesPropiedad}, 
                    ${BienesHipoteca}, ${Rodados}, ${Marca1}, ${Modelo1}, ${Dominio1}, ${Marca2}, ${Modelo2}, ${Dominio2}, ${Marca3}, 
                    ${Modelo3}, ${Dominio3}, ${CodPresupuestarioId}, ${Observaciones}, ${cai}, ${SubListaPrecioId}, ${CobradorId})`
    
    mysqlConnection.getConnection((err, db) => {
        if(err) console.log(err)
        else{
            db.query(sqlInsert,(error, rows, fields) => {
                if(!error){
                    res.json({msj: 'Registro cliente insertado exitosamente'});
                }else{
                    res.json({msj: 'No se ha podido insertar el registro cliente', errorMsj: error});
                }
            });
            db.release();
        }
    });
});

router.put('/clientes/:clienteid',(req,res) => {
    const ClienteId = req.params.clienteid;
    
    const { NroCtaCte, Nombre, PersonaJuridica, CategoriaId, SeccionId, RubroId, Calle, Nro, Piso, Dpto, CodPostal, CPA, 
        Localidad, AFIPProvinciaId, AFIPPaisId, Tel1, Tel2, Movil, Fax, Email, Web, NombreFantasia, RamoActividad, AntigFirma, 
        Alquiler, AlquilerPorMes, AlquilerFVto, ContSocialF, ContSocialFInscrip, ContSocialFVto, Balance, BalanceF, LegalDom, 
        LegalNro, LegalLocalidad, LegalProvinciaId, FAlta, Baja, FBaja, FUltimaModif, AFIPDocumentoId, NroDoc, AFIPResponsableId, 
        CUIT, AFIPActividadId, IngBrutosCondicionId, IngBrutosConvenio, IngBrutosNro, IngBrutosJurisdiccionId, IBFVtoInscripcion, 
        IngBrutosAlicuota0, GanaciasCondicionId, GanFVtoInscripcion, PjeExclusion, BoletinExclusion, CodImpuestoId, FVtoExclusion, 
        RgRegimenId, CreditoInic, CreditoAutorizo1, CreditoF1, CreditoModif1, CreditoAutorizo2, CreditoF2, CreditoModif2, 
        CreditoAutorizo3, CreditoF3, ONCCADomicilioId, InscriptoRFOGL, ONCCADerechoRegId, ONCCAActividadId, ONCCANroOperador, 
        ONCCAClasificacionId, ListaPrecioId, FormaPagoId, ValoresA, VendedorId, VendAutorizo, VendF, CalculaInt, MercStock, 
        MercPesos, Instalaciones, InstalPesos, BienesTestimonio, BienesPropiedad, BienesHipoteca, Rodados, Marca1, Modelo1, 
        Dominio1, Marca2, Modelo2, Dominio2, Marca3, Modelo3, Dominio3, CodPresupuestarioId, Observaciones, cai, SubListaPrecioId, 
        CobradorId } = req.body;
    
    const sqlUpdate = `
                    UPDATE clientes 
                    SET 
                        NroCtaCte=${NroCtaCte}, Nombre=${Nombre}, PersonaJuridica=${PersonaJuridica}, 
                        CategoriaId=${CategoriaId}, SeccionId=${SeccionId}, RubroId=${RubroId}, Calle=${Calle}, Nro=${Nro}, 
                        Piso=${Piso}, Dpto=${Dpto}, CodPostal=${CodPostal}, CPA=${CPA}, Localidad=${Localidad}, 
                        AFIPProvinciaId=${AFIPProvinciaId}, AFIPPaisId=${AFIPPaisId}, Tel1=${Tel1}, Tel2=${Tel2}, Movil=${Movil}, 
                        Fax=${Fax}, Email= ${Email}, Web= ${Web}, NombreFantasia= ${NombreFantasia}, RamoActividad= ${RamoActividad}, 
                        AntigFirma= ${AntigFirma}, Alquiler= ${Alquiler}, AlquilerPorMes= ${AlquilerPorMes}, 
                        AlquilerFVto= ${AlquilerFVto}, ContSocialF= ${ContSocialF}, ContSocialFInscrip= ${ContSocialFInscrip}, 
                        ContSocialFVto= ${ContSocialFVto}, Balance= ${Balance}, BalanceF= ${BalanceF}, LegalDom= ${LegalDom}, 
                        LegalNro= ${LegalNro}, LegalLocalidad= ${LegalLocalidad}, LegalProvinciaId= ${LegalProvinciaId}, FAlta= ${FAlta},
                        Baja= ${Baja}, FBaja= ${FBaja}, FUltimaModif= ${FUltimaModif}, AFIPDocumentoId= ${AFIPDocumentoId}, 
                        NroDoc= ${NroDoc}, AFIPResponsableId= ${AFIPResponsableId}, CUIT= ${CUIT}, AFIPActividadId= ${AFIPActividadId}, 
                        IngBrutosCondicionId= ${IngBrutosCondicionId}, IngBrutosConvenio= ${IngBrutosConvenio}, 
                        IngBrutosNro= ${IngBrutosNro}, IngBrutosJurisdiccionId= ${IngBrutosJurisdiccionId}, 
                        IBFVtoInscripcion= ${IBFVtoInscripcion}, IngBrutosAlicuota0= ${IngBrutosAlicuota0}, 
                        GanaciasCondicionId= ${GanaciasCondicionId}, GanFVtoInscripcion= ${GanFVtoInscripcion}, 
                        PjeExclusion= ${PjeExclusion}, BoletinExclusion= ${BoletinExclusion}, CodImpuestoId= ${CodImpuestoId}, 
                        FVtoExclusion= ${FVtoExclusion}, RgRegimenId= ${RgRegimenId}, CreditoInic= ${CreditoInic}, 
                        CreditoAutorizo1= ${CreditoAutorizo1}, CreditoF1= ${CreditoF1}, CreditoModif1= ${CreditoModif1}, 
                        CreditoAutorizo2= ${CreditoAutorizo2}, CreditoF2= ${CreditoF2}, CreditoModif2= ${CreditoModif2}, 
                        CreditoAutorizo3= ${CreditoAutorizo3}, CreditoF3= ${CreditoF3}, ONCCADomicilioId= ${ONCCADomicilioId}, 
                        InscriptoRFOGL= ${InscriptoRFOGL}, ONCCADerechoRegId= ${ONCCADerechoRegId}, ONCCAActividadId= ${ONCCAActividadId}, 
                        ONCCANroOperador= ${ONCCANroOperador}, ONCCAClasificacionId= ${ONCCAClasificacionId}, 
                        ListaPrecioId= ${ListaPrecioId}, FormaPagoId= ${FormaPagoId}, ValoresA= ${ValoresA}, VendedorId= ${VendedorId}, 
                        VendAutorizo= ${VendAutorizo}, VendF= ${VendF}, CalculaInt= ${CalculaInt}, MercStock= ${MercStock}, 
                        MercPesos= ${MercPesos}, Instalaciones= ${Instalaciones}, InstalPesos= ${InstalPesos}, 
                        BienesTestimonio= ${BienesTestimonio}, BienesPropiedad= ${BienesPropiedad}, BienesHipoteca=${BienesHipoteca}, 
                        Rodados=${Rodados}, Marca1=${Marca1}, Modelo1=${Modelo1}, Dominio1=${Dominio1}, Marca2=${Marca2}, 
                        Modelo2=${Modelo2}, Dominio2=${Dominio2}, Marca3=${Marca3}, Modelo3=${Modelo3}, Dominio3=${Dominio3}, 
                        CodPresupuestarioId=${CodPresupuestarioId}, Observaciones=${Observaciones}, cai=${cai}, 
                        SubListaPrecioId=${SubListaPrecioId}, CobradorId=${CobradorId}
                    WHERE 
                        ClienteId=${ClienteId}`
    
    mysqlConnection.getConnection((err, db) => {
        if(err) console.log(err)

        else{
            db.query(sqlUpdate,(error, rows, fields) => {
                if(!error){
                    res.json({msj: 'Registro cliente modificado exitosamente'});
                }else{
                    res.json({msj: 'No se ha podido modificar el registro cliente', errorMsj: error});
                }
            });
            db.release();
        }
    });
});

module.exports = router;