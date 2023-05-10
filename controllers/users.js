const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports.getUsers = (req, res) => {
  // найти вообще всех
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Произошла внутренняя ошибка сервера.' }));
};

module.exports.getUserId = (req, res) => {
  // ищет запись по идентификатору
  User.findById(req.params.userId)
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') return res.status(404).send({ message: 'Запрашиваемый пользователь не найден.' });
      if (err.name === 'CastError') return res.status(400).send({ message: 'Переданы некорректные данные с некорректным id.' });
      return res.status(500).send({ message: 'Произошла внутренняя ошибка сервера.' });
    });
};

module.exports.createUser = (req, res) => {
  // ищет запись по идентификатору
  const {
    name,
    about,
    avatar,
    email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => res.status(201).send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
        return res.status(500).send({ message: 'Произошла внутренняя ошибка сервера.' });
      }));
};

module.exports.updateUserInfo = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      if (!user) return res.status(404).send({ message: 'Пользователь с указанным id не найден.' });
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: 'Переданы некорректные данные с некорректным id.' });
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      return res.status(500).send({ message: 'Произошла внутренняя ошибка сервера.' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      if (!user) return res.status(404).send({ message: 'Пользователь с указанным id не найден.' });
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: 'Переданы некорректные данные с некорректным id.' });
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      return res.status(500).send({ message: 'Произошла внутренняя ошибка сервера.' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => res.status(401).send({ message: err.message }));
};

module.exports.getCurrentUser = (req, res) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) return;
      res.send(user);
    })
    .catch((err) => res.status(500).send({ message: 'Произошла внутренняя ошибка сервера.' }));
};
