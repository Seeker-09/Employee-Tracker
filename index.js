const inquirer = require("inquirer");
const db = require("./db/connection");

promptUser = () => {
    return inquirer.prompt([
        {
            type: "list",
            name: "view",
            message: "What would you like to do?",
            choices: [
                "View all Departments",
                "View all Roles",
                "View all Employees",
                "Add a Department",
                "Add a Role (Suggestion: Use 'View all Departmenst' before selecting)",
                "Add an Employee",
                "Update an Employee Role"
            ]
        }
    ])
    .then(answer => {
        // can possibly reference answer
        switch(answer.view) {
            case "View all Departments":
                viewAllDepartments();
                break;

            case "View all Roles":
                viewAllRoles();
                break;

            case "View all Employees":
                viewAllEmployees();
                break;
            case "Add a Department":
                addDepartmentPrompt()
                    .then(department => addDepartment(department));
                break;

            case "Add a Role (Suggestion: Use 'View all Departmenst' before selecting)":
                addRolePrompt()
                    .then(role => addRole(role));
                break;

            case "Add an Employee":
                addEmployeePrompt()
                    .then(employee => addEmployee(employee));
                return;

            case "Update an Employee Role":
                updateEmployee();
                return;

        }
    })
}

// show all departments
viewAllDepartments = () => {
    const sql = `SELECT * FROM departments`

    db.query(sql, (err, rows) => {
        if(err) {
            console.log(err);
            return;
        }
        console.log("\n");
        console.table(rows);
    })

    promptUser();
}

// show job title, role id, and department 
viewAllRoles = () => {
    const sql = `
        SELECT 
            roles.role_id, 
            roles.title, 
            roles.salary, 
            departments.name AS department_name
        FROM roles
        LEFT JOIN departments
        ON roles.department_id = departments.department_id`;

    db.query(sql, (err, rows) => {
        if(err) {
            console.log(err);
            return;
        }
        console.log("\n");
        console.table(rows);
    })

    promptUser();
}

// show employee id, first name, last name, job title, department, salary, and manager
viewAllEmployees = () => {
    const sql = `
        SELECT 
            employees.employee_id,
            employees.first_name, 
            employees.last_name, 
            CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name, roles.title AS role,
            roles.salary AS salary,
            departments.name AS department
        FROM employees
        LEFT JOIN employees manager ON employees.manager_id = manager.employee_id
        LEFT JOIN roles ON employees.role_id = roles.role_id
        LEFT JOIN departments ON roles.department_id = departments.department_id`

    db.query(sql, (err, rows) => {
        if(err) {
            console.log(err);
            return;
        }
        console.log("\n");
        console.table(rows);
    })

    promptUser();
}

addDepartmentPrompt = () => {
    return inquirer.prompt([
        {
            type: "input",
            name: "departmentName",
            message: "What is the name of the department you would like to add?"
        }
    ])
}

addDepartment = department => {
    const sql = `
        INSERT INTO departments (name)
        VALUES (?)`
    const params = [department.departmentName]

    db.query(sql, params, (err, result) => {
        if(err) {
            console.log(err);
            return;
        }

        console.log(`${department.departmentName} has been added`);
        promptUser();
    })
}

addRolePrompt = () => {
    return inquirer.prompt([
        {
            type: "input",
            name: "roleTitle",
            message: "What is the name of the role you would like to add?"
        },
        {
            type: "input",
            name: "roleSalary",
            message: "What is the salary of this role?"
        },
        {
            type: "input",
            name: "roleDepartmentId",
            message: "What is the id of the department of this role?"
        }
    ])
}

addRole = role => {
    const sql = `
        INSERT INTO roles (title, salary, department_id)
        VALUES (?, ?, ?)`
    const params = [role.roleTitle, role.roleSalary, role.roleDepartmentId]

    db.query(sql, params, (err, result) => {
        if(err) {
            console.log(err);
            return;
        }

        console.log(`${role.roleTitle} has been added`);
        promptUser();
    })
}

addEmployeePrompt = () => {
    return inquirer.prompt([
        {
            type: "input",
            name: "employeeFirstName",
            message: "What is the first name of the employee?"
        },
        {
            type: "input",
            name: "employeeLastName",
            message: "What is the last name of the employee?"
        },
        {
            type: "input",
            name: "employeeRole",
            message: "What is the id of the role of the employee?"
        },
        {
            type: "input",
            name: "employeeManager",
            message: "What is the id of the manager of this employee?"
        }
    ])
}

addEmployee = employee => {
    const sql = `
        INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES (?, ?, ?, ?)`
    const params = [
        employee.employeeFirstName, 
        employee.employeeLastName, 
        employee.employeeRole,
        employee.employeeManager
    ]

    db.query(sql, params, (err, result) => {
        if(err) {
            console.log(err);
            return;
        }

        console.log(`${employee.employeeFirstName} has been added`);
        promptUser();
    })
}

updateEmployee = () => {
    const sql = `
        SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS employee_name
        FROM employees`

    db.query(sql, (err, rows) => {
        if(err) {
            console.log(err);
            return;
        }

        console.log(rows[1].employee_name)
        // can possibly use destructuring 
        let employeeNames = [];
        for(let i = 0; i < rows.length; i++) {
            employeeNames.push(rows[i].employee_name)
        }

        return inquirer.prompt([
            {
                type: "list",
                name: "employeeNames",
                message: "Which employee's role would you like to update?",
                choices: employeeNames
            },
            {
                type: "input",
                name: "role",
                message: "What is the ID of the role you would like to add?"
            }
        ])
        .then(updateInfo => {
            const sql = `
                UPDATE employees
                SET role_id = ?
                WHERE CONCAT(employees.first_name, ' ', employees.last_name) = ?`
            const params = [updateInfo.role, updateInfo.employeeNames]

            db.query(sql, params, (err, result) => {
                if(err) {
                    console.log(err);
                    return;
                }
        
                console.log("Role has been updated");
                promptUser();
            })
        })
    }) 
}

startApp = () => {
    db.connect(err => {
        if(err) throw err;
        console.log("Connected");
    })

    promptUser();
}

startApp();