const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  // найти вообще всех
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send(`Произошла ошибка ${err.name}: ${err.message}`));
};

module.exports.getUserId = (req, res) => {
  if (req.params.userId) {
    res.status(404).send('Пользователь по указанному _id не найден.');
    return;
  }

  // ищет запись по идентификатору
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send(`Произошла ошибка ${err.name}: ${err.message}`));
};

module.exports.createUser = (req, res) => {
  // ищет запись по идентификатору
  const { name, about, avatar } = req.body;

  if (!name) {
    res.status(400).send('Переданы некорректные данные при создании пользователя.');
    return;
  }
  if (!about) {
    res.status(400).send('Переданы некорректные данные при создании пользователя.');
    return;
  }
  if (!avatar) {
    res.status(400).send('Переданы некорректные данные при создании пользователя.');
    return;
  }

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send(`Произошла ошибка ${err.name}: ${err.message}`));
};

module.exports.updateUserInfo = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  if (!name) {
    res.status(400).send('Переданы некорректные данные при обновлении профиля.');
    return;
  }
  if (!about) {
    res.status(400).send('Переданы некорректные данные при обновлении профиля.');
    return;
  }

  if (userId) {
    res.status(404).send('Пользователь по указанному _id не найден.');
    return;
  }

  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send(`Произошла ошибка ${err.name}: ${err.message}`));
};

module.exports.updateUserAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  if (!avatar) {
    res.status(400).send('Переданы некорректные данные при обновлении профиля.');
    return;
  }

  if (userId) {
    res.status(404).send('Пользователь по указанному _id не найден.');
    return;
  }

  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send(`Произошла ошибка ${err.name}: ${err.message}`));
};
