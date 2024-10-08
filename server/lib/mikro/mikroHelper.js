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

exports.bankBalances = function (dbModel, sessionDoc, connector) {
  return new Promise(async (resolve, reject) => {
    try {
      const query = `SELECT 
       [msg_S_0070] as Banka
      ,[msg_S_1530] as Bakiye
	    ,[msg_S_0849] as ParaBirimi
      FROM ${sessionDoc.db}..[BANKALAR_CHOOSE_3A]`
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