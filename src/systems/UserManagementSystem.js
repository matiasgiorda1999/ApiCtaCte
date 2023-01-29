const axios = require("axios");
const mysqlConnection = require("../database");
const DataBaseError = require("../errors/DataBaseError");

class UserManagementSystem {
  #ACCESS_TOKEN;
  #accessTokenForManageAuth0 = async () => {
    if (this.#ACCESS_TOKEN) return this.#ACCESS_TOKEN;
    const response = await axios.post(
      `https://${process.env.AUTH0_API_CLIENT_DOMAIN}/oauth/token`,
      {
        grant_type: "client_credentials",
        client_id: process.env.AUTH0_API_CLIENT_ID,
        client_secret: process.env.AUTH0_API_CLIENT_SECRET,
        audience: `https://${process.env.AUTH0_API_CLIENT_DOMAIN}/api/v2/`,
      },
      { "content-type": "application/x-www-form-urlencoded" }
    );
    return response.data.access_token;
  };

  async updateUserMetadata(userMetadata, userUniqueName) {
    try {
      await axios.patch(
        `https://${process.env.AUTH0_API_CLIENT_DOMAIN}/api/v2/users/${userUniqueName}`,
        {
          user_metadata: userMetadata,
        },
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${await this.#accessTokenForManageAuth0()}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  #buildSQLSelectClientData = ({ enterprise, cuit }) => {
    return `SELECT c.ClienteId AS ClienteId, 
                  c.Nombre AS Nombre, 
                  c.CUIT AS CUIT, 
                  c.Localidad AS Localidad,
                  prov.Nombre AS Provincia,
                  pais.Nombre AS Pais,
                  resp.Nombre AS Responsable,
                  ingbrut.Nombre AS IngBrutoCondicion
            FROM clientes c
              LEFT JOIN AFIPPaises pais ON c.AFIPPaisId = pais.AFIPPaisId
              LEFT JOIN AFIPProvincias prov ON c.AFIPProvinciaId = prov.AfipProvinciaId
              LEFT JOIN AFIPresponsables resp ON c.AFIPResponsableId = resp.AfipResponsableId
              LEFT JOIN ingbrutoscondiciones ingbrut ON c.IngBrutosCondicionId = ingbrut.IngBrutosCondicionId 
            WHERE c.EmpresaId='${enterprise}' AND c.CUIT='${cuit}'`;
  };

  async getClientData(queryParams) {
    try {
      const sqlSelect = this.#buildSQLSelectClientData(queryParams);
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
      return result[0] ? result[0] : {};
    } catch (error) {
      throw new DataBaseError(error.message);
    }
  }
}

module.exports = UserManagementSystem;
