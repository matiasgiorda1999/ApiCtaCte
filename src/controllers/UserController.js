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

  async getUsers(nameFilter) {
    return await this.#userMangementSystem.getUsers(nameFilter);
  }
}

module.exports = UserController;
