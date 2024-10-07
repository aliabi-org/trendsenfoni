
module.exports = (dbModel, sessionDoc, req) =>
  new Promise(async (resolve, reject) => {
    if (!['GET', 'PATCH'].includes(req.method) && !sessionDoc) {
      return restError.session(req, reject)
    }

    switch (req.method.toUpperCase()) {
      case 'GET':
        if (req.params.param1 != undefined) {
          getOne(dbModel, sessionDoc, req).then(resolve).catch(reject)
        } else {
          getList(dbModel, sessionDoc, req).then(resolve).catch(reject)
        }
        break
      case 'POST':
        post(dbModel, sessionDoc, req).then(resolve).catch(reject)

        break
      case 'PUT':
        put(dbModel, sessionDoc, req).then(resolve).catch(reject)
        break
      case 'DELETE':
        deleteItem(dbModel, sessionDoc, req).then(resolve).catch(reject)
        break
      default:
        restError.method(req, reject)
        break
    }
  })

function getOne(dbModel, sessionDoc, req) {
  return new Promise((resolve, reject) => {
    dbModel.dairy
      .findOne({ _id: req.params.param1, member: sessionDoc.member })
      .then(resolve)
      .catch(reject)
  })
}

function getList(dbModel, sessionDoc, req) {
  return new Promise((resolve, reject) => {
    let options = {
      page: req.query.page || 1,
      limit: req.query.pageSize || 10
    }
    let filter = {
      member: sessionDoc.member,
      passive: false
    }
    dbModel.dairy
      .paginate(filter, options)
      .then(result => {

        resolve(result)
      }).catch(reject)
  })
}

function post(dbModel, sessionDoc, req) {
  return new Promise(async (resolve, reject) => {
    try {

      let data = req.body || {}
      delete data._id
      if (!data.targetIncome) return reject('target income required')
      if (!data.currency) return reject('currency required')

      data.startDate = new Date().toISOString().substring(0, 10)
      data.endDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().substring(0, 10)

      data.hourlyWage = Math.floor(Number(data.targetIncome) / 1000)
      data.member = sessionDoc.member
      const newDoc = new dbModel.dairy(data)

      if (!epValidateSync(newDoc, reject)) return
      newDoc.save().then(resolve).catch(reject)

    } catch (err) {
      reject(err)
    }
  })
}

function put(dbModel, sessionDoc, req) {
  return new Promise(async (resolve, reject) => {
    try {

      if (req.params.param1 == undefined)
        return restError.param1(req, reject)

      let data = req.body || {}
      delete data._id
      delete data.member

      let dairyDoc = await dbModel.dairy.findOne({ _id: req.params.param1, member: sessionDoc.member })
      if (!dairyDoc)
        return reject(`dairy not found or permission denied`)

      dairyDoc = Object.assign(dairyDoc, data)
      if (!epValidateSync(dairyDoc, reject)) return

      dairyDoc.hourlyWage = Math.floor(Number(dairyDoc.targetIncome) / 1000)
      dairyDoc.save()
        .then(result => {
          let obj = result.toJSON()
          delete obj.dbHost
          resolve(obj)
        })
        .catch(reject)
    } catch (err) {
      reject(err)
    }

  })
}

function deleteItem(dbModel, sessionDoc, req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (req.params.param1 == undefined)
        return restError.param1(req, reject)

      let dairyDoc = await dbModel.dairy.findOne({
        _id: req.params.param1,
        member: sessionDoc.member,
        passive: false
      })

      if (!dairyDoc)
        return reject(`dairy not found or permission denied`)

      dairyDoc.passive = true
      dairyDoc
        .save()
        .then(resolve)
        .catch(reject)

    } catch (err) {
      reject(err)
    }
  })
}
