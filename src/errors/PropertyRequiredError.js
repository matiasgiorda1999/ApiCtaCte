const Code = require("../reponses/responseCode");

class PropertyRequiredError extends Error {
  errorCode;
  #message;

  constructor(message) {
    super(message);

    this.name = "PropertyRequiredError";
    this.#message = "Incorrect or missing value " + message;
    this.errorCode = Code.BAD_REQUEST;
  }

  jsonResponse = () => {
    return {
      name: this.name,
      code: this.errorCode,
      description: this.#message,
    };
  };
}

module.exports = PropertyRequiredError;
