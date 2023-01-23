const ReceiptPaymentController = require("../controllers/ReceiptPaymentController");
const ReceiptPaymentValidationRequest = require("../validationRequest/ReceiptPaymentValidationRequest");
const Code = require("../reponses/responseCode");
const Message = require("../reponses/responseMessage");
const checkJwt = require("../validationRequest/SecurityValidation");
const express = require("express");
const router = express.Router();

router.post("/tipos-comprobantes", checkJwt, async (request, response) => {
  const receiptPaymentController = new ReceiptPaymentController();
  try {
    const params = new ReceiptPaymentValidationRequest();
    await receiptPaymentController.createReceiptPayment(
      params.toNewReceiptPaymentEntry(request.body)
    );
    response.statusCode = Code.CREATED;
    response.statusMessage = Message.CREATED;
    response.send();
  } catch (error) {
    const CODE_ERROR = error.errorCode || Code.INTERNAL_SERVER_ERROR;
    response.statusCode = CODE_ERROR;
    response.statusMessage = Message.ERROR;
    console.log(error);
    response.json(error.jsonResponse());
  }
});

module.exports = router;
