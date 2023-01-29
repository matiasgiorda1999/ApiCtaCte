const EnterpriseController = require("../controllers/EnterpriseController");
const EnterpriseValidationRequest = require("../validationRequest/EnterpriseValidationRequest");
const Code = require("../reponses/responseCode");
const Message = require("../reponses/responseMessage");
const checkJwt = require("../validationRequest/SecurityValidation");
const express = require("express");
const router = express.Router();

router.get(
  "/empresas/:enterprise_id",
  checkJwt,
  async ({ params }, response) => {
    try {
      const enterpriseController = new EnterpriseController();
      const enterprise = await enterpriseController.getEnterprise(
        params.enterprise_id
      );
      response.statusCode = Code.OK;
      response.statusMessage = Message.OK;
      response.send(enterprise);
    } catch (error) {
      const CODE_ERROR = error.errorCode || Code.INTERNAL_SERVER_ERROR;
      response.statusCode = CODE_ERROR;
      response.statusMessage = Message.ERROR;
      response.json(error.jsonResponse());
    }
  }
);

router.get("/empresas", checkJwt, async ({ query }, response) => {
  try {
    const enterpriseController = new EnterpriseController();
    const enterpriseValidationRequest = new EnterpriseValidationRequest();
    enterpriseValidationRequest.validateQueryParams(query);
    const enterprises = await enterpriseController.getEnterprisesFilteredBy(
      query
    );
    response.statusCode = Code.OK;
    response.statusMessage = Message.OK;
    response.send(enterprises);
  } catch (error) {
    const CODE_ERROR = error.errorCode || Code.INTERNAL_SERVER_ERROR;
    response.statusCode = CODE_ERROR;
    response.statusMessage = Message.ERROR;
    console.log(error);
    response.json(error.jsonResponse());
  }
});

router.post("/empresas", checkJwt, async ({ body }, response) => {
  try {
    const enterpriseController = new EnterpriseController();
    const enterpriseValidationRequest = new EnterpriseValidationRequest();
    enterpriseValidationRequest.validateEnterpriseToAdd(body);
    await enterpriseController.createEnterprise(body);
    response.statusCode = Code.CREATED;
    response.statusMessage = Message.CREATED;
    response.send({
      name: "Empresa",
      code: Code.CREATED,
      description: "Empresa creada",
    });
  } catch (error) {
    const CODE_ERROR = error.errorCode || Code.INTERNAL_SERVER_ERROR;
    response.statusCode = CODE_ERROR;
    response.statusMessage = Message.ERROR;
    response.json(error.jsonResponse());
  }
});

module.exports = router;
