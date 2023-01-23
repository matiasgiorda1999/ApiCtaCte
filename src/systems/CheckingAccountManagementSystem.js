const DataBaseError = require("../errors/DataBaseError");
const SqlPersistenSystem = require("./SqlPersistentSystem");
const mysqlConnection = require("../database");

class CheckingAccountManagementSystem extends SqlPersistenSystem {
  #buildSQLSelectMovements = (queryParams) => {
    const sqlClientIdSelect = `(SELECT ClienteId FROM clientes WHERE EmpresaId='${queryParams["enterprise"]}' AND CUIT='${queryParams["cuit"]}')`;

    return `
            SELECT 
                CtaCte.Fecha,
                RTRIM( Case  WHEN LEFT(ctacte.detalle, 15) <> 'NUESTRA ENTREGA' AND LEFT(ctacte.detalle, 10) <> 'SU ENTREGA' AND ctacte.detalle <> '' and ctacte.detalle is not null THEN CTACTE.DETALLE ELSE TIPOSCOMPROBANTES.NOMBRE END) AS Detalle,
                ctacte.Letra as Letra, 
                Prefijo as Suc, 
                ctacte.Nro as Numero, 
                case when dh <> 0 then  importe  else null end AS Debe, 
                case when dh= 0 then  importe  else null end AS Haber, 0 as Saldo,  
                case when fvto > '${queryParams["date-from"]}' then fvto else null end AS Vencimiento,
                Case When fvto <= '${queryParams["date-to"]}' then 0 else 1 end AS Avencer,
                TiposComprobantes.Nombre as TipoComprobante,  
                (Select sum(case when dh <> 0 then  importe else -importe  end ) from ctacte cc where cc.clienteid = ctacte.clienteid and (fecha < '${queryParams["date-from"]}' and (fvto < '${queryParams["date-from"]}' or fvto is null))   ) AS SaldoIni,
                Cancelado,
                fcarga as FCtaCte
            FROM 
                CtaCte left join TiposComprobantes on CtaCte.TipoComprobanteId = TiposComprobantes.TipoComprobanteId  
                inner join clientes on ctacte.clienteid = clientes.clienteid
            WHERE 
                ((fecha between '${queryParams["date-from"]}' and '${queryParams["date-to"]}') or (fecha < '${queryParams["date-from"]}' and fvto >= '${queryParams["date-from"]}'))  and ctacte.clienteid = ${sqlClientIdSelect} and ctacte.EmpresaId = ${queryParams["enterprise"]} Order by 1,haber`;
  };

  async createCheckingAccount(checkingAccount) {
    try {
      const sqlInsert = this.buildSQLInsertRequest(checkingAccount, "CtaCte");
      const db = await new Promise((resolve, reject) => {
        mysqlConnection.getConnection((error, db) => {
          if (error) {
            reject(error);
          } else {
            resolve(db);
          }
        });
      });
      await new Promise((resolve, reject) => {
        db.query(sqlInsert, (error, rows, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
      await db.release();
      return null;
    } catch (error) {
      throw new DataBaseError(error.message);
    }
  }

  async checkingAccountMovements(queryParams) {
    try {
      const sqlSelect = this.#buildSQLSelectMovements(queryParams);
      const db = await new Promise((resolve, reject) => {
        mysqlConnection.getConnection((error, db) => {
          if (error) {
            reject(error);
          } else {
            resolve(db);
          }
        });
      });
      const result = await new Promise((resolve, reject) => {
        db.query(sqlSelect, (error, rows, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve(rows);
          }
        });
      });
      await db.release();
      return result;
    } catch (error) {
      throw new DataBaseError(error.message);
    }
  }
}

module.exports = CheckingAccountManagementSystem;
