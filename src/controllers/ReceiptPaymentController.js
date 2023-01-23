const ReceiptPaymentManagementSystem = require("../systems/ReceiptPaymentManagementSystem");

class ReceiptPaymentController {
  #receiptPaymentManagementSystem;

  constructor() {
    this.#receiptPaymentManagementSystem = new ReceiptPaymentManagementSystem();
  }

  async createReceiptPayment(receiptPayment) {
    return await this.#receiptPaymentManagementSystem.createReceiptPayment(
      receiptPayment
    );
  }
}

module.exports = ReceiptPaymentController;
