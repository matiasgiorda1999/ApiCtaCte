const PropertyRequiredError = require("../errors/PropertyRequiredError");
const Joi = require("joi");

// #region validators

const parametersFromNewRequest = Joi.object({
  TipoComprobanteId: Joi.number().integer().required(),
  Nombre: Joi.string().min(1).max(50),
  AfipComprobanteId: Joi.number().integer(),
  CodigoUNIX: Joi.string().min(1).max(3),
  DebeHaber: Joi.string().min(1).max(1),
  CodigoCtacte: Joi.string().min(1).max(3),
  CodigoIVA: Joi.string().min(1).max(3),
  CitiVentas: Joi.number().integer().min(0).max(1),
  codigoTipo: Joi.number().integer(),
  EntidadId: Joi.number().integer(),
  NombreAbreviado: Joi.string().min(1).max(15),
  Tiponumerador: Joi.string().min(1).max(1),
  mueveStock: Joi.number().integer().min(0).max(1),
  usaEscaner: Joi.number().integer().min(0).max(1),
  usaFacturaElectronica: Joi.number().integer().min(0).max(1),
  EmpresaId: Joi.number().integer().required(),
});

// #endregion

class ReceiptPaymentValidationRequest {
  toNewReceiptPaymentEntry = (object) => {
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
          "TipoComprobanteId",
          "AfipComprobanteId",
          "CitiVentas",
          "codigoTipo",
          "EntidadId",
          "mueveStock",
          "usaEscaner",
          "usaFacturaElectronica",
          "EmpresaId",
        ].includes(property)
      )
        objectToReturn[property] = parseInt(object[property]);
    }
    return objectToReturn;
  };
}

module.exports = ReceiptPaymentValidationRequest;
