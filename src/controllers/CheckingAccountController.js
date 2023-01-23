const CheckingAccountManagementSystem = require("../systems/CheckingAccountManagementSystem");

class CheckingAccountController {
  #checkingAccountManagementSystem;

  constructor() {
    this.#checkingAccountManagementSystem =
      new CheckingAccountManagementSystem();
  }

  async createCheckingAccount(checkingAccount) {
    return await this.#checkingAccountManagementSystem.createCheckingAccount(
      checkingAccount
    );
  }

  async checkingAccountMovements(queryParams) {
    return await this.#checkingAccountManagementSystem.checkingAccountMovements(
      queryParams
    );
  }
}

module.exports = CheckingAccountController;
