const logger = require('./middleware/logEvents');
const EventEmitter = require('events');
const http = require('http');
const path = require('path');
const fsPromises = require('fs').promises;
const fs = require('fs');

const PORT = process.env.PORT || 3500;


class Emitter extends EventEmitter{};
const myEmitter = new Emitter();

//add a listener for the log event
myEmitter.on('log', (id,msg, file) => logger(id,msg, file));

var counter = 0;


const serveFile = async(filePath, contentType, response) => {
    try{
        const rawData = await fsPromises.readFile(filePath,
        !contentType.includes('image') ? 'utf-8' : '');
        const data = contentType === 'application/json' 
            ? JSON.parse(rawData) : rawData

        response.writeHead(
            filePath.includes("404.html") ? 404 : 200,
            {'Content-Type':contentType});
        response.end(contentType === 'application/json' ? JSON.stringify(data) : data);

    }catch(err)
    {   console.log(err);
        myEmitter.emit('log', counter++, `${req.url}\y${req.method}`,'errorlog.txt');
        response.statusCode(500);
        response.end();
    } 
}

const server = http.createServer((req,res) => processRequest(req,res));



function processRequest(req,res){
    myEmitter.emit('log', counter++, `${req.url}\t${req.method}`,'reqlog.txt');


    const extension = path.extname(req.url);

    let contentType;

    switch(extension){
        case '.css':
            contentType="text/css";
            break;
        case '.js':
            contentType="text/javascript";
            break;
        case '.json':
            contentType="application/json";
        break;
        case '.jpg':
            contentType="image/jpg";
            break;
        case '.png':
            contentType="image/png";
            break;
        case '.txt':
            contentType="text/plain";
            break;
        default:
            contentType="text/html";
    }

    let filePath = 
        contentType === 'text/html' && req.url  === '/'
            ? path.join(__dirname,'views','index.html')  
            : contentType === 'text/html' && req.url.slice(-1) === '/'
                ? path.join(__dirname, 'views',req.url,'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname,'views',req.url)
                    : path.join(__dirname, req.url);

    //makes the .html extension not required in the browser
    if(!extension && req.url.slice(-1) !== '/')
        filePath+='.html';
                    
    const fileExists = fs.existsSync(filePath);

    if(fileExists){
        serveFile(filePath, contentType, res);
    }
    else{
        //404 or 301 redirect
        console.log(path.parse(filePath));

        switch(path.parse(filePath).base){
            case 'old-page.html':
                res.writeHead(301, {'Location':'/new-page.html'});
                res.end();
                break;
            
            case 'www-page.html':
                res.writeHead(301, {'Location':'/'});
                res.end();
                break;
            default:
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
        }
    }

}

server.listen(PORT, ()=> {
    console.log(`Serer running on port: ${PORT}`);
});