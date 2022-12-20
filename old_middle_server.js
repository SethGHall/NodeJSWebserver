const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const express = require('express');
const app = express();

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
const whitelist = ['http://localhost:3500'];
const corsOptions = {
    origin: (origin, callback) => {
        console.log("GETTING ",origin);
        if(whitelist.indexOf(origin) !== -1 || !origin)
        {   callback(null, true);
        }
        else
            callback(new Error("Not allowed by CORS"));
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));  


app.use(express.urlencoded({extended:false}));

app.use(express.json());

app.use('/', express.static(path.join(__dirname,'/public')));



//chain example
const firstChain = (req, res, next) =>{
    console.log("firstChain");
    next();
}
const secondChain = (req, res, next) =>{
    console.log("secondChain");
    next();
}
const thirdChain = (req, res) =>{ 
    console.log("thirdChain");
    res.send("<H1>HELLO WORLD CHAINING</H1>");
}

app.get('^/$|index(.html)?',(req,res) =>{
    //res.sendFile('./views/index.html', {root: __dirname});
    res.sendFile(path.join(__dirname,'views','index.html'));
});

app.get('/new-page(.html)?',(req,res) =>{
    res.sendFile(path.join(__dirname,'views','new-page.html'));
});

app.get('/new-page(.html)?|old-page(.html)?',(req,res) =>{
    res.redirect(301,'/new-page.html');  //302 by default
});


// app.get('/img/*|/css/*', (req, res) => {
//     console.log(req.url);
//     res.sendFile(path.join(__dirname,req.url));
// });

app.get('/hello(.html)?',(req,res,next) =>{
    console.log("next");
    next();
},(req,res) =>{
    res.send("done!");
});


app.get('/chain(.html)?', [firstChain,secondChain,thirdChain]);

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