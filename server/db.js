"use strict";
/** Database setup for MovieBook. */
const mysql = require("mysql2");

const dotenv = require("dotenv");
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: "3306",
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();


module.exports = pool;