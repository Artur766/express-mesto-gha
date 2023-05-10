const express = require('express');
const mongoose = require('mongoose');

const helmet = require('helmet');

const { PORT = 3000 } = process.env;

const app = express();
const bodyParser = require('body-parser');

const { signIn, signUp } = require('./middlewares/validations');

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { handleError } = require('./middlewares/handleError');

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('Подключение к базе данных прошло успешно');
  })
  .catch((err) => {
    console.error(`Ошибка подключения к базе данных: ${err.message}`);
    process.exit(1);
  });

app.use(helmet());

// роуты, не требующие авторизации,
app.post('/signup', signUp, createUser);
app.post('/signin', signIn, login);

// авторизация
app.use(auth);

// роуты, которым авторизация нужна
app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));

app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

app.use(handleError);

app.listen(PORT, () => {
  console.log('Server started on port 3000');
});
