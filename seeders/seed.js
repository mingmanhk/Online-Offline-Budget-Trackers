
require("dotenv").config({ path: "./config.env" });

const connectDB = require("../config/MongoDB.js");
const Transaction = require("../models/transaction.js");

connectDB();

const transaction = [
  {
    name: "Dinning",
    value: 300,
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  {
    name: "Shopping",
    value: 150,
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
  {
    name: "Movie",
    value: 5,
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
  {
    name: "Football",
    value: 200,
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  {
    name: "Coffee",
    value: 10,
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
];

console.log(transaction)
Transaction.insertMany(transaction)
  .then((data) => {
    console.log(data.length + " records inserted!");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });