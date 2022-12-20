const {logEvents} = require('./logEvents');

var counter =0;
const errorHandler = (err, req, res, next) =>{
    logEvents(counter,`${err.name}\t${err.message}`, "errorlog.txt");
    console.error(err.stack);
    res.status(500).send(err.message);
}

module.exports = errorHandler;