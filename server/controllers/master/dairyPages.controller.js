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
      // case 'DELETE':
      //   deleteItem(dbModel, sessionDoc, req).then(resolve).catch(reject)
      //   break
      default:
        restError.method(req, reject)
        break
    }
  })

function getOne(dbModel, sessionDoc, req) {
  return new Promise((resolve, reject) => {
    dbModel.dairyPages
      .findOne({ _id: req.params.param1, member: sessionDoc.member })
      .then(async doc => {
        if (doc) {
          let obj = doc.toJSON()
          obj.events = await dbModel.events.find({ dairy: doc.dairy, dairyPage: doc._id, member: sessionDoc.member })
          obj.realPayments = await dbModel.realPayments.find({ dairy: doc.dairy, dairyPage: doc._id, member: sessionDoc.member })
          obj.mentalWorks = await dbModel.mentalWorks.find({ dairy: doc.dairy, dairyPage: doc._id, member: sessionDoc.member })
          resolve(obj)
        } else {
          reject(`dairy page not found`)
        }
      })
      .catch(reject)
  })
}

function getList(dbModel, sessionDoc, req) {
  return new Promise(async (resolve, reject) => {
    try {

      let options = {
        page: req.query.page || 1,
        limit: req.query.pageSize || 10,
        sort: { issueDate: -1, dayNo: -1 }
      }
      const dairyId = req.getValue('dairy') || sessionDoc.dairy
      if (!dairyId)
        return reject(`dairy parameter required`)

      const dairyDoc = await dbModel.dairy.findOne({ _id: dairyId, member: sessionDoc.member })

      if (!dairyDoc)
        return reject(`dairy not found`)

      let filter = { member: sessionDoc.member, dairy: dairyDoc._id }

      dbModel.dairyPages
        .paginate(filter, options)
        .then(result => {

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

      let data = {}

      const pageDocs = await dbModel.dairyPages
        .find({ dairy: dairyDoc._id, member: sessionDoc.member })
        .sort({ issueDate: -1, dayNo: -1 })
        .limit(1)
      if (pageDocs.length == 0) {
        data = {
          member: sessionDoc.member,
          dairy: dairyDoc._id,
          issueDate: new Date().toISOString().substring(0, 10),
          dayNo: 1,
          transferBalance: 0,
          debit: 0,
          credit: 0,
          balance: 0,
          dayFinished: false
        }
      } else {
        let lastPage = pageDocs[0]
        let lastDate = new Date(lastPage.issueDate)
        lastDate.setDate(lastDate.getDate() + 1)
        if (new Date().getTime() < lastDate.getTime()) {
          return resolve(lastPage)
        } else {
          data = {
            member: sessionDoc.member,
            dairy: dairyDoc._id,
            issueDate: lastDate.toISOString().substring(0, 10),
            dayNo: lastPage.dayNo + 1,
            transferBalance: lastPage.balance,
            debit: 0,
            credit: 0,
            balance: lastPage.balance,
            dayFinished: false
          }
          await dbModel.dairyPages.updateOne({ _id: lastPage._id }, { $set: { dayFinished: true } })
        }
      }



      const newDoc = new dbModel.dairyPages(data)

      if (!epValidateSync(newDoc, reject)) return
      newDoc.save().then(resolve).catch(reject)

    } catch (err) {
      reject(err)
    }
  })
}

// function put(dbModel, sessionDoc, req) {
//   return new Promise(async (resolve, reject) => {
//     try {

//       if (req.params.param1 == undefined)
//         return restError.param1(req, reject)

//       let data = req.body || {}
//       delete data._id
//       delete data.member

//       let dairyDoc = await dbModel.dairyPages.findOne({ _id: req.params.param1, member: sessionDoc.member })
//       if (!dairyDoc)
//         return reject(`dairy not found or permission denied`)

//       dairyDoc = Object.assign(dairyDoc, data)
//       if (!epValidateSync(dairyDoc, reject)) return

//       dairyDoc.hourlyWage = Number(dairyDoc.targetIncome) / 1000
//       dairyDoc.save()
//         .then(result => {
//           let obj = result.toJSON()
//           delete obj.dbHost
//           resolve(obj)
//         })
//         .catch(reject)
//     } catch (err) {
//       reject(err)
//     }

//   })
// }

// function deleteItem(dbModel, sessionDoc, req) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       if (req.params.param1 == undefined)
//         return restError.param1(req, reject)

//       let dairyDoc = await dbModel.dairyPages.findOne({
//         _id: req.params.param1,
//         member: sessionDoc.member,
//         passive: false
//       })

//       if (!dairyDoc)
//         return reject(`dairy not found or permission denied`)

//       dairyDoc.passive = true
//       dairyDoc
//         .save()
//         .then(resolve)
//         .catch(reject)

//     } catch (err) {
//       reject(err)
//     }
//   })
// }
