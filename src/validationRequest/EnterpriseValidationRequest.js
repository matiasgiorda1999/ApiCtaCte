const PropertyRequiredError = require("../errors/PropertyRequiredError");
const Joi = require("joi");

// #region validators

const queryParamsValidations = Joi.object({
  idUsuario: Joi.string().min(30).max(30),
});

const enterpriseToAddValidation = Joi.object({
  CUIT: Joi.string().min(13).max(13).required(),
  nombre: Joi.string().min(1).max(45).required(),
  imagenURL: Joi.allow(),
  calle: Joi.string().min(1).max(45).required(),
  numeroCalle: Joi.number().integer().required(),
  Localidad: Joi.string().min(1).max(45).required(),
  AfipProvinciaId: Joi.number().integer().required(),
  AfipPaisId: Joi.number().integer().required(),
  AfipResponsableId: Joi.number().integer().required(),
  AfipIngBrutosId: Joi.number().integer().required(),
});

// #endregion

class EnterpriseValidationRequest {
  validateQueryParams = (queryParams) => {
    const { error } = queryParamsValidations.validate(queryParams);
    if (error) throw new PropertyRequiredError(error.message);
  };

  validateEnterpriseToAdd = (enterprise) => {
    const { error } = enterpriseToAddValidation.validate(enterprise);
    if (error) throw new PropertyRequiredError(error.message);
  };
}

module.exports = EnterpriseValidationRequest;
