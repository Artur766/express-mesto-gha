const { celebrate, Joi } = require('celebrate');

const userIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
});

const userUpdateInfoValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const userUpdateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().uri({
      scheme: ['http', 'https'],
    }).pattern(/\.(jpg|jpeg|png|gif)$/),
  }),
});

const signIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(24).required(),
  }),
});

const signUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(24).required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri({
      scheme: ['http', 'https'],
    }).pattern(/^https?:\/\/(www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+#?$/),
  }),
});

const cardCreateValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().uri({
      scheme: ['http', 'https'],
    }).pattern(/^https?:\/\/(www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+#?$/),
  }),
});

const cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  signIn,
  signUp,
  userIdValidation,
  userUpdateAvatarValidation,
  userUpdateInfoValidation,
  cardCreateValidation,
  cardIdValidation,
};
