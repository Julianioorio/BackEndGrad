const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
const port = 4000;

// Настройка middleware
app.use(
  cors({
    origin: true, // Разрешаем все источники
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Добавляем логирование всех запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  next();
});

// Важно: сначала настраиваем парсинг URL-encoded данных
app.use(express.urlencoded({ extended: true }));
// Затем настраиваем парсинг JSON
app.use(express.json());

// Добавляем обработчик ошибок
app.use((err, req, res, next) => {
  console.error("Ошибка сервера:", err);
  res.status(500).json({
    error: "Внутренняя ошибка сервера",
    details: err.message,
  });
});

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

    // Проверяем существование таблицы
    db.query("SHOW TABLES LIKE 'formsub'", (err, results) => {
      if (err) {
        console.error("Ошибка при проверке таблицы:", err);
      } else if (results.length === 0) {
        console.log("Таблица formsub не существует, создаем...");
        const createTableSQL = `
          CREATE TABLE formsub (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            \`E-mail\` VARCHAR(255),
            tel VARCHAR(20) NOT NULL,
            message TEXT,
            Agree BOOLEAN DEFAULT false,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;
        db.query(createTableSQL, (err) => {
          if (err) {
            console.error("Ошибка при создании таблицы:", err);
          } else {
            console.log("Таблица formsub успешно создана");
          }
        });
      } else {
        console.log("Таблица formsub существует");
      }
    });
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
  try {
    const name = req.body.name;
    const email = req.body["E-mail"];
    const tel = req.body.tel;
    const message = req.body.message;
    const agree = req.body.Agree;

    if (!name || !tel) {
      return res.status(400).json({ error: "Пожалуйста, заполните имя и телефон" });
    }

    const agreeValue = agree === "on" ? true : Boolean(agree);
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
  } catch (error) {
    res.status(500).json({ error: "Ошибка при обработке запроса" });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
