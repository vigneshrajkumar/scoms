var express = require('express');
var path = require('path');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// Error Handler
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send({"message": "internal server error"})
})

port = process.env.PORT || 3000
console.log("RMQ CONNECTION @", process.env.RMQ_CXN)
console.log("MDB CONNECTION @", process.env.MDB_CXN)

app.listen(port, () => console.log(`Despatcher listening at ${port}`))
