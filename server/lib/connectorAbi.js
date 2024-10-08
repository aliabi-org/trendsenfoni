exports.dateTime = function (clientId, clientPass) {
  return new Promise((resolve, reject) => {
    console.log({ clientId: clientId, clientPass: clientPass })
    console.log(`${process.env.CONNECTOR_API}/datetime`)
    try {
      fetch(`${process.env.CONNECTOR_API}/datetime`, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          clientId: clientId,
          clientPass: clientPass
        },
        // body: JSON.stringify({ clientId: clientId, clientPass: clientPass })
      })
        .then(res => res.json())
        .then(result => {
          console.log('result:', result)
          if (result.success) {
            resolve(result.data)
          } else {
            reject(result.error)
          }
        })
        .catch(reject)

    } catch (err) {
      reject(err)
    }
  })
}