const ClientManagementSystem = require("../systems/ClientManagementSystem");

class ClientController {
  #clientMangementSystem;

  constructor() {
    this.#clientMangementSystem = new ClientManagementSystem();
  }

  async createClient(client) {
    return await this.#clientMangementSystem.createClient(client);
  }
}

module.exports = ClientController;
