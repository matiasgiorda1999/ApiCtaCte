const Code = require("../reponses/responseCode");

class DataBaseError extends Error {
  errorCode;
  #message;

  constructor(message) {
    super(message);

    this.name = "DatabaseError";
    this.#message = message;
    this.errorCode = Code.INTERNAL_SERVER_ERROR;
  }

  jsonResponse = () => {
    return {
      name: this.name,
      code: this.errorCode,
      description: this.#message,
    };
  };
}

module.exports = DataBaseError;
