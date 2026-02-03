const User = require("../models/user");

class UserRepository {
    async createUser(user) {
        return await User.query().insert(user);
    }

    async getUserByUsername(username) {
        return await User.query().findOne({ username });
    }
}

module.exports = UserRepository;