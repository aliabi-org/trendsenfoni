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
    dbModel.mentalWorks
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

      dbModel.mentalWorks
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

      const itemId = req.getValue('item')
      if (!itemId)
        return reject(`itemId parameter required`)

      const itemDoc = await dbModel.items.findOne({
        _id: itemId,
        member: sessionDoc.member
      })

      if (!itemDoc)
        return reject(`item not found`)

      const quantity = Number(req.getValue('quantity') || 1)
      const total = Math.round(dairyDoc.hourlyWage * quantity)

      if (total <= 0)
        return reject(`quantity must be greater than zero`)

      const data = {
        member: sessionDoc.member,
        dairy: dairyDoc._id,
        dairyPage: dairyPageDoc._id,
        item: itemDoc._id,
        quantity: quantity,
        price: dairyDoc.hourlyWage,
        total: total,
      }

      const newDoc = new dbModel.mentalWorks(data)

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

      const financialActionDoc = await dbModel.mentalWorks.findOne({
        _id: req.params.param1,
        member: sessionDoc.member
      })

      if (!financialActionDoc)
        return reject(`financialAction not found or permission denied`)

      const dairyPageDoc = await dbModel.dairyPages.findOne({ _id: financialActionDoc.dairyPage })
      if (!dairyPageDoc)
        return reject(`dairyPage not found`)

      dbModel.mentalWorks.removeOne(sessionDoc, { _id: financialActionDoc._id })
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
