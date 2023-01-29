const DataBaseError = require("../errors/DataBaseError");
const SqlPersistenSystem = require("./SqlPersistentSystem");
const mysqlConnection = require("../database");

class AfipResourcesManagementSystem extends SqlPersistenSystem {
  async getProvinces() {
    try {
      const sqlSelect = "SELECT AfipProvinciaId, Nombre FROM afipprovincias";
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

  async getCountries() {
    try {
      const sqlSelect = "SELECT AfipPaisId, Nombre FROM afippaises";
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

  async getResponsables() {
    try {
      const sqlSelect =
        "SELECT AfipResponsableId, Nombre FROM afipresponsables";
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

  async getIncomes() {
    try {
      const sqlSelect =
        "SELECT IngBrutosCondicionId, Nombre FROM ingbrutoscondiciones";
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

module.exports = AfipResourcesManagementSystem;
