const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  // найти вообще всех
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send(`Произошла ошибка ${err.name}: ${err.message}`));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const id = req.user._id;

  Card.create({ name, link, owner: id })
    .then((card) => card.populate('owner'))
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send(`Произошла ошибка ${err.name}: ${err.message}`));
};

module.exports.deleteCard = (req, res) => {
  // Удаление конкретной записи
  Card.findByIdAndRemove(req.body.id)
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send(`Произошла ошибка ${err.name}: ${err.message}`));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send(`Произошла ошибка ${err.name}: ${err.message}`));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send(`Произошла ошибка ${err.name}: ${err.message}`));
};
