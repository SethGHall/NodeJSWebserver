const whitelist = require('./allowedOrigins');
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


module.exports = corsOptions;