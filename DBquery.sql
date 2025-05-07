CREATE DATABASE EmployeeDB;
GO

USE EmployeeDB;
GO

CREATE TABLE Employees (
    Id INT PRIMARY KEY,
    Name NVARCHAR(100),
    Position NVARCHAR(100),
    Salary DECIMAL(10,2)
);
GO

INSERT INTO Employees (Id, Name, Position, Salary)
VALUES (1, 'John Doe', 'Software Engineer', 50000.00);
GO

INSERT INTO Employees (Id, Name, Position, Salary)
VALUES (2, 'Jane Smith', 'Project Manager', 60000.00);
GO

INSERT INTO Employees (Id, Name, Position, Salary)
VALUES (3, 'Sam Brown', 'Data Analyst', 55000.00);
GO

