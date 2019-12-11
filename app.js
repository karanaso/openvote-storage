const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const multer  = require('multer');


let imagesPath = 'uploads/';

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesPath)
  },
  limits: {
    fieldSize: '4MB'
  },
  filename: function (req, file, cb) {
    cb(null, req.params.id + '.jpg')
  }
});

const  upload = multer({ storage });

const app = express();

app.options("*", cors());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  bodyParser.json({
    limit: "16MB"
  })
);

const securityMiddleware = (req, res, next) => {
  if (req.headers.xadmin === 'k123!@#' ) {
    next();
  } else {
    console.log('wrong headers', req.headers.xadmin)
    return res.send(403);
  }
}

app.post('/image/:id',
  securityMiddleware,
  upload.single('image'),
  (req, res) => 
{  
  console.log(req.file);
  return res.status(200).send(); 
});

app.get('/image/:id', (req,res) => res.send(fs.readFileSync(`./${imagesPath}${req.params.id}.jpg`)));

app.get("/thumbImage/:id", (req, res) => {
  const file = `./${imagesPath}/${req.params.id}_256.jpg`;
  if (!fs.existsSync(file)) return res.sendStatus(404);
  res.send(fs.readFileSync(file));
});

app.get("/fullImage/:id", (req, res) => {
  const file = `./${imagesPath}/${req.params.id}.jpg`;
  if (!fs.existsSync(file)) return res.sendStatus(404);
  res.send(fs.readFileSync(file));
});

module.exports = app;
