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
}

module.exports = SqlPersistenSystem;
