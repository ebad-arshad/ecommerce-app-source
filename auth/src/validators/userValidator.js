const { object, string } = require('yup');

const userLoginSchema = object({
    username: string().required().min(4).max(20),
    password: string().required().min(8).max(20),
});

const userRegisterSchema = object({
    username: string().required().min(4).max(20),
    password: string().required().min(8).max(20),
    role: string().oneOf(['buyer', 'seller']).required()
});

module.exports = { userLoginSchema, userRegisterSchema };