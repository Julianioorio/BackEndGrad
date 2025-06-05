const express = require("express");
const mysql = require('mysql2');
const cors = require("cors");
const app = express();
const port = 4000;

app.use(cors()); 
app.use(express.json()); 

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'julianMak',
  database: 'my_database',
});

db.connect(err => {
  if (err) {
    console.error('Ошибка подключения к MySQL:', err.message);
  } else {
    console.log('Подключено к MySQL');
  }
});

app.get('/products', (req, res) => {
  const { tons } = req.query; // Получаем параметр tons из query-строки

  // Базовый SQL запрос
  let sql = 'SELECT * FROM products';
  const params = [];

  // Если параметр tons передан, добавляем условие WHERE
  if (tons) {
    sql += ' WHERE tons = ?';
    params.push(tons);
  }

  // Выполняем запрос с параметрами
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).send('Ошибка БД');
    res.json(results);
  });
});

app.get("/", (req, res) => {
  res.send("Привет!");
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
