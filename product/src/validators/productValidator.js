const { object, string, number } = require('yup');

const createProductSchema = object({
    name: string().required().trim().min(4).max(50),
    description: string().required().trim().min(4),
    stock: number().positive().required()
});

// Atleast one of name, description or stock is required
const updateProductSchema = object().shape({
    name: string().when(['description', 'stock'], {
        is: (description, stock) => !description && !stock,
        then: (schema) => schema.trim().min(4).max(50).required()
    }),
    description: string().when(['name', 'stock'], {
        is: (name, stock) => !name && !stock,
        then: (schema) => schema.trim().min(4).required()
    }),
    stock: number().when(['name', 'description'], {
        is: (name, description) => !name && !description,
        then: (schema) => schema.positive().required()
    })
}, [['name', 'description'], ['name', 'stock'], ['description', 'stock']])

module.exports = { createProductSchema, updateProductSchema };