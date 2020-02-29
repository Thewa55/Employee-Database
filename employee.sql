DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE employees (
  id int AUTO_INCREMENT NOT NULL,
  first_name varchar(30) NOT NULL,
  last_name varchar(30) NOT NULL,
  role_id integer(11) NOT NULL,
  manager_id varchar(30),
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
