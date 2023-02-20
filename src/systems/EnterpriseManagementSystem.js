const DataBaseError = require("../errors/DataBaseError");
const SqlPersistenSystem = require("./SqlPersistentSystem");
const mysqlConnection = require("../database");

class EnterpriseManagementSystem extends SqlPersistenSystem {
  #buildSQLSelectEnterprisesRequestFilteredBy = (queryParams) => {
    let filterSql = "WHERE ";
    for (const attribute in queryParams) {
      filterSql += `${attribute} = '${queryParams[attribute]}'`;
    }
    if (filterSql === "WHERE ") filterSql = "";
    return `
        SELECT 
            e.*,
            ap.Nombre AS Provincia, 
            apa.Nombre AS Pais, 
            ar.Nombre AS Responsable, 
            ib.Nombre AS IngBrutoCondicion
        FROM 
            empresas e 
            LEFT JOIN usuariosxempresas uxe ON e.idempresa = uxe.idEmpresa 
            LEFT JOIN afipprovincias ap ON e.AFIPProvinciaId = ap.AfipProvinciaId
            LEFT JOIN afippaises apa ON e.AFIPPaisId = apa.AFIPPaisId
            LEFT JOIN afipresponsables ar ON e.AFIPResponsableId = ar.AfipResponsableId
            LEFT JOIN ingbrutoscondiciones ib ON e.AFIPIngBrutosId = ib.IngBrutosCondicionId
        ${filterSql}
        GROUP BY e.idempresa`;
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

  async createEnterprise(enterprise) {
    try {
      const sqlInsert = this.buildSQLInsertRequest(enterprise, "empresas");
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

  async updateEnterprise(enterpriseId, enterprise) {
    try {
      const sqlUpdate = this.buildSQLUpdateRequest(
        "idempresa",
        enterpriseId,
        enterprise,
        "empresas"
      );
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
        db.query(sqlUpdate, (error, rows, fields) => {
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

  async deleteEnterprise(enterpriseId) {
    try {
      const sqlDelete = this.buildSQLDeleteRequest(
        "idempresa",
        enterpriseId,
        "empresas"
      );
      console.log(sqlDelete);
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
        db.query(sqlDelete, (error, rows, fields) => {
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

  async assignUsersToEnterprise(enterpriseId, users) {
    try {
      let sql = [];
      users.forEach((user) => {
        sql.push(
          `INSERT INTO usuariosxempresas (idUsuario,idEmpresa) VALUES ('${user.user_id}','${enterpriseId}')`
        );
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
      sql.forEach(async (sqlQuery) => {
        await new Promise((resolve, reject) => {
          db.query(sqlQuery, (error, rows, fields) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        });
      });
      await db.release();
      return null;
    } catch (error) {
      throw new DataBaseError(error.message);
    }
  }
}

module.exports = EnterpriseManagementSystem;
