const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  // найти вообще всех
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Произошла внутренняя ошибка сервера.' }));
};

module.exports.getUserId = (req, res) => {
  // ищет запись по идентификатору
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) return res.status(404).send({ message: 'Запрашиваемый пользователь не найден.' });
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: 'Переданы некорректные данные с некорректным id.' });
      return res.status(500).send({ message: 'Произошла внутренняя ошибка сервера.' });
    });
};

module.exports.createUser = (req, res) => {
  // ищет запись по идентификатору
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      return res.status(500).send({ message: 'Произошла внутренняя ошибка сервера.' });
    });
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
      // if (!user) return res.status(404).send({ message: 'Пользователь с указанным id не найден.' });
      return res.send(user);
    })
    .catch((err) => {
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
      // if (!user) return res.status(404).send({ message: 'Пользователь с указанным id не найден.' });
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      return res.status(500).send({ message: 'Произошла внутренняя ошибка сервера.' });
    });
};
