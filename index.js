// модули
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const moment = require('moment');

// создание соединения с бд
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "mydb",
  password: "123qwerty",
  multipleStatements: true
});

 connection.connect(function(err){
    if (err) {
      console.error("Error: " + err.message);
    }
    else{
      console.log("Successful connection with database!");
    }
 });

const app = express();

function newTime(currentRow) {
    currentRow.Time = moment(currentRow.Time).format("YYYY-MM-DD HH:mm:ss");
    return currentRow;
}

// Для преобразования URL-кодированных запросов в переменные, доступные JS в req.body
app.use(bodyParser.urlencoded({extended: true}));
//Для предоставления статических файлов используется функция промежуточной обработки express.static с именем каталога, где находятся статические ресурсы
app.use(express.static(__dirname + "/public"));

// установка движка ejs для представления таблиц
app.set("view engine", "ejs");

// отправка ответа (файла html), в функцию sendFile передается абсолютный путь к файлу (исходная страниц)
app.get("/", function(req,res){
  res.sendFile(__dirname+"/public/main.html");
});

// отправка ответа (файла html), в функцию sendFile передается абсолютный путь к файлу (контакты)
app.get("/contacts", function(req,res){
  res.sendFile(__dirname+"/public/contacts.html");
});

// отправка ответа (файла html), в функцию sendFile передается абсолютный путь к файлу (об университете)
app.get("/about", function(req,res){
  res.sendFile(__dirname+"/public/about.html");
});
// отправка ответа (файла html), в функцию sendFile передается абсолютный путь к файлу (faq)
app.get("/faq", function(req,res){
  res.sendFile(__dirname+"/public/faq.html");
});

// получить все данные
app.get("/tables", function(req,res) {
    let sql = 'SELECT * FROM Class; SELECT * FROM Professor; SELECT * FROM Discipline';
    connection.query(sql, function(err, results, fields){
        if (err) console.log(err.message);
        else {
            results[0] = results[0].map(newTime);
            res.render(__dirname + "/views/tables.ejs", {Title:'Timetable', classData: results[0], professorData: results[1], disciplineData: results[2]});
        }
    });
});

// Новый преподаватель
app.post("/professor", function(req,res) {
    let sql = 'INSERT INTO Professor SET ?';
    let query = connection.query(sql, req.body, function(err, result){
      if(err) console.log(err.message);
      else {
          console.log("Done!");
          res.redirect("/tables");
      }
    });
});

// удаление преподавателя
app.post("/deleteProfessor/:id", function(req,res){
    let professor = req.params.id;
    let sql='DELETE FROM Professor WHERE idProfessor = ?';
    let query = connection.query(sql,professor,function(err, result){
      if(err) console.log(err.message);
      else {
          console.log("Done!");
          res.redirect("/tables");
      }
  });
});

// изменение преподавателя
app.post("/updateProfessor/:id", function(req,res) {
    let sql = `UPDATE Professor SET ? WHERE idProfessor = ${req.params.id}`;
    let query = connection.query(sql, req.body, function(err, result){
      if(err) console.log(err.message);
      else {
          console.log("Done!");
          res.redirect("/tables");
      }
    });
});

// Новая дисциплина
app.post("/discipline", function(req,res) {
    let sql = 'INSERT INTO Discipline SET ?';
    let query = connection.query(sql, req.body, function(err, result){
      if(err) console.log(err.message);
      else {
          console.log("Done!");
          res.redirect("/tables");
      }
    });
});

// удаление дисциплины
app.post("/deleteDiscipline/:id", function(req,res){
    let discipline = req.params.id;
    let sql='DELETE FROM Discipline WHERE idDiscipline = ?';
    let query = connection.query(sql,discipline,function(err, result){
      if(err) console.log(err.message);
      else {
          console.log("Done!");
          res.redirect("/tables");
      }
  });
});

// изменение дисциплина
app.post("/updateDiscipline/:id", function(req,res) {
    let sql = `UPDATE Discipline SET ? WHERE idDiscipline = ${req.params.id}`;
    let query = connection.query(sql, req.body, function(err, result){
      if(err) console.log(err.message);
      else {
          console.log("Done!");
          res.redirect("/tables");
      }
    });
});

// Новая пара
app.post("/class", function(req,res){
  let time = req.body.Time;
  let group = req.body.GroupName;
  let classroom = req.body.Classroom;
  let type = req.body.Type;
  let professor = req.body.idProfessor !== "nan" ? req.body.idProfessor : null;
  let discipline = req.body.idDiscipline;
  let classUni = {Time: time, Classroom: classroom, Type: type, GroupName:group, idDiscipline: discipline,idProfessor: professor };
  let sql = 'INSERT INTO Class SET ?';
  let query = connection.query(sql, classUni, function(err, result){
      if(err) console.log(err.message);
      else {
          console.log("Done!");
          res.redirect("/tables");
      }
    });
});

// удаление пары
app.post("/deleteClass/:id", function(req,res){
  var classUni = req.params.id;
  let sql='DELETE FROM Class WHERE idClass = ?';
  let query = connection.query(sql,classUni,function(err, result){
      if(err) console.log(err.message);
      else {
          console.log("Done!");
          res.redirect("/tables");
      }
  });
});

// изменение пары
app.post("/updateClass/:id", function(req,res) {
    let time = req.body.Time;
    let group = req.body.GroupName;
    let classroom = req.body.Classroom;
    let type = req.body.Type;
    let professor = req.body.idProfessor !== "nan" ? req.body.idProfessor : null;
    let discipline = req.body.idDiscipline;
    let classUni = {Time: time, Classroom: classroom, Type: type, GroupName:group, idDiscipline: discipline, idProfessor: professor };
    let sql = `UPDATE Class SET ? WHERE idClass = ${req.params.id}`;
    let query = connection.query(sql, classUni, function(err, result){
      if(err) console.log(err.message);
      else {
          console.log("Done!");
          res.redirect("/tables");
      }
    });
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () =>  console.log(`Server is running on port ${PORT}`));
