const { auth } = require("express-oauth2-jwt-bearer");

const checkJwt = auth({
  audience: "http://checking-account.com",
  issuerBaseURL: `https://cuenta-corriente-development.us.auth0.com/`,
});

module.exports = checkJwt;
