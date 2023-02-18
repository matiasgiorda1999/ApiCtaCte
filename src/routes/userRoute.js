const UserController = require("../controllers/UserController");
const UserValidationRequest = require("../validationRequest/UserValidationRequest");
const Code = require("../reponses/responseCode");
const Message = require("../reponses/responseMessage");
const checkJwt = require("../validationRequest/SecurityValidation");
const express = require("express");
const router = express.Router();

router.post(
  "/usuario-metadata/:userUniqueName",
  checkJwt,
  async ({ body, params }, response) => {
    const userController = new UserController();
    try {
      const queryParams = new UserValidationRequest();
      await userController.updateUserMetadata(
        queryParams.toUpdateMetadata(body),
        params.userUniqueName
      );
      response.statusCode = Code.OK;
      response.statusMessage = Message.OK;
      response.send();
    } catch (error) {
      const CODE_ERROR = error.errorCode || Code.INTERNAL_SERVER_ERROR;
      response.statusCode = CODE_ERROR;
      response.statusMessage = Message.ERROR;
      response.json(error.jsonResponse());
    }
  }
);

router.get("/usario/datos", checkJwt, async ({ query }, response) => {
  try {
    const userController = new UserController();
    const userValidation = new UserValidationRequest();
    userValidation.validateQueryParams(query);
    const data = await userController.getClientData(query);
    response.statusCode = Code.OK;
    response.statusMessage = Message.OK;
    response.send(data);
  } catch (error) {
    const CODE_ERROR = error.errorCode || Code.INTERNAL_SERVER_ERROR;
    response.statusCode = CODE_ERROR;
    response.statusMessage = Message.ERROR;
    console.log(error);
    response.json(error.jsonResponse());
  }
});

router.get("/usuarios", checkJwt, async ({ query }, response) => {
  try {
    const userController = new UserController();
    const data = await userController.getUsers(query.nameFilter);
    response.statusCode = Code.OK;
    response.statusMessage = Message.OK;
    response.send(data);
  } catch (error) {
    const CODE_ERROR = error.errorCode || Code.INTERNAL_SERVER_ERROR;
    response.statusCode = CODE_ERROR;
    response.statusMessage = Message.ERROR;
    console.log(error);
    response.json(error.jsonResponse());
  }
});

module.exports = router;
