CREATE DATABASE EmployeeDB;
GO

USE EmployeeDB;
GO

CREATE TABLE Employees (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100),
    Position NVARCHAR(100),
    Salary DECIMAL(10,2)
);

SELECT * FROM Employees;

INSERT INTO Employees (Name, Position, Salary)
VALUES ('John Doe', 'Software Engineer', 50000.00);

