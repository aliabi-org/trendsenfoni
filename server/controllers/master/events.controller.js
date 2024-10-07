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
      // case 'PUT':
      //   put(dbModel, sessionDoc, req).then(resolve).catch(reject)
      //   break
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
    dbModel.events
      .findOne({ _id: req.params.param1, member: sessionDoc.member })
      .then(resolve)
      .catch(reject)
  })
}

function getList(dbModel, sessionDoc, req) {
  return new Promise(async (resolve, reject) => {
    try {

      let options = {
        page: req.query.page || 1,
        limit: req.query.pageSize || 10,
      }
      const dairyId = req.getValue('dairy') || sessionDoc.dairy
      if (!dairyId)
        return reject(`dairy parameter required`)

      const dairyDoc = await dbModel.dairy.findOne({ _id: dairyId, member: sessionDoc.member })
      if (!dairyDoc)
        return reject(`dairy not found`)

      const dairyPageId = req.getValue('dairyPage')
      if (!dairyPageId)
        return reject(`dairyPage parameter required`)

      const dairyPageDoc = await dbModel.dairyPages.findOne({
        _id: dairyPageId,
        member: sessionDoc.member,
        dairy: dairyDoc._id
      })
      if (!dairyPageDoc)
        return reject(`dairyPage not found`)

      let filter = {
        member: sessionDoc.member,
        dairy: dairyDoc._id,
        dairyPage: dairyPageDoc._id,
      }

      dbModel.events
        .paginate(filter, options)
        .then(result => {
          // result.dairy = dairyDoc.toJSON()
          // result.dairyPage = dairyPageDoc.toJSON()
          resolve(result)
        }).catch(reject)
    } catch (err) {
      reject(err)
    }

  })
}

function post(dbModel, sessionDoc, req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = req.body || {}
      if (!data.title)
        return reject(`title required`)
      delete data._id

      const dairyId = req.getValue('dairy') || sessionDoc.dairy
      if (!dairyId)
        return reject(`dairy parameter required`)

      const dairyDoc = await dbModel.dairy.findOne({ _id: dairyId, member: sessionDoc.member })
      if (!dairyDoc)
        return reject(`dairy not found`)
      const dairyPageId = req.getValue('dairyPage')
      if (!dairyPageId)
        return reject(`dairyPage parameter required`)

      const dairyPageDoc = await dbModel.dairyPages.findOne({
        _id: dairyPageId,
        member: sessionDoc.member,
        dairy: dairyDoc._id
      })
      if (!dairyPageDoc)
        return reject(`dairyPage not found`)


      data.member = sessionDoc.member
      data.dairy = dairyDoc._id
      data.dairyPage = dairyPageDoc._id

      const newDoc = new dbModel.events(data)

      if (!epValidateSync(newDoc, reject)) return
      newDoc.save().then(resolve).catch(reject)

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

      const eventDoc = await dbModel.events.findOne({
        _id: req.params.param1,
        member: sessionDoc.member
      })
      console.log(req.params)
      if (!eventDoc)
        return reject(`event not found or permission denied`)

      const dairyPageDoc = await dbModel.dairyPages.findOne({ _id: eventDoc.dairyPage })
      if (!dairyPageDoc)
        return reject(`dairyPage not found`)

      dbModel.events.removeOne(sessionDoc, { _id: eventDoc._id })
        .then(resolve)
        .catch(reject)
    } catch (err) {
      reject(err)
    }
  })
}
