class SqlPersistenSystem {
  buildSQLInsertRequest = (objectCollection, tableName) => {
    let columnNames = `INSERT INTO ${tableName} (`;
    let values = "VALUES (";
    for (const [name, value] of Object.entries(objectCollection)) {
      columnNames += `${name},`;
      values += `'${value}',`;
    }
    return (
      columnNames.slice(0, columnNames.length - 1) +
      ") " +
      values.slice(0, values.length - 1) +
      ") "
    );
  };

  buildSQLUpdateRequest = (nameId, valueId, objectCollection, tableName) => {
    let sqlString = `UPDATE ${tableName} SET `;
    for (const [name, value] of Object.entries(objectCollection)) {
      sqlString += `${name}='${value}',`;
    }
    sqlString = sqlString.slice(0, sqlString.length - 1);
    sqlString += ` WHERE ${nameId}='${valueId}'`;
    return sqlString;
  };

  buildSQLDeleteRequest = (nameId, valueId, tableName) => {
    return `DELETE FROM ${tableName} WHERE ${nameId}='${valueId}'`;
  };
}

module.exports = SqlPersistenSystem;
