const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const FordBidden = require('../errors/fordbidden-err');

module.exports.getCards = (req, res, next) => {
  // найти вообще всех
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') return next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  // Удаление конкретной записи
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NotValidId'))
    .then((card) => {
      if (req.user._id !== card.owner.toString()) {
        throw new FordBidden('У вас нет прав на удаление этой карточки.');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') return next(new NotFoundError('Запрашиваемый карточка не найдена.'));
      if (err.name === 'CastError') return next(new BadRequestError('Переданы некорректные данные для удаления карточки.'));
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotValidId') return next(new NotFoundError('Запрашиваемый карточка не найдена.'));
      if (err.name === 'CastError') return next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotValidId') next(new NotFoundError('Запрашиваемый карточка не найдена.'));
      if (err.name === 'CastError') return next(new BadRequestError('Переданы некорректные данные для снятии лайка.'));
      return next(err);
    });
};
