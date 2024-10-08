const { mssql } = require('../connectorAbi')
exports.getDbList = function (connector) {
  return new Promise(async (resolve, reject) => {
    try {
      const query = `SELECT 'MikroDB_V16_' + DB_kod as db, DB_kod  as dbName, DB_isim as dbDesc FROM VERI_TABANLARI ORDER BY DB_kod`
      mssql(connector.clientId, connector.clientPass, connector.mssql, query)
        .then(result => {
          if (result.recordsets) {
            resolve(result.recordsets[0])
          } else {
            resolve([])
          }
        })
        .catch(reject)
    } catch (err) {
      reject(err)
    }
  })
}