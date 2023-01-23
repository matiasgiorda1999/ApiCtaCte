const PropertyRequiredError = require("../errors/PropertyRequiredError");
const Joi = require("joi");

// #region validators

const parametersFromNewRequest = Joi.object({
  CtaCteId: Joi.number().integer().required(),
  ClienteId: Joi.number().integer(),
  Fecha: Joi.string().min(8).max(8),
  NroAsiento: Joi.number().integer(),
  TipoComprobanteId: Joi.number().integer(),
  Importe: Joi.string().min(1).max(23),
  DH: Joi.number().integer().min(0).max(1),
  Gravado: Joi.string().min(1).max(23),
  Alicuota: Joi.string().min(1).max(23),
  FVto: Joi.string().min(8).max(8),
  Cuota: Joi.number().integer(),
  Letra: Joi.string().min(0).max(1),
  Prefijo: Joi.number().integer(),
  Nro: Joi.number().integer(),
  Saldo: Joi.string().min(1).max(23),
  Cancelado: Joi.number().integer().min(0).max(1),
  Detalle: Joi.string().min(1).max(100),
  Cotizacion: Joi.string().min(1).max(23),
  Fcarga: Joi.string().min(8).max(8),
  CuentaContableID: Joi.number().integer(),
  cierreMensual: Joi.number().integer().min(0).max(1),
  Tieneimagen: Joi.number().integer().min(0).max(1),
  FAplica: Joi.string().min(8).max(8),
  EmpresaId: Joi.number().integer().required(),
});

const queryParamsValidations = Joi.object({
  "date-from": Joi.string().min(10).max(10).required(),
  "date-to": Joi.string().min(10).max(10).required(),
  enterprise: Joi.number().integer().required(),
  cuit: Joi.string().min(11).max(15).required(),
});

// #endregion

class CheckingAccountValidationRequest {
  toNewCheckingAccountEntry = (object) => {
    const objectToValidate = this.parseValues(object);
    const { error } = parametersFromNewRequest.validate(objectToValidate);
    if (error) throw new PropertyRequiredError(error.message);
    return objectToValidate;
  };

  validateQueryParams = (queryParams) => {
    const { error } = queryParamsValidations.validate(queryParams);
    if (error) throw new PropertyRequiredError(error.message);
  };

  parseValues = (object) => {
    const objectToReturn = { ...object };
    for (const property in object) {
      if (
        [
          "CtaCteId",
          "ClienteId",
          "NroAsiento",
          "TipoComprobanteId",
          "DH",
          "Cuota",
          "Prefijo",
          "Nro",
          "Cancelado",
          "CuentaContableID",
          "cierreMensual",
          "Tieneimagen",
          "EmpresaId",
        ].includes(property)
      )
        objectToReturn[property] = parseInt(object[property]);

      if (["Fecha", "FVto", "Fcarga", "FAplica"].includes(property)) {
        let [day, month, year] = object[property].slice(0, 10).split("/");
        year = year.slice(0, 4);
        month = parseInt(month) < 10 ? `0${month}` : month;
        day = parseInt(day) < 10 ? `0${day}` : day;
        objectToReturn[property] = `${year}${month}${day}`;
      }
    }
    return objectToReturn;
  };
}

module.exports = CheckingAccountValidationRequest;
