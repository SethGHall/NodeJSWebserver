const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');
const express = require('express');
const app = express();
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require("cookie-parser");
const EventEmitter = require('events');
const http = require('http');
const path = require('path');
const fsPromises = require('fs').promises;
const fs = require('fs');
const cors = require('cors');
const { resolveSoa } = require('dns');

const PORT = process.env.PORT || 3500;

//class Emitter extends EventEmitter{};

app.use(logger);

//CROSS ORIGIN RESOURCE SHARING

app.use(require('./middleware/credentials'));
app.use(cors(corsOptions));  

app.use(express.urlencoded({extended:false}));

app.use(express.json());

//middleware for cookies
app.use(cookieParser());

app.use('/',express.static(path.join(__dirname,'/public')));
app.use('/subdir', express.static(path.join(__dirname,'/public')));

app.use('/', require('./routes/root_router'));  //route to subdir_router ..js
app.use('/register', require('./routes/register_router'));  //route to register_router ..js
app.use('/auth', require('./routes/auth_router'));  //route to register_router ..js
app.use('/subdir', require('./routes/subdir_router'));  //route to subdir_router ..js

app.use('/refresh', require('./routes/refresh_router'));
app.use('/logout', require('./routes/logout_router'));  
app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees')); //route to employeess.

app.all('*', (req, res) => {
    res.status(404); 
    if(req.accepts('html'))
    {   res.sendFile(path.join(__dirname,'views','404.html'));
    }
    else if(req.accepts('json'))
    {   res.json({error:"404 Not Found"})
    }
    else{

        res.type('txt').send("404 not found");
    }
    
});

app.use(errorHandler);

app.listen(PORT, ()=> {
    console.log(`Serer running on port: ${PORT}`);
});