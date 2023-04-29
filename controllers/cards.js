const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  // найти вообще всех
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла внутренняя ошибка сервера.' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const id = req.user._id;

  Card.create({ name, link, owner: id })
    .then((card) => card.populate('owner'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      return res.status(500).send({ message: 'Произошла внутренняя ошибка сервера.' });
    });
};

module.exports.deleteCard = (req, res) => {
  // Удаление конкретной записи
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) return res.status(400).send({ message: 'Карточка с указанным id не найдена.' });
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: 'Переданы некорректные данные для удаления карточки.' });
      return res.status(500).send({ message: 'Произошла внутренняя ошибка сервера.' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) return res.status(404).send({ message: 'Пользователь с указанным id не найден.' });
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      return res.status(500).send({ message: 'Произошла внутренняя ошибка сервера.' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) return res.status(404).send({ message: 'Пользователь с указанным id не найден.' });
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(400).send({ message: 'Переданы некорректные данные для снятии лайка.' });
      return res.status(500).send({ message: 'Произошла внутренняя ошибка сервера.' });
    });
};
