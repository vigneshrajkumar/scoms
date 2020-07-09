var express = require('express');
var path = require('path');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var app = express();

const mongoose = require('mongoose');
mongoose.connect(process.env.MDB_CXN, { useNewUrlParser: true, useUnifiedTopology: true }), (err) => {
    if (err) {
        console.error(err);
        process.exit(1)
    }
};

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/api', indexRouter);

// Error Handler
app.use(function(err, req, res, next) {
    console.error(err.stack)
    res.status(500).send({ "message": "internal server error" })
})

console.log("App Environment")
console.log("---------------")
console.log("APP PORT @", process.env.PORT)
console.log("RMQ CONNECTION @", process.env.RMQ_CXN)
console.log("MDB CONNECTION @", process.env.MDB_CXN)
if (!process.env.PORT || !process.env.RMQ_CXN || !process.env.MDB_CXN) {
    console.log("ENV missing, shutting down..");
    process.exit(1)
}
console.log("---------------")

app.listen(process.env.PORT, () => console.log(`Despatcher listening at ${process.env.PORT}`))