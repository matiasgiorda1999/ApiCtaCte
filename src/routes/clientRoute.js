const ClientController = require("../controllers/ClientController");
const ClientValidationRequest = require("../validationRequest/ClientValidationRequest");
const Code = require("../reponses/responseCode");
const Message = require("../reponses/responseMessage");
const checkJwt = require("../validationRequest/SecurityValidation");
const express = require("express");
const router = express.Router();

router.post("/clientes", checkJwt, async (request, response) => {
  const clientController = new ClientController();
  try {
    const params = new ClientValidationRequest();
    await clientController.createClient(params.toNewClientEntry(request.body));
    response.statusCode = Code.CREATED;
    response.statusMessage = Message.CREATED;
    response.send();
  } catch (error) {
    const CODE_ERROR = error.errorCode || Code.INTERNAL_SERVER_ERROR;
    response.statusCode = CODE_ERROR;
    response.statusMessage = Message.ERROR;
    response.json(error.jsonResponse());
  }
});

module.exports = router;
