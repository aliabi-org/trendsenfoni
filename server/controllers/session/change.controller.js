
module.exports = (dbModel, sessionDoc, req) =>
  new Promise(async (resolve, reject) => {
    if (req.method === 'POST') {
      switch (req.params.param1) {
        case 'lang':
        case 'language':
          changeLanguage(dbModel, sessionDoc, req).then(resolve).catch(reject)
          break
        case 'dairy':
          changeDairy(dbModel, sessionDoc, req).then(resolve).catch(reject)
          break
        default:
          restError.param1(req, reject)
          break
      }
    } else {
      restError.method(req, reject)
    }
  })

function changeDairy(dbModel, sessionDoc, req) {
  return new Promise(async (resolve, reject) => {
    if (!req.params.param2) return restError.param2(req, reject)
    const dairyDoc = await dbModel.dairy.findOne({
      _id: req.params.param2,
      member: sessionDoc.member,
      passive: false
    })
    if (!dairyDoc) return reject(`dairy not found`)


    sessionDoc.dairy = dairyDoc._id
    sessionDoc
      .save()
      .then(async result => {
        resolve({
          dairyId: dairyDoc._id,
          dairy: dairyDoc,
          message: t(`session database has been changed successfully`, sessionDoc.language)
        })
      })
      .catch(reject)

  })
}
function changeLanguage(dbModel, sessionDoc, req) {
  return new Promise(async (resolve, reject) => {
    if (!req.params.param2) return restError.param2(req, reject)

    sessionDoc.language = req.params.param2
    sessionDoc
      .save()
      .then(resolve({
        lang: sessionDoc.language,
        message: t('session language has been changed successfully', sessionDoc.language)
      }))
      .catch(reject)

  })
}