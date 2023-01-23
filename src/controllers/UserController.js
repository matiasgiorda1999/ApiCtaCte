const UserManagementSystem = require("../systems/UserManagementSystem");

class UserController {
  #userMangementSystem;

  constructor() {
    this.#userMangementSystem = new UserManagementSystem();
  }

  async updateUserMetadata(userMetadata, userUniqueName) {
    return await this.#userMangementSystem.updateUserMetadata(
      userMetadata,
      userUniqueName
    );
  }

  async getClientData(queryParams) {
    return await this.#userMangementSystem.getClientData(queryParams);
  }
}

module.exports = UserController;
