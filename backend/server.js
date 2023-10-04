const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const uuid = require("uuid");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
const http = require("http");

const { DB_HOST, DB_NAME, DB_USER, DB_PASS, PORT } = process.env;

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders:
      "Content-Type,Authorization,X-Requested-With,Accept,Origin,Access-Control-Request-Method,Access-Control-Request-Headers",
    exposedHeaders:
      "Content-Type,Authorization,X-Requested-With,Accept,Origin,Access-Control-Request-Method,Access-Control-Request-Headers",
    optionsSuccessStatus: 200,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));

const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to database");
  }
});

// 1	id Primaire	int(11)			Non	Aucun(e)		AUTO_INCREMENT
// 	2	user_uuid	varchar(255)
// 	3	user_firstname	varchar(255)
// 	4	user_lastname	varchar(255)
// 	5	user_email	varchar(255)
// 	6	user_password	varchar(255)
// 	7	user_pro	tinyint(1)
// 8	user_secret	varchar(255)

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/test", (req, res) => {
  res.status(200).json({ message: "Test réussi", status: 1, data: req.body });
});

app.post('/ical', async (req, res) => {
  const { url } = req.body;
  if (!url || !url.startsWith('http') && !url.startsWith('https')) {
    return res.status(200).json({ message: "Veuillez entrer un lien valide", status: 0 });
  }
  try {
    const response = await fetch(url);
    const text = await response.text();
    res.set('Content-Type', 'text/calendar');
    res.send(text);
  } catch (error) {
    console.error('Erreur lors de la récupération du fichier iCalendar', error);
    res.status(500).send('Erreur lors de la récupération du fichier iCalendar');
  }
});

app.post("/tasksync/api/v1/user/register", (req, res) => {
  const { user_firstname, user_lastname, user_email, user_password } = req.body;
  const user_uuid = uuid.v4();
  const user_password_crypt = bcrypt.hashSync(user_password, 10);
  const user_pro = 0;
  const user_secret = uuid.v4();
  const pictureProfil = `https://ui-avatars.com/api/?name=${user_lastname}+${user_firstname}&bold=true&format=svg&background=random`;
  if (!user_firstname || !user_lastname || !user_email || !user_password) {
    return res
      .status(200)
      .json({ message: "Veuillez remplir tous les champs", status: 0 });
  }
  //verifier si l'email existe deja
  db.query(
    "SELECT * FROM users WHERE user_email = ?",
    [user_email],
    (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(200)
          .json({ message: "Erreur lors de l'inscription", status: 0 });
      } else {
        if (result.length > 0) {
          res.status(200).json({ message: "Email déjà utilisé", status: 0 });
        } else {
          db.query(
            "INSERT INTO users (user_uuid, user_firstname, user_lastname, user_email, user_password, user_pro, user_secret, user_picture_profile) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",	
            [
              user_uuid,
              user_firstname,
              user_lastname,
              user_email,
              user_password_crypt,
              user_pro,
              user_secret,
              pictureProfil,
            ],
            (err, result) => {
              if (err) {
                console.log(err);
                res
                  .status(200)
                  .json({ message: "Erreur lors de l'inscription", status: 0 });
              } else {
                res
                  .status(200)
                  .json({ message: "Inscription réussie", status: 1 });
              }
            }
          );
        }
      }
    }
  );
});

app.post("/tasksync/api/v1/user/login", (req, res) => {
  const { user_email, user_password, expirationToken } = req.body;

  let expirationTokenFinal;

  if (expirationToken === 24) {
    expirationTokenFinal = `${expirationToken}h`;
  } else if (expirationToken === 30) {
    expirationTokenFinal = `${expirationToken}d`;
  } else {
    expirationTokenFinal = "24h";
  }
  db.query(
    "SELECT * FROM users WHERE user_email = ?",
    [user_email],
    (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(200)
          .json({ message: "Erreur lors de la connexion", status: 0 });
      } else {
        if (result.length > 0) {
          let user = result[0];
          const user_password_crypt = user.user_password;
          if (bcrypt.compareSync(user_password, user_password_crypt)) {
            const token = jwt.sign(
              {
                user_uuid: user.user_uuid,
                user_firstname: user.user_firstname,
                user_lastname: user.user_lastname,
                user_email: user.user_email,
                user_pro: user.user_pro,
              },
              user.user_secret,
              {
                expiresIn: expirationTokenFinal,
              }
            );
            delete user.user_password;
            delete user.user_secret;
            delete user.id;
            res
              .status(200)
              .json({ message: "Connexion réussie", status: 1, token: token, user: user });
          } else {
            res
              .status(200)
              .json({ message: "Erreur lors de la connexion", status: 0 });
          }
        } else {
          res
            .status(200)
            .json({ message: "Erreur lors de la connexion", status: 0 });
        }
      }
    }
  );
});

// Middleware pour vérifier le token
function verifyToken(req, res, next) {
  let token = req.headers.authorization;
  token = token.slice(7, token.length);

  if (!token || token === "" || token === null || token === undefined) {
    return res.status(401).json({ message: "Token manquant", status: 0 });
  }

  const uuidUser = jwt.decode(token).user_uuid;

  db.query(
    "SELECT * FROM users WHERE user_uuid = ?",
    [uuidUser],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Erreur lors de la vérification du token",
          status: 0,
        });
      } else {
        if (result.length > 0) {
          const user = result[0];
          jwt.verify(token, user.user_secret, (err, decoded) => {
            if (err) {
              return res
                .status(403)
                .json({ message: "Token invalide", status: 0 });
            }
            req.user = decoded;
            next();
          });
        } else {
          return res.status(403).json({ message: "Token invalide", status: 0 });
        }
      }
    }
  );
}

app.post("/tasksync/api/v1/user/verifytoken", verifyToken, (req, res) => {
  let token = req.headers.authorization;
  token = token.slice(7, token.length);
  const uuidUser = jwt.decode(token).user_uuid;
  //recuperer tout sauf le user_password et le user_secret
  db.query(
    "SELECT * FROM users WHERE user_uuid = ?",
    [uuidUser],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Erreur lors de la vérification du token",
          status: 0,
        });
      } else {
        if (result.length > 0) {
          const user = result[0];
          //enlever le user_password et le user_secret
          delete user.user_password;
          delete user.user_secret;
          res.status(200).json({
            message: "Token valide",
            status: 1,
            user: user,
          });
        } else {
          return res.status(403).json({ message: "Token invalide", status: 0 });
        }
      }
    }
  );
});

// ... (votre configuration d'Express)

// Endpoint pour créer une nouvelle tâche
app.post("/tasksync/api/v1/tasks/create", verifyToken, (req, res) => {
  // Extract user_uuid from the decoded token
  const user_uuid = req.user.user_uuid;

  const task_uuid = uuid.v4();

  const { task_name, task_description, task_due_date, task_color } = req.body;

  if (!task_name || !task_description || !task_due_date || !task_color) {
    return res
      .status(200)
      .json({ message: "Veuillez remplir tous les champs", status: 0 });
  }

  let color = "#FF7518"

  if (task_color !== "orange" && task_color !== "blue" && task_color !== "pink") {
    color = "#FF7518"
  } else {
    if (task_color === "orange") {
      color = "#FF7518"
    } else if (task_color === "blue") {
      color = "#318CE7"
    } else if (task_color === "pink") {
      color = "#F33A6A"
    } else {
      color = "#FF7518"
    }
  }


  db.query(
    "INSERT INTO tasks (user_uuid, task_uuid, task_name, task_description, task_due_date, task_color) VALUES (?, ?, ?, ?, ?, ?)",
    [user_uuid, task_uuid, task_name, task_description, task_due_date, color],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          message: "Erreur lors de la création de la tâche",
          status: 0,
        });
      } else {
        res.status(200).json({ message: "Tâche créée avec succès", status: 1 });
      }
    }
  );
});

// Endpoint pour modifier une tâche
app.post("/tasksync/api/v1/tasks/:task_id/edit", verifyToken, (req, res) => {
  // Extract user_uuid from the decoded token
  const user_uuid = req.user.user_uuid;

  const task_id = req.params.task_id;
  const { task_name, task_description, task_due_date, task_completed } =
    req.body;

  db.query(
    "UPDATE tasks SET task_name = ?, task_description = ?, task_due_date = ?, task_completed = ? WHERE id = ? AND user_uuid = ?",
    [
      task_name,
      task_description,
      task_due_date,
      task_completed,
      task_id,
      user_uuid,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          message: "Erreur lors de la modification de la tâche",
          status: 0,
        });
      } else {
        res
          .status(200)
          .json({ message: "Tâche modifiée avec succès", status: 1 });
      }
    }
  );
});

// Endpoint pour supprimer une tâche
app.post("/tasksync/api/v1/tasks/:task_id/delete", verifyToken, (req, res) => {
  // Extract user_uuid from the decoded token
  const user_uuid = req.user.user_uuid;

  const task_id = req.params.task_id;

  db.query(
    "DELETE FROM tasks WHERE id = ? AND user_uuid = ?",
    [task_id, user_uuid],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          message: "Erreur lors de la suppression de la tâche",
          status: 0,
        });
      } else {
        res
          .status(200)
          .json({ message: "Tâche supprimée avec succès", status: 1 });
      }
    }
  );
});

// Endpoint pour récupérer toutes les tâches
app.get("/tasksync/api/v1/tasks", verifyToken, (req, res) => {
  // Extract user_uuid from the decoded token
  const user_uuid = req.user.user_uuid;

  db.query(
    "SELECT * FROM tasks WHERE user_uuid = ?",
    [user_uuid],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          message: "Erreur lors de la récupération des tâches",
          status: 0,
        });
      } else {
        res.status(200).json({ message: "Tâches récupérées", status: 1, tasks: result });
      }
    }
  );
});

//demmarage du serveur
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
