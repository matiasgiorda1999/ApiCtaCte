const CheckingAccountController = require("../controllers/CheckingAccountController");
const CheckingAccountValidationRequest = require("../validationRequest/CheckingAccountValidationRequest");
const Code = require("../reponses/responseCode");
const Message = require("../reponses/responseMessage");
const checkJwt = require("../validationRequest/SecurityValidation");
const express = require("express");
const router = express.Router();

router.post("/cuentas-corrientes", checkJwt, async (request, response) => {
  const checkingAccountController = new CheckingAccountController();
  try {
    const params = new CheckingAccountValidationRequest();
    await checkingAccountController.createCheckingAccount(
      params.toNewCheckingAccountEntry(request.body)
    );
    response.statusCode = Code.CREATED;
    response.statusMessage = Message.CREATED;
    response.send();
  } catch (error) {
    console.log(error);
    const CODE_ERROR = error.errorCode || Code.INTERNAL_SERVER_ERROR;
    response.statusCode = CODE_ERROR;
    response.statusMessage = Message.ERROR;
    response.json(error.jsonResponse());
  }
});

router.get(
  "/cuentas-corrientes/movimientos",
  checkJwt,
  async ({ query }, response) => {
    const checkingAccountController = new CheckingAccountController();
    try {
      const checkingAccountValidationRequest =
        new CheckingAccountValidationRequest();
      checkingAccountValidationRequest.validateQueryParams(query);
      const data = await checkingAccountController.checkingAccountMovements(
        query
      );
      response.statusCode = Code.OK;
      response.statusMessage = Message.OK;
      response.send(data);
    } catch (error) {
      const CODE_ERROR = error.errorCode || Code.INTERNAL_SERVER_ERROR;
      response.statusCode = CODE_ERROR;
      response.statusMessage = Message.ERROR;
      response.json(error.jsonResponse());
    }
  }
);

module.exports = router;
