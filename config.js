const { facebookId, facebookSecret } = require("./secrets");

module.exports = {
    'secretKey': '12345-67890-09876-54321',
    'mongoUrl' : 'mongodb://localhost:27017/nucampsite',
    'facebook': {
        clientId: facebookId,
        clientSecret: facebookSecret
    }
}