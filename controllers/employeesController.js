
const data = {
    employees : require('../data/employees.json'),
    setEmployees : function(data){this.employees = data}
    
}

let idCounter = data.employees.length;

const getAllEmployees = (req,res) =>{
    
    res.json(data.employees);
}

const getEmployee = (req,res) =>{
    const index = parseInt(req.params.id);
    let employee = data.employees.find(emp => emp.id === index);
    console.log("Getting "+employee);

    if(!employee)
        return  res.status(400).json({"message":"Error no employee exists with "+index});
    res.json(employee);
}

const createNewEmployee = (req,res) =>{
    console.log("First name is "+req.body.firstName);
    const newEmployee = {
        id: ++idCounter,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    }
    if(!newEmployee.firstName || !newEmployee.lastName)
    {   idCounter--;
        return res.status(400).json({"message":"Error no first or last name supplied"});
    }
    data.employees.push(newEmployee);
    //data.setEmployees([...data.employees, newEmployee]);
    console.log(data.employees);
    res.status(201).json(data.employees);
}


const updateEmployee = (req,res) =>{ 
    let index = parseInt(req.body.id);
    let employee = data.employees.find(emp => emp.id == index);
    if(!employee)
        return  res.status(400).json({"message":"Error no employee exists with "+index});

     
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;

    if(!firstName && !lastName)
        res.status(400).json({"message":"Nothing given to update "+index});
    if(firstName)
        employee.firstName = firstName;
    if(lastName)
        employee.lastName = lastName;

    res.json(data.employees);
}

const deleteEmployee = (req,res) =>{
    console.log("TRYING TO DELETE "+req.body.id);
    const index = data.employees.findIndex(emp => emp.id == req.body.id);
    let x = {}
    if(index >= 0)
        x = data.employees.splice(index, 1);
    else
        return res.status(400).json({"message":"Nothing to delete with index "+index});
    res.json(x);
}

module.exports = {getAllEmployees,getEmployee,updateEmployee,deleteEmployee,createNewEmployee};

