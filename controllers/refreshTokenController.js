const usersDB = {
    users:  require('../data/users.json'),
    setUsers: function(data){this.users = data}
}

const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const handleRefreshToken = (req, res) =>{
    const cookies = req.cookies;
    if(!cookies?.jwt) //optional chaining!
    {   return res.status(401).json({"error":"Missing cookie jwt"});
    }
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);

    if(!foundUser)
        return res.status(403).json({"message":"Forbidden invalid refresh token for user"});
    //evaluate jwt!
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err,decoded) => {
        if(err) return res.status(403).json({"message":"Forbidden invalid refresh token for user"});
        const acccessToken = jwt.sign({"username": decoded.username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'30s'});
        res.json({acccessToken});
    });
}

module.exports = {handleRefreshToken}; 