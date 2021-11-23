const withPWA = require('next-pwa')
const credentials = require('./FirebaseCredentials')
module.exports = withPWA({
    pwa: {
        dest: 'public'
    },
    env: {
        FIREBASE_API_KEY: credentials.API_KEY,
        FIREBASE_AUTH_DOMAIN: credentials.AUTH_DOMAIN,
        FIREBASE_DATABASE_URL: credentials.DATABASE_URL,
        FIREBASE_PROJECT_ID: credentials.PROJECT_ID,
        FIREBASE_STORAGE_BUCKET: credentials.STORAGE_BUCKET,
        FIREBASE_MESSAGING_SENDER_ID: credentials.MESSAGING_SENDER_ID,
        FIREBASE_APPID: credentials.APPID,
        FIREBASE_MEASUREMENT_ID: credentials.MEASUREMENT_ID,
        JWT_SECRET: credentials.JWT_SECRET,
        NEXTAUTH_URL: 'http://localhost:3000'

    }
})