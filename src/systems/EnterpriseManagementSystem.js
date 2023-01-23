const DataBaseError = require("../errors/DataBaseError");
const SqlPersistenSystem = require("./SqlPersistentSystem");
const mysqlConnection = require("../database");

class EnterpriseManagementSystem extends SqlPersistenSystem {
  #buildSQLSelectEnterprisesRequestFilteredBy = (queryParams) => {
    let filterSql = "WHERE ";
    for (const attribute in queryParams) {
      filterSql += `${attribute} = '${queryParams[attribute]}'`;
    }
    return `
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
        ${filterSql}`;
  };

  async getEnterprisesFilteredBy(queryParams) {
    try {
      const sqlSelect =
        this.#buildSQLSelectEnterprisesRequestFilteredBy(queryParams);
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

  async getEnterprise(enterpriseId) {
    try {
      const sqlSelect = this.#buildSQLSelectEnterprisesRequestFilteredBy({
        "e.idempresa": enterpriseId,
      });
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
      return result[0];
    } catch (error) {
      throw new DataBaseError(error.message);
    }
  }
}

module.exports = EnterpriseManagementSystem;
