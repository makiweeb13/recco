const Joi = require('joi');

const postSchema = Joi.object({
  title: Joi.string()
      .required(),

  rate: Joi.number()
      .required()
      .min(1)
      .max(10),

  status: Joi.string()
      .required(),

  genres: Joi.array()
      .items(Joi.number())
      .optional(),

  mediums: Joi.array()
      .items(Joi.number())
      .optional(),

  synopsis: Joi.string()
      .optional()
      .allow(''),

  review: Joi.string()
      .required()
});

const loginSchema = Joi.object({
  email: Joi.string()
      .email()
      .required(),

  password: Joi.string()
      .min(8)
      .pattern(new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/))
      .required()
})

const signupSchema = Joi.object({
  username: Joi.string()
      .min(4)
      .max(20)
      .required(),

  email: Joi.string()
      .email()
      .required(),

  password: Joi.string()
      .min(8)
      .pattern(new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/))
      .required(),

  confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
})

const profileSchema = Joi.object({
  username: Joi.string()
    .required(),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),

  bio: Joi.string()
    .max(50)
    .allow(null, '')
    .optional()
})

const commentSchema = Joi.object({
  post_id: Joi.number()
    .integer()
    .required(),

  content: Joi.string()
    .required(),

  parent_id: Joi.number()
    .integer()
    .allow(null)
    .optional()
})

// General validation middleware
const validator = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: error.details.map(err => err.message).join(', ') });
  }
  next();
};

module.exports = {
  postSchema,
  loginSchema,
  signupSchema,
  profileSchema,
  commentSchema,
  validator
}