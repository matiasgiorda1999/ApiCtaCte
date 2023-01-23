const PropertyRequiredError = require("../errors/PropertyRequiredError");
const Joi = require("joi");

// #region validators

const parametersFromNewRequest = Joi.object({
  cuit: Joi.string().min(11).max(15).required(),
});

const queryParamsValidation = Joi.object({
  enterprise: Joi.number().integer().required(),
  cuit: Joi.string().min(13).max(13).required(),
});

// #endregion

class UserValidationRequest {
  toUpdateMetadata = (object) => {
    const { error } = parametersFromNewRequest.validate(object);
    if (error) throw new PropertyRequiredError(error.message);
    return object;
  };

  validateQueryParams = (queryParams) => {
    const { error } = queryParamsValidation.validate(queryParams);
    if (error) throw new PropertyRequiredError(error.message);
  };
}

module.exports = UserValidationRequest;
