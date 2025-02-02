var mysql = require("mysql");
var inquirer = require("inquirer");
require('dotenv').config();

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: process.env.MYSQL_PW,
  database: "employee_db"
});

connection.connect(function(err) {
  if (err) throw err;
  startPrompts();
});


let startPrompts = () =>{
  inquirer.prompt({
    message: "Welcome, what would you like to do?",
    type: "list",
    name: "mainChoice",
    choices: ["View", "Add", "Remove", "Update", "Total salary by department","I am done"]
  }).then(function(response){
    switch (response.mainChoice){
      case "View":
        view();
        break;

      case "Add":
        add();
        break;

      case "Remove":
        remove();
        break;

      case "Update":
        update();
        break;

      case "Total salary by department":
        deptSalary();
        break;

      case "I am done":
        connection.end()
    }
  })
}

let update = () =>{
  inquirer.prompt({
    message: "Welcome, what would you like to update?",
    type: "list",
    name: "updateChoice",
    choices: ["Update employee role", "Update employee manager"]
  }).then(function(response){
    switch (response.updateChoice){
      
      case "Update employee manager":
        updateEmployeeManager();
        break;

      case "Update employee role":
        updateRole();
        break;
    }
  })
}

let view = () =>{
  inquirer.prompt({
    message: "Welcome, what would you like to view?",
    type: "list",
    name: "viewChoice",
    choices: ["View all employees","View all employees by role", "View all employees by department",  "View all employees by manager"]
  }).then(function(response){
    switch (response.viewChoice){
      
      case "View all employees":
        viewAllEmployee();
        break;

      case "View all employees by department":
        viewEmployeeDepartment();
        break;

      case "View all employees by role":
        viewEmployeeRole()
        break;

      case "View all employees by manager":
        viewEmployeeManager();
        break;
    }
  })
}

let add = () =>{
  inquirer.prompt({
    message: "Welcome, what would you like to add?",
    type: "list",
    name: "addChoice",
    choices: ["Add employee", "Add new title", "Add new department"]
  }).then(function(response){
    switch (response.addChoice){
      
      case "Add employee":
        addEmployee();
        break;

      case "Add new title":
        addNewTitle();
        break;

      case "Add new department":
        addNewDept();
        break;
    }
  })
}

let remove = () => {
  inquirer.prompt({
    message: "Welcome, what would you like to remove?",
    type: "list",
    name: "removeChoice",
    choices: ["Remove employee", "Remove title", "Remove department"]
  }).then(function(response){
    switch (response.removeChoice){
      case "Remove employee":
        removeEmployee();
        break;
      
      case "Remove title":
        removeTitle();
        break;

      case "Remove department":
        removeDepartment();
        break;
    }
  })
}

let viewAllEmployee = () => {
  connection.query("SELECT first_name, last_name, title, manager_id, salary, department_name FROM departments d JOIN employeeRole r ON d.id = r.department_id JOIN employees e ON r.id=e.role_id", 
  (err, res)=>{ 
    if (err) throw err;
    console.table(res);
    startPrompts();
  })
}

let viewEmployeeDepartment = () => {
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
      connection.query("SELECT first_name, last_name, title, manager_id, salary, department_name FROM departments d INNER JOIN employeeRole r ON d.id = r.department_id JOIN employees e ON r.id=e.role_id WHERE d.department_name = ?", response.selectedDep, (err,res)=>{
        if(err)throw err
        console.table(res)
        startPrompts()
      })
    })
  })
}

let viewEmployeeRole = () => {
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
      connection.query("SELECT first_name, last_name, title, manager_id, salary, department_name FROM departments d INNER JOIN employeeRole r ON d.id = r.department_id JOIN employees e ON r.id=e.role_id WHERE r.title = ?", response.selectedRole, (err,res)=>{
        if(err)throw err
          console.table(res)
          startPrompts()
      })
    })
  })
} 

let addEmployee = ()=>{
  connection.query("SELECT * FROM employeeRole", (err, res) => {
    inquirer.prompt([{
      message: "What's the first name of the employee you are trying to add?",
      type: "input",
      name: "firstName"
    },
    {
      message: "What's the last name of the employee you are trying to add?",
      type: "input",
      name: "lastName"
    },
    {
      message: "What title does the employee have?",
      type: "list",
      name: "selectedRole",
      choices: () =>{
        let rolesArray = [];
        res.forEach(role => {
          rolesArray.push(role.title)            
        });
        return rolesArray
      }
    }]).then((response)=> {
      console.log(response.lastName, response.firstName)
      res.forEach(role =>{
        if(role.title === response.selectedRole){
          connection.query("INSERT INTO employees(first_name, last_name, role_id) VALUES  (?, ? , ?);", [response.firstName, response.lastName, role.id], (err, res) => {
          if (err) throw err
          console.log("Employee was added successfully!")
          startPrompts()})
        }  
      })
    })
  })
}

let addNewTitle = () => {
  connection.query("SELECT * FROM departments", (err, res) =>{
    inquirer.prompt([{
      message: "What's the title you are trying to add?",
      type: "input",
      name: "title"
    },
    {
      message: "What's the salary?",
      type: "input",
      name: "salary"
    },
    {
      message: "What department is it in?",
      type: "list",
      name: "selectedDept",
      choices: () =>{
        let deptArray = [];
        res.forEach(dept => {
          deptArray.push(dept.department_name)            
        });
        return deptArray
      }
    }]).then(response => {
      res.forEach(dept =>{
        if(dept.department_name === response.selectedDept){
          connection.query("INSERT INTO employeeRole(title, salary, department_id) VALUES  (?, ? , ?);", [response.title, response.salary, dept.id], (err, res) => {
          if (err) throw err
          console.table(response)
          console.log("Title was added successfully!")
          startPrompts()})
        }
      })
    })
  })
}

let addNewDept = () =>{
  inquirer.prompt({
    message: "What is the name of department you want to add?",
    type: "input",
    name: "deptname"
  }).then(response => {
    connection.query("INSERT INTO departments(department_name) VALUES  (?);", response.deptname, (err,res)=> {
      if(err) throw err
      console.log("Department created successfully!")
      startPrompts()
    })
  })
}

let removeEmployee = () => {
  connection.query("SELECT * FROM employees", (err, res) => {
    inquirer.prompt({
      message: "What is the name of the employee to be removed",
      type: "list",
      name: "employeename",
      choices: () =>{
        let names = [];
        res.forEach(employee => {
          let employeeName = employee.first_name + " " + employee.last_name
          names.push(employeeName)         
        })
        return names
      }
    }).then(response => {
      console.log(response)
      res.forEach(employee =>{
        let fullName = employee.first_name + " " + employee.last_name
        if(fullName === response.employeename){
          connection.query("DELETE FROM employees WHERE first_name = ? AND last_name = ?;", [employee.first_name, employee.last_name], (err, res) => {
          if (err) throw err
          console.log("Employee has been successfully removed!")
          startPrompts()})
        }  
      })
    })
  })
}

let removeTitle = () => {
  connection.query("SELECT * FROM employeeRole", (err, res) => {
    inquirer.prompt({
      message: "What is title do you want to remove?",
      type: "list",
      name: "rolename",
      choices: () =>{
        let roles = [];
        res.forEach(role => {
          roles.push(role.title)         
        })
        return roles
      }
    }).then(response =>{
      res.forEach(role => {
        if(role.title === response.rolename){
          connection.query("DELETE FROM employeeRole WHERE title = ?;", response.rolename, (err, res) => {
            if (err) throw err
            console.log("The title has been successfully removed!")
            startPrompts()})
        }         
      })
    })
  })
}

let removeDepartment = () => {
  connection.query("SELECT * FROM departments", (err, res) => {
    inquirer.prompt({
      message: "What department do you want to remove?",
      type: "list",
      name: "deptname",
      choices: () =>{
        let depts = [];
        res.forEach(dept => {
          depts.push(dept.department_name)         
        })
        return depts
      }
    }).then(response =>{
      res.forEach(dept => {
        if(dept.department_name === response.deptname){
          connection.query("DELETE FROM departments WHERE department_name = ?;", response.deptname, (err, res) => {
            if (err) throw err
            console.log("The department has been successfully removed!")
            startPrompts()})
        }         
      })
    })
  })
}

let updateRole = () => {
  connection.query("SELECT * FROM employees", (err, res) => {
    if(err) throw err
    inquirer.prompt({
      message: "Which employee's role do you want to change?",
      type: "list",
      name: "employeename",
      choices: () =>{
        let names = [];
        res.forEach(employee => {
          let employeeName = employee.first_name + " " + employee.last_name
          names.push(employeeName)         
        })
        return names
      }
    }).then(response => {
      console.table(response)
      res.forEach(employee =>{
        let fullName = employee.first_name + " " + employee.last_name
        if(fullName === response.employeename){
          let empFirst = employee.first_name 
          let empLast = employee.last_name
          connection.query("SELECT * FROM employeeRole", (err, result) => {
            if(err)throw err
              inquirer.prompt({
              message: "What's the employee's new role?",
              type: "list",
              name: "newRole",
              choices: () =>{
                let rolesArray = [];
                result.forEach(role => {
                  rolesArray.push(role.title)            
                });
                return rolesArray
              }
            }).then(changedrole => {
              result.forEach(role => {
                if(role.title === changedrole.newRole){
                  connection.query("UPDATE employees SET role_id = ? WHERE first_name = ? AND last_name = ?;", [role.id, empFirst, empLast], (err, res) => {
                  if (err) throw err
                  console.log("Role changed successfully!")
                  startPrompts()})
                }  
              })
            })
          })
        }
      }) 
    })
  })
}

let deptSalary = () =>{
  connection.query("SELECT * FROM departments", (err, res) => {
    if(err) throw err;
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
      res.forEach(department =>{
        if(department.department_name === response.selectedDep){
          connection.query("SELECT department_name, SUM(salary) FROM departments d INNER JOIN employeeRole r ON d.id = r.department_id JOIN employees e ON r.id=e.role_id WHERE d.department_name = ?", response.selectedDep, (err,res)=>{
            if (err) throw err
            console.table(res)
            startPrompts()
          }
        )}
      })
    })
  })
}

let viewEmployeeManager = () =>{
  connection.query("SELECT id, manager_id FROM employees GROUP BY manager_id", (err, res) => {
    if(err) throw err
    inquirer.prompt({
      message: "Which manager would you like to view?",
      type: "list",
      name: "managername",
      choices: () =>{
        let names = [];
        res.forEach(manager => {
          if( manager.manager_id !== null){
            names.push(manager.manager_id)         
          }
        })
        return names
      }
    }).then(response => {
      connection.query("SELECT first_name, last_name FROM employees WHERE manager_id = ?;", response.managername, (err, res) => {
        if (err) throw err
          res.forEach(employee =>{
            let employeeName = employee.first_name + " " + employee.last_name
            console.log(response.managername + " is a manager of " + employeeName)
          })
          startPrompts()
      })    
    })
  })
}

let updateEmployeeManager = () =>{
  connection.query("SELECT * FROM employees", (err, res) => {
    if(err) throw err
    inquirer.prompt([{
      message: "Which employee's manager do you want to update?",
      type: "list",
      name: "employeeName",
      choices: () =>{
        let names = [];
        res.forEach(employee => {
          let employeeName = employee.first_name + " " + employee.last_name
          names.push(employeeName)         
        })
        return names
      }
    },
    {
      message: "Who is the new manager?",
      type: "list",
      name: "managername",
      choices: () =>{
        let names = [];
        res.forEach(employee => {
          let employeeName = employee.first_name + " " + employee.last_name
          names.push(employeeName)         
        })
        return names
      }
    }]).then(response => {
      res.forEach(employee => {
        let searchName = employee.first_name + " " + employee.last_name
        if(searchName === response.employeeName){
          connection.query("UPDATE employees SET manager_id = ? WHERE first_name = ? AND last_name = ?;", [response.managername, employee.first_name, employee.last_name], (err, res) => {
            if (err) throw err
            console.log("Manager changed successfully!")
            startPrompts()})
        }
      })
    })
  })
}
