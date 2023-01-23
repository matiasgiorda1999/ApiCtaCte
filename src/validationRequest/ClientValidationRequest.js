const PropertyRequiredError = require("../errors/PropertyRequiredError");
const Joi = require("joi");

// #region validators

const parametersFromNewRequest = Joi.object({
  ClienteId: Joi.number().integer().required(),
  Nombre: Joi.string().min(1).max(100),
  Localidad: Joi.string().min(1).max(100),
  AFIPProvinciaId: Joi.number().integer(),
  AFIPPaisId: Joi.number().integer(),
  AFIPResponsableId: Joi.number().integer(),
  CUIT: Joi.string().min(1).max(50),
  IngBrutosCondicionId: Joi.number().integer(),
  EmpresaId: Joi.number().integer().required(),
});

// #endregion

class ClientValidationRequest {
  toNewClientEntry = (object) => {
    const objectToValidate = this.parseIntTheValues(object);
    const { error } = parametersFromNewRequest.validate(objectToValidate);
    if (error) throw new PropertyRequiredError(error.message);
    return objectToValidate;
  };

  parseIntTheValues = (object) => {
    const objectToReturn = { ...object };
    for (const property in object) {
      if (
        [
          "ClienteId",
          "AFIPProvinciaId",
          "AFIPPaisId",
          "AFIPResponsableId",
          "IngBrutosCondicionId",
          "EmpresaId",
        ].includes(property)
      )
        objectToReturn[property] = parseInt(object[property]);
    }
    return objectToReturn;
  };
}

module.exports = ClientValidationRequest;
