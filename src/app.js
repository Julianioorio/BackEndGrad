const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
const port = 4000;

// Настройка middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "julianMak",
  database: "my_database",
});

db.connect((err) => {
  if (err) {
    console.error("Ошибка подключения к MySQL:", err.message);
  } else {
    console.log("Подключено к MySQL");
  }
});

app.get("/products", (req, res) => {
  const { tons } = req.query;
  let sql = "SELECT * FROM products";
  const params = [];

  if (tons) {
    sql += " WHERE tons = ?";
    params.push(tons);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).send("Ошибка БД");
    res.json(results);
  });
});

app.get("/", (req, res) => {
  res.send("Привет!");
});

// Маршрут для получения всех записей формы
app.get("/submissions", (req, res) => {
  const sql = "SELECT * FROM formsub ORDER BY created_at DESC";

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Ошибка при получении данных" });
    res.json(results);
  });
});

// Маршрут для сохранения данных формы
app.post("/submit", (req, res) => {
  const { name, "E-mail": email, tel, message, Agree } = req.body;

  if (!name || !tel) {
    return res.status(400).json({ error: "Пожалуйста, заполните имя и телефон" });
  }

  const agreeValue = Agree === "on" ? true : Boolean(Agree);
  const sql = "INSERT INTO formsub (name, `E-mail`, tel, message, Agree) VALUES (?, ?, ?, ?, ?)";
  const values = [name, email || null, tel, message || null, agreeValue];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Ошибка при сохранении данных" });
    }
    res.status(201).json({
      message: "Данные успешно сохранены",
      id: result.insertId,
    });
  });
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
