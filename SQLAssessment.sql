-- All queries are in MySQL

-- // 1.	Using the above table structure:
-- //a.	Write a script to create the Employees table.

CREATE TABLE Employees (
    employeeNo INT AUTO_INCREMENT PRIMARY KEY,
    lastName VARCHAR(50) NOT NULL,
    firstName VARCHAR(50) NOT NULL,
    gender CHAR(1) NOT NULL,
    IDNumber VARCHAR(20) NOT NULL,
    salaryLevelID INT,
    departmentID INT,
    FOREIGN KEY (departmentID) REFERENCES Department(departmentID)
);


-- b.	Write a script to alter the Employees table to increase the length of the [lastName] field from 50 - 60 characters

ALTER TABLE Employees
MODIFY lastName VARCHAR(60) NOT NULL;


-- c.	CREATE PROCEDURE GetEmployeesByDepartment

DELIMITER $$

CREATE PROCEDURE GetEmployeesByDepartment(IN department_name VARCHAR(50))
BEGIN
    IF department_name IS NULL OR department_name = '' THEN
        SELECT * FROM Employees;
    ELSE
        SELECT E.*
        FROM Employees E
        INNER JOIN Department D ON E.departmentID = D.departmentID
        WHERE D.name = department_name;
    END IF;
END $$

DELIMITER ;

-- d.	Create a script that returns each department name and the number of employees in each department.

SELECT D.name AS DepartmentName, COUNT(E.employeeNo) AS NumberOfEmployees
FROM Department D
LEFT JOIN Employees E ON D.departmentID = E.departmentID
GROUP BY D.name;

-- e.	Create a script that filters by department name and returns the number of Males and females in the department
SELECT D.name AS DepartmentName, 
       SUM(CASE WHEN E.gender = 'M' THEN 1 ELSE 0 END) AS NumberOfMales,
       SUM(CASE WHEN E.gender = 'F' THEN 1 ELSE 0 END) AS NumberOfFemales
FROM Department D
INNER JOIN Employees E ON D.departmentID = E.departmentID
WHERE D.name = ${departmentName}
GROUP BY D.name;

-- f.	Create a script that filters by [employNo] and returns the salary amount as well as the department name.

SELECT E.employeeNo, SL.amount AS SalaryAmount, D.name AS DepartmentName
FROM Employees E
INNER JOIN SalaryLevel SL ON E.salaryLevelID = SL.salaryLevelID
INNER JOIN Department D ON E.departmentID = D.departmentID
WHERE E.employeeNo = ${EmployeeNumber};

-- g.	Assuming that the relationship between Employees and [salaryLevel] does not exist, create a script that returns all the employees that have a [salarylevelID] that is not in the Salary level table.
SELECT E.*
FROM Employees E
LEFT JOIN SalaryLevel SL ON E.salaryLevelID = SL.salaryLevelID
WHERE SL.salaryLevelID IS NULL;

