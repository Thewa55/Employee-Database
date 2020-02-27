DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE employees (
  id int AUTO_INCREMENT NOT NULL,
  first_name varchar(30) NOT NULL,
  last_name varchar(30) NOT NULL,
  role_id integer(11) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE employeeRole (
  id int AUTO_INCREMENT NOT NULL,
  title varchar(30) NOT NULL,
  salary decimal(11,2) NOT NULL,
  department_id integer(11) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE departments (
  id int AUTO_INCREMENT NOT NULL,
  department_name varchar(30) NOT NULL,
  PRIMARY KEY(id)
);

INSERT INTO departments (department_name)
VALUE ("Sales"), ("Engineering"), ("Finance"), ("Legal");

INSERT INTO employeeRole (title, salary, department_id) 
VALUE ("Sales Lead", 100000, 1), ("Salesperson", 80000, 1), ("Lead Engineer", 150000, 2), ("Software Engineer", 120000, 2), ("Accountant", 125000, 3), ("Legal Team Lead", 250000, 4), ("Lawyer", 190000, 4);

INSERT INTO employees(first_name, last_name, role_id)
VALUE ("Rebecca", "Dion", 2), ("Kayley", "Vaughan", 6 ),("Klay", "Lewis", 3), ("Cheri", "Ross", 4), ("Veltry", "Menas", 7), ("Bruce", "Smith", 1 ), ("Matthew", "Ross", 5), ("Jose", "Tebonius", 2);

SELECT * FROM departments;
SELECT * FROM employeeRole;
SELECT * FROM employees;

SELECT first_name, last_name, title, salary, department_name FROM departments d JOIN employeeRole r ON d.id = r.department_id JOIN employees e ON r.id=e.role_id

-- this works to find everyone in a departments, you replace "Sales" with a ? and fill it with user prompt
SELECT first_name, last_name, title, salary FROM departments d INNER JOIN employeeRole r ON d.id = r.department_id JOIN employees e ON r.id=e.role_id WHERE d.department_name = "Sales";

--Finding people within a role, replace "Sales Lead" with a ?
SELECT first_name, last_name, title, salary, department_name FROM departments d INNER JOIN employeeRole r ON d.id = r.department_id JOIN employees e ON r.id=e.role_id WHERE r.title = "Sales Lead";

--finding employee based on names
SELECT first_name, last_name, title, salary, department_name FROM departments d INNER JOIN employeeRole r ON d.id = r.department_id JOIN employees e ON r.id=e.role_id WHERE e.first_name = "Cheri" AND e.last_name ="Ross";

--making a new employee
INSERT INTO employees(first_name, last_name, role_id) VALUES ("Kenny", "Lam", "3");

--making a new role
INSERT INTO employeeRole(title,salary, department_id) VALUES ("Paralegal", 50000, "4"); 

--making new departments
INSERT INTO departments(department_name) VALUES ("Management");

--deleting an employee
DELETE FROM employees WHERE first_name = "Rebecca" AND last_name = "DION";

--updating a role
UPDATE employees SET role_id = 8 WHERE first_name = "Jose" AND last_name = "Tebonius"







--taken from mySQL workbench in case I need to reference later

SELECT * FROM departments;
SELECT * FROM employeeRole;
SELECT * FROM employees;

SELECT first_name, last_name, title, salary, department_name FROM departments d JOIN employeeRole r ON d.id = r.department_id JOIN employees e ON r.id=e.role_id;

SELECT first_name, last_name, title, salary, department_name FROM departments d INNER JOIN employeeRole r ON d.id = r.department_id JOIN employees e ON r.id=e.role_id WHERE d.department_name = "Sales";

SELECT first_name, last_name, title, salary, department_name FROM departments d INNER JOIN employeeRole r ON d.id = r.department_id JOIN employees e ON r.id=e.role_id WHERE r.title = "Sales Lead";

SELECT first_name, last_name, title, salary, department_name FROM departments d INNER JOIN employeeRole r ON d.id = r.department_id JOIN employees e ON r.id=e.role_id WHERE e.first_name = "Cheri" AND e.last_name ="Ross";

INSERT INTO employees(first_name, last_name, role_id) VALUES ("Kenny", "Lam", "3");

DELETE FROM employees WHERE first_name = "Rebecca" AND last_name = "DION";
DELETE FROM departments WHERE department_name = "Sales";
INSERT INTO employeeRole(title,salary, department_id) VALUES ("Paralegal", 50000, "4");

INSERT INTO departments(department_name) VALUES ("Management");

UPDATE employees SET role_id = 8 WHERE first_name = "Jose" AND last_name = "Tebonius";

SELECT first_name, last_name, title, salary, department_name FROM departments d JOIN employeeRole r ON d.id = r.department_id JOIN employees e ON r.id=e.role_id;