const {format} = require('date-fns');
const {v4: uuid} = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (id, message, filename) => {
    const dateTimeLog = `${id})\t${format(new Date(), 'yyyy-MM-dd\tHH:mm:ss:SSS')}`;
    const logItem = `${dateTimeLog}\t${uuid()}\t${message}\n`;
    console.log(logItem);
    try{
        if(!fs.existsSync(path.join(__dirname,'..','logs')))
            await fsPromises.mkdir(path.join(__dirname,'..','logs'));
        await fsPromises.appendFile(path.join(__dirname,'..','logs',filename), logItem);
    }catch(err)
    {   console.log(`An error occured with logging: ${err}`);
    }
}


var counter=0;

//custom middleware logger
const logger = (req,res,next) => {
    logEvents(counter++,`${req.method}}\t${req.headers.origin}\t${req.url}`,'requestLog.txt');
    console.log(`${req.method}}\t${req.headers.origin}\t${req.url}`);
    next();
};

module.exports = {logEvents, logger};



