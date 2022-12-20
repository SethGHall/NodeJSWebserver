const usersDB = {
    users:  require('../data/users.json'),
    setUsers: function(data){this.users = data}
}

const fsPromises = require('fs').promises;
const path = require('path');


//on client also delete access token
const handleLogout = async(req, res) =>{
    const cookies = req.cookies;

    if(!cookies?.jwt) //optional chaining!
    {   return res.status(204).json({"message":"nothing to delete"});
    }
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;

    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);

    if(!foundUser)
    {   res.clearCookie('jwt', {httpOnly:true});
        return res.status(204).json({"message":"cookie  cleared"});
    }
    
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = {...foundUser, refreshToken:''};
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(path.join(__dirname,'..','data','users.json'), JSON.stringify(usersDB.users));

    res.clearCookie('jwt', {httpOnly:true, sameSite: 'None', secure: true}); //secure:true - only serves on https
    res.status(204).json({"message":"cookie  cleared"});
}

module.exports = {handleLogout}; 