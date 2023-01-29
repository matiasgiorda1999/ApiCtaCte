const AfipResourcesManagementSystem = require("../systems/AfipResourcesManagementSystem");

class AfipResourcesController {
  #afipResourcesManagementSystem;

  constructor() {
    this.#afipResourcesManagementSystem = new AfipResourcesManagementSystem();
  }

  async getProvinces() {
    return await this.#afipResourcesManagementSystem.getProvinces();
  }

  async getCountries() {
    return await this.#afipResourcesManagementSystem.getCountries();
  }

  async getResponsables() {
    return await this.#afipResourcesManagementSystem.getResponsables();
  }

  async getIncomes() {
    return await this.#afipResourcesManagementSystem.getIncomes();
  }
}

module.exports = AfipResourcesController;
