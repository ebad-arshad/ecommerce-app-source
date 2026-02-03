const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/userRepository");
const config = require("../config");

class AuthService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async login(user) {
        const dbUser = await this.userRepository.getUserByUsername(user.username);

        if (!dbUser) {
            return { success: false, message: "Invalid username or password" };
        }

        const isMatch = await bcrypt.compare(user.password, dbUser.password);

        if (!isMatch) {
            return { success: false, message: "Invalid username or password" };
        }

        const token = jwt.sign({ id: dbUser.id, role: dbUser.role }, config.jwtSecret);

        return { success: true, token };
    }

    async register(user) {
        const userExists = await this.userRepository.getUserByUsername(user.username);

        if (userExists) {
            return { success: false, message: "Username already exists" };
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        const dbUser = await this.userRepository.createUser(user);

        const token = jwt.sign({ id: dbUser.id, role: dbUser.role }, config.jwtSecret);

        return { success: true, token };
    }
}

module.exports = AuthService;