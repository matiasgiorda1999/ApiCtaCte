const PropertyRequiredError = require("../errors/PropertyRequiredError");
const Joi = require("joi");

// #region validators

const queryParamsValidations = Joi.object({
  idUsuario: Joi.string().min(30).max(30).required(),
});

// #endregion

class EnterpriseValidationRequest {
  validateQueryParams = (queryParams) => {
    const { error } = queryParamsValidations.validate(queryParams);
    if (error) throw new PropertyRequiredError(error.message);
  };
}

module.exports = EnterpriseValidationRequest;
