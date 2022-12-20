const usersDB = {
    users:  require('../data/users.json'),
    setUsers: function(data){this.users = data}
}

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req,resp) => handleUser(req,resp);


async function handleUser(req,res){
    const{user,pwd} = req.body;
    if(!user || !pwd)
        return res.status(400).json({"message":"Missing user and password"});
    //check for duplicate usernames in the database
    const duplicate = usersDB.users.find(person => person.username === user);
    if(duplicate)
        return res.status(409).json({"message":"Username "+user+" Taken "});
    try{
        const hashedPwd = await bcrypt.hash(pwd,7);
        //store new  user
        const newUser = {"username":user, "password":hashedPwd};
        usersDB.setUsers([...usersDB.users, newUser]);
        await fsPromises.writeFile(path.join(__dirname,"..", "data", 'users.json'), JSON.stringify(usersDB.users));
        console.log(usersDB.users);
        res.status(201).json({"success": `New User ${user} created!`});

    }
    catch(err){
        return res.sendStatus(500).json({"message":err.message});
    }
} 

module.exports = {handleNewUser};
