const path = require('path');
const express = require('express');
const OS = require('os');
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors());

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASSWORD}@cluster0.va9qn.mongodb.net/solar`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(err));

const dataSchema = new mongoose.Schema({
  name: String,
  id: Number,
  description: String,
  image: String,
  velocity: String,
  distance: String
});

const planetModel = mongoose.model('planets', dataSchema);

app.post('/planet', async (req, res) => {
  try {
    const planetData = await planetModel.findOne({ id: req.body.id });
    if (!planetData) {
      throw new Error("Ooops, We only have 9 planets and a sun. Select a number from 0 - 9");
    }
    res.send(planetData);
  } catch (err) {
    res.status(500).send("Error in Planet Data: " + err.message);
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/', 'index.html'));
});

app.get('/os', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send({
    "os": OS.hostname(),
    "env": process.env.NODE_ENV
  });
});

app.get('/live', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send({
    "status": "live"
  });
});

app.get('/ready', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send({
    "status": "ready"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server successfully running on port - ${PORT}`);
});

module.exports = app;
