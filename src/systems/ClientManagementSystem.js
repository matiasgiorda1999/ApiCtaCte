const DataBaseError = require("../errors/DataBaseError");
const SqlPersistenSystem = require("./SqlPersistentSystem");
const mysqlConnection = require("../database");

class ClientManagementSystem extends SqlPersistenSystem {
  async createClient(client) {
    try {
      const sqlInsert = this.buildSQLInsertRequest(client, "Clientes");
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
}

module.exports = ClientManagementSystem;
