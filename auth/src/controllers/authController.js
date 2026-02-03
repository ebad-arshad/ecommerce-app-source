const AuthService = require("../services/authService");
const { userLoginSchema, userRegisterSchema } = require("../validators/userValidator");

class AuthController {
    constructor() {
        this.authService = new AuthService();
    }

    async login(req, res) {
        try {
            const user = await userLoginSchema.validate(req.body);
            const result = await this.authService.login(user);

            if (result.success) {
                return res.json({ token: result.token });
            }
            else {
                return res.status(400).json({ message: result.message });
            }
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    }

    async register(req, res) {
        try {
            const user = await userRegisterSchema.validate(req.body);
            const result = await this.authService.register(user);

            if (result.success) {
                return res.json({ token: result.token });
            }
            else {
                return res.status(400).json({ message: result.message });
            }
        }
        catch (err) {
            return res.status(400).json({ message: err.message });
        }
    }
}

module.exports = AuthController;