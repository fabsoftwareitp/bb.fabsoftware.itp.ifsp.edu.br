const express = require('express');
const routes = require('./routes');

const app = express();
const port = 9091;

routes(app);


app.listen(port, () => {
  console.log(`servidor escutando na porta: ${port}`);
});

app.set('trust proxy', true);
app.use(express.static('game'));

module.exports = app;

