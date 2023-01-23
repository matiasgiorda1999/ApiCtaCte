const DataBaseError = require("../errors/DataBaseError");
const SqlPersistenSystem = require("./SqlPersistentSystem");
const mysqlConnection = require("../database");

class ReceiptPaymentManagementSystem extends SqlPersistenSystem {
  async createReceiptPayment(receiptPayment) {
    try {
      const sqlInsert = this.buildSQLInsertRequest(
        receiptPayment,
        "TiposComprobantes"
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

module.exports = ReceiptPaymentManagementSystem;
