const EnterpriseManagementSystem = require("../systems/EnterpriseManagementSystem");

class EnterpriseController {
  #enterpriseManagementSystem;

  constructor() {
    this.#enterpriseManagementSystem = new EnterpriseManagementSystem();
  }

  async getEnterprise(enterpriseId) {
    return await this.#enterpriseManagementSystem.getEnterprise(enterpriseId);
  }

  async createEnterprise(enterprise) {
    return await this.#enterpriseManagementSystem.createEnterprise(enterprise);
  }

  async getEnterprisesFilteredBy(queryParams) {
    return await this.#enterpriseManagementSystem.getEnterprisesFilteredBy(
      queryParams
    );
  }
}

module.exports = EnterpriseController;
