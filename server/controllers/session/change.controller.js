
module.exports = (dbModel, sessionDoc, req) =>
  new Promise(async (resolve, reject) => {
    if (req.method === 'POST') {
      switch (req.params.param1) {
        case 'lang':
        case 'language':
          changeLanguage(dbModel, sessionDoc, req).then(resolve).catch(reject)
          break
        case 'db':
        case 'period':
        case 'firm':
          changeDb(dbModel, sessionDoc, req).then(resolve).catch(reject)
          break
        default:
          restError.param1(req, reject)
          break
      }
    } else {
      restError.method(req, reject)
    }
  })

function changeDb(dbModel, sessionDoc, req) {
  return new Promise(async (resolve, reject) => {
    if (!req.params.param2) return restError.param2(req, reject)
    if (req.params.param1 == 'db')
      sessionDoc.db = req.params.param2
    if (req.params.param1 == 'firm')
      sessionDoc.firm = req.params.param2
    if (req.params.param1 == 'period')
      sessionDoc.period = req.params.param2

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