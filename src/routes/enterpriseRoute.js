const EnterpriseController = require("../controllers/EnterpriseController");
const EnterpriseValidationRequest = require("../validationRequest/EnterpriseValidationRequest");
const Code = require("../reponses/responseCode");
const Message = require("../reponses/responseMessage");
const checkJwt = require("../validationRequest/SecurityValidation");
const express = require("express");
const router = express.Router();
//---- imagen ----
const multer = require("multer");
const path = require("path");
const diskStorage = multer.diskStorage({
  destination: path.join(__dirname, "../images"),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const fileUpload = multer({ storage: diskStorage }).single("imagenURL");

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

router.post("/empresas", fileUpload, async ({ body, file }, response) => {
  try {
    const enterpriseController = new EnterpriseController();
    const enterpriseValidationRequest = new EnterpriseValidationRequest();
    enterpriseValidationRequest.validateEnterpriseToAdd(body);
    body.imagenURL = `http://localhost:3001/${file.originalname}`;
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

router.put(
  "/empresas/:enterprise_id",
  fileUpload,
  async ({ body, params, file }, response) => {
    try {
      const enterpriseController = new EnterpriseController();
      const enterpriseValidationRequest = new EnterpriseValidationRequest();
      enterpriseValidationRequest.validateEnterpriseToAdd(body);
      if (file) body.imagenURL = `http://localhost:3001/${file.originalname}`;
      else {
        delete body.imagenURL;
      }
      await enterpriseController.updateEnterprise(params.enterprise_id, body);
      response.statusCode = Code.CREATED;
      response.statusMessage = Message.CREATED;
      response.send({
        name: "Empresa",
        code: Code.CREATED,
        description: "Empresa editada",
      });
    } catch (error) {
      const CODE_ERROR = error.errorCode || Code.INTERNAL_SERVER_ERROR;
      response.statusCode = CODE_ERROR;
      response.statusMessage = Message.ERROR;
      response.json(error.jsonResponse());
    }
  }
);

router.delete(
  "/empresas/:enterprise_id",
  checkJwt,
  async ({ params }, response) => {
    try {
      const enterpriseController = new EnterpriseController();
      await enterpriseController.deleteEnterprise(params.enterprise_id);
      response.statusCode = Code.CREATED;
      response.statusMessage = Message.CREATED;
      response.send({
        name: "Empresa",
        code: Code.OK,
        description: "Empresa eliminada",
      });
    } catch (error) {
      const CODE_ERROR = error.errorCode || Code.INTERNAL_SERVER_ERROR;
      response.statusCode = CODE_ERROR;
      response.statusMessage = Message.ERROR;
      response.json(error.jsonResponse());
    }
  }
);

router.post(
  "/asignar-usuarios/empresas/:enterprise_id",
  checkJwt,
  async ({ body, params }, response) => {
    try {
      const enterpriseController = new EnterpriseController();
      await enterpriseController.assignUsersToEnterprise(
        params.enterprise_id,
        body.users
      );
      response.statusCode = Code.CREATED;
      response.statusMessage = Message.CREATED;
      response.send({
        name: "Empresa",
        code: Code.OK,
        description: "Asignaciones de usuarios realizadas",
      });
    } catch (error) {
      console.log(error);
      const CODE_ERROR = error.errorCode || Code.INTERNAL_SERVER_ERROR;
      response.statusCode = CODE_ERROR;
      response.statusMessage = Message.ERROR;
      response.json(error.jsonResponse());
    }
  }
);

module.exports = router;
