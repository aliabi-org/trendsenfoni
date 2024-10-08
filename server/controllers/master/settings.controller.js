const connectorAbi = require('../../lib/connectorAbi')
module.exports = (dbModel, sessionDoc, req) =>
  new Promise(async (resolve, reject) => {
    if (!['GET', 'PATCH'].includes(req.method) && !sessionDoc) {
      return restError.session(req, reject)
    }

    switch (req.method.toUpperCase()) {
      case 'GET':
        getOne(dbModel, sessionDoc, req).then(resolve).catch(reject)

        break
      case 'POST':
      case 'PUT':
        if (req.params.param1 == 'connectorTest') {
          connectorTest(dbModel, sessionDoc, req).then(resolve).catch(reject)
        } else {
          save(dbModel, sessionDoc, req).then(resolve).catch(reject)
        }
        break

      default:
        restError.method(req, reject)
        break
    }
  })

function getOne(dbModel, sessionDoc, req) {
  return new Promise((resolve, reject) => {
    dbModel.settings
      .findOne({ member: sessionDoc.member })
      .then(async doc => {
        if (!doc) {
          doc = new dbModel.settings({ member: sessionDoc.member })
          doc = await doc.save()
        }
        resolve(doc)
      })
      .catch(reject)
  })
}

function save(dbModel, sessionDoc, req) {
  return new Promise(async (resolve, reject) => {
    try {

      let data = req.body || {}
      delete data._id
      data.member = sessionDoc.member
      let settingDoc = await dbModel.settings.findOne({ member: sessionDoc.member })
      if (!settingDoc) {
        settingDoc = new dbModel.settings(data)
      } else {
        settingDoc = Object.assign(settingDoc, data)
      }

      if (!epValidateSync(settingDoc, reject)) return
      settingDoc.save().then(resolve).catch(reject)

    } catch (err) {
      reject(err)
    }
  })
}


function connectorTest(dbModel, sessionDoc, req) {
  return new Promise(async (resolve, reject) => {
    try {
      const clientId = req.getValue('clientId')
      const clientPass = req.getValue('clientPass')
      if (!clientId) return reject(`clientId required`)
      if (!clientPass) return reject(`clientPass required`)
      connectorAbi
        .dateTime(clientId, clientPass)
        .then(resolve)
        .catch(reject)

    } catch (err) {
      reject(err)
    }
  })
}