const { updateBalances } = require('../../lib/helper')
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
    dbModel.realPayments
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

      dbModel.realPayments
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

      const total = Number(req.getValue('total') || 0)
      if (total <= 0)
        return reject(`total must be greater than zero`)

      const description = req.getValue('description')
      if (!description)
        return reject(`description required`)

      const data = {
        member: sessionDoc.member,
        dairy: dairyDoc._id,
        dairyPage: dairyPageDoc._id,
        description: description,
        total: total,
      }


      const newDoc = new dbModel.realPayments(data)

      if (!epValidateSync(newDoc, reject)) return
      newDoc.save().then(async newDoc => {
        await updateBalances(dbModel, sessionDoc, dairyPageDoc)
        resolve(newDoc)
      }).catch(reject)

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

      const financialActionDoc = await dbModel.realPayments.findOne({
        _id: req.params.param1,
        member: sessionDoc.member
      })

      if (!financialActionDoc)
        return reject(`financialAction not found or permission denied`)

      const dairyPageDoc = await dbModel.dairyPages.findOne({ _id: financialActionDoc.dairyPage })
      if (!dairyPageDoc)
        return reject(`dairyPage not found`)

      dbModel.realPayments.removeOne(sessionDoc, { _id: financialActionDoc._id })
        .then(async result => {
          await updateBalances(dbModel, sessionDoc, dairyPageDoc)
          resolve(result)
        })
        .catch(reject)
    } catch (err) {
      reject(err)
    }
  })
}
