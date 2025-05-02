CREATE DATABASE BookDB;
GO

USE BookDB;
GO

CREATE TABLE Books (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(100),
    Author NVARCHAR(100),
    Year INT
);

SELECT * FROM Books;

INSERT INTO books (title, author, year)
VALUES ('Harry Potter', 'J.K. Rowling', 2003);

