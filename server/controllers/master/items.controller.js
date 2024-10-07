const userDbPrefix = process.env.USERDB_PREFIX || 'aabi_'
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
    dbModel.financialItems
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
      // passive: false
    }
    dbModel.financialItems
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
      if (!data.name)
        return reject('name required')

      if (await dbModel.financialItems.countDocuments({ name: data.name, member: sessionDoc.member }) > 0)
        return reject(`'${data.name}' name already exists`)
      data.member = sessionDoc.member
      const newDoc = new dbModel.financialItems(data)

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
      // delete data.ioType

      let financialItemDoc = await dbModel.financialItems.findOne({ _id: req.params.param1, member: sessionDoc.member })
      if (!financialItemDoc)
        return reject(`financialItem not found or permission denied`)

      if (await dbModel.financialItems.countDocuments({
        name: data.name, member: sessionDoc.member,
        _id: { $ne: financialItemDoc._id }
      }) > 0) return reject(`'${data.name}' name already exists`)

      financialItemDoc = Object.assign(financialItemDoc, data)
      if (!epValidateSync(financialItemDoc, reject)) return

      financialItemDoc.save()
        .then(resolve)
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

      let financialItemDoc = await dbModel.financialItems.findOne({
        _id: req.params.param1,
        member: sessionDoc.member,
        passive: false
      })

      if (!financialItemDoc)
        return reject(`financialItem not found or permission denied`)

      financialItemDoc.passive = true
      financialItemDoc
        .save()
        .then(resolve)
        .catch(reject)

    } catch (err) {
      reject(err)
    }
  })
}
