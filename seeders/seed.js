
require("dotenv").config({ path: "./config.env" });

const connectDB = require("../config/db.js");
const db = require('../models');

connectDB();

const transaction =  [
  {
    name: "Dinning",
    value: "100",
    day: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  {
    name: "Shopping",
    value: "200",
    day: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
  {
    name: "Movie",
    value: "200",
    day: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
  {
    name: "Football Ticket",
    value: "200",
    day: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  {
    name: "Coffee",
    value: "10",
    day: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
];

db.Transaction.collection.insertMany(transaction)
  .then((data) => {
    console.log(data.result.n + " records inserted!");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });