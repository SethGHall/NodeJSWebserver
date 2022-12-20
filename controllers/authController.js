const usersDB = {
    users:  require('../data/users.json'),
    setUsers: function(data){this.users = data}
}

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();


const handleLogin = async(req, res) =>{
    const{user,pwd} = req.body;
    if(!user || !pwd)
        return res.status(400).json({"message":"Missing user and password"});
    //check for duplicate usernames in the database
    const foundUser = usersDB.users.find(person => person.username === user);

    if(!foundUser)
        return res.status(401).json({"message":"Username "+user+" has not been found "});
    //evaluate password!
    const match = await bcrypt.compare(pwd, foundUser.password)
    if(match)
    {   //Saving refresh token with curent user
        const accessToken = jwt.sign({"username":foundUser.username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'30s'});
        const refreshToken = jwt.sign({"username":foundUser.username}, process.env.REFRESH_TOKEN_SECRET, {expiresIn:'1d'});
        
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        const currentUser = {...foundUser, refreshToken};
        usersDB.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(path.join(__dirname, "..", 'data','users.json'), JSON.stringify(usersDB.users));
        res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24*60*60*1000});
        res.json({accessToken});
    } 
    else{
        return res.status(401).json({"message":"Username "+user+" wrong password "});
    }
}

module.exports = {handleLogin}; 