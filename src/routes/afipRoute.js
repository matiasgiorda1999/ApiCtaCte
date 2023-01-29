const AfipResourcesController = require("../controllers/AfipResourcesController");
const Code = require("../reponses/responseCode");
const Message = require("../reponses/responseMessage");
const checkJwt = require("../validationRequest/SecurityValidation");
const express = require("express");
const router = express.Router();

router.get("/afip-provincias", checkJwt, async (request, response) => {
  try {
    const afipResourcesController = new AfipResourcesController();
    const provinces = await afipResourcesController.getProvinces();
    response.statusCode = Code.OK;
    response.statusMessage = Message.OK;
    response.send(provinces);
  } catch (error) {
    const CODE_ERROR = error.errorCode || Code.INTERNAL_SERVER_ERROR;
    response.statusCode = CODE_ERROR;
    response.statusMessage = Message.ERROR;
    console.log(error);
    response.json(error.jsonResponse());
  }
});

router.get("/afip-paises", checkJwt, async (request, response) => {
  try {
    const afipResourcesController = new AfipResourcesController();
    const countries = await afipResourcesController.getCountries();
    response.statusCode = Code.OK;
    response.statusMessage = Message.OK;
    response.send(countries);
  } catch (error) {
    const CODE_ERROR = error.errorCode || Code.INTERNAL_SERVER_ERROR;
    response.statusCode = CODE_ERROR;
    response.statusMessage = Message.ERROR;
    console.log(error);
    response.json(error.jsonResponse());
  }
});

router.get("/afip-responsables", checkJwt, async (request, response) => {
  try {
    const afipResourcesController = new AfipResourcesController();
    const responsables = await afipResourcesController.getResponsables();
    response.statusCode = Code.OK;
    response.statusMessage = Message.OK;
    response.send(responsables);
  } catch (error) {
    const CODE_ERROR = error.errorCode || Code.INTERNAL_SERVER_ERROR;
    response.statusCode = CODE_ERROR;
    response.statusMessage = Message.ERROR;
    console.log(error);
    response.json(error.jsonResponse());
  }
});

router.get("/afip-ingresos-brutos", checkJwt, async (request, response) => {
  try {
    const afipResourcesController = new AfipResourcesController();
    const incomes = await afipResourcesController.getIncomes();
    response.statusCode = Code.OK;
    response.statusMessage = Message.OK;
    response.send(incomes);
  } catch (error) {
    const CODE_ERROR = error.errorCode || Code.INTERNAL_SERVER_ERROR;
    response.statusCode = CODE_ERROR;
    response.statusMessage = Message.ERROR;
    console.log(error);
    response.json(error.jsonResponse());
  }
});

module.exports = router;
