var admin = require('firebase-admin')
const serviceAccount = require('./admin-sdk-key.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

module.exports = admin
