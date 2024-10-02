const bodyParser = require('body-parser');
const { Router } = require('express');
const db = require('./Database');

const router = Router();

router
  .get('/ranking', db.read)
  .post('/ranking', db.insert);

module.exports = app => {
  app.use(
    bodyParser.json(),
    router
  )
}