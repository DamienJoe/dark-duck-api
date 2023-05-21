const env = process.env.NODE_ENV

const development = {
    port: Number(process.env.PORT),
    mongoUrl:process.env.MONGO_DATABASE_URL,
    baseURL: 'https://api.darkduck.se',
    email:{
        from: process.env.EMAIL_FROM,
        host: process.env.EMAIL_HOST, // hostname 
        secureConnection: false, // TLS requires secureConnection to be false
        port: Number(process.env.EMAIL_SMTP_PORT), // port for secure SMTP 
        tls: {
            ciphers:'SSLv3'
        },
        // transportMethod: process.env.EMAIL_TRANSPORT_METHOD, // default is SMTP. Accepts anything that nodemailer accepts 
        auth: {
            user: process.env.EMAIL_AUTH_USER,
            pass: process.env.EMAIL_AUTH_PASSWORD
        }
    },
    viewsPath:`${__dirname}/views`,
    secret: process.env.JWT_SECRET,
    dirPath: `${__dirname}/public/`
}

const production = {
    port: Number(process.env.PORT),
    mongoUrl:process.env.MONGO_DATABASE_URL,
    baseURL:'https://api.darkduck.se',
    email:{
        from: process.env.EMAIL_FROM,
        host: process.env.EMAIL_HOST, // hostname 
        secureConnection: false, // TLS requires secureConnection to be false
        port: Number(process.env.EMAIL_SMTP_PORT), // port for secure SMTP 
        tls: {
            ciphers:'SSLv3'
        },
        // transportMethod: process.env.EMAIL_TRANSPORT_METHOD, // default is SMTP. Accepts anything that nodemailer accepts 
        auth: {
            user: process.env.EMAIL_AUTH_USER,
            pass: process.env.EMAIL_AUTH_PASSWORD
        }
    },
    viewsPath:`${__dirname}/views`,
    secret: process.env.JWT_SECRET,
    dirPath: `${__dirname}/public/`
}

// ------------- Set Environment Here ------------------ //

// DEVELOPMENT // PRODUCTION
const ENVIRONMENT = {
    development, 
    production
}    
// ------------- Set Environment Here ------------------ //


module.exports = ENVIRONMENT[env]