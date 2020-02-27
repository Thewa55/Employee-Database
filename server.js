var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "",
  database: "employee_db"
});

connection.connect(function(err) {
  if (err) throw err;
  startPrompts();
});


function startPrompts(){
  inquirer.prompt({
    message: "Welcome, what would you like to do?",
    type: "list",
    name: "mainChoice",
    choices: ["View all employees","View all employees by role", "View all employees by department", "View all employees by manager", "Add employee", "Remove employee", "Update employee role", "Update employee manager", "I am done"]
  }).then(function(response){
    switch (response.mainChoice){
      case "View all employees":
        viewAllEmployee();
        break;
      case "View all employees by department":
        viewEmployeeDepartment();
        break;

      case "View all employees by role":
        viewEmployeeRole()
        break;

      case "I am done":
        connection.end()
    }
  })
}

var viewAllEmployee = () => {
  connection.query("SELECT first_name, last_name, title, salary, department_name FROM departments d JOIN employeeRole r ON d.id = r.department_id JOIN employees e ON r.id=e.role_id", 
  (err, res)=>{ 
    if (err) throw err;
    console.table(res);
    startPrompts();
  })
}

var viewEmployeeDepartment = () => {
  connection.query("SELECT * FROM departments", (err, res) => {
    inquirer.prompt({
      message: "What department would you like to view?",
      type: "list",
      name: "selectedDep",
      choices: () =>{
        let rolesArray = [];
        res.forEach(department => {
          rolesArray.push(department.department_name)            
        });
        return rolesArray
      }
    }).then(response => {
      console.log(response.selectedDep)
      connection.query("SELECT first_name, last_name, title, salary, department_name FROM departments d INNER JOIN employeeRole r ON d.id = r.department_id JOIN employees e ON r.id=e.role_id WHERE d.department_name = ?", response.selectedDep, (err,res)=>{
        if(err)throw err
        console.table(res)
        startPrompts()
      })
    })
  })
}

var viewEmployeeRole = () => {
    connection.query("SELECT * FROM employeeRole", (err, res) => {
      inquirer.prompt({
        message: "What role would you like to view?",
        type: "list",
        name: "selectedRole",
        choices: () =>{
          let rolesArray = [];
          res.forEach(role => {
            rolesArray.push(role.title)            
          });
          return rolesArray
        }
      }).then(response => {
        console.log(response.selectedRole)
        connection.query("SELECT first_name, last_name, title, salary, department_name FROM departments d INNER JOIN employeeRole r ON d.id = r.department_id JOIN employees e ON r.id=e.role_id WHERE r.title = ?", response.selectedRole, (err,res)=>{
          if(err)throw err
          console.table(res)
          startPrompts()
        })
      })
    })
  } 
