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
                "Add a Role",
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

            case "Add a Role":
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

        console.log(`Department has been added`);
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
            name: "roleDepartment",
            message: "What is the name of the department of this role?"
        }
    ])
}

addRole = role => {
    let sql;
    let params;

    // get the deparment id 
    sql = `
        SELECT department_id
        FROM departments
        WHERE name = ?`
    params = [role.roleDepartment]
    db.query(sql, params, (err, rows) => {
        if(err) {
            console.log(err);
            return;
        }

        // make the new role
        sql = `
        INSERT INTO roles (title, salary, department_id)
        VALUES (?, ?, ?)`
        params = [role.roleTitle, role.roleSalary, rows[0].department_id]

        db.query(sql, params, (err, result) => {
            if(err) {
                console.log(err);
                return;
            }

            console.log(`Role has been added`);
            promptUser();
        })
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
            message: "What is the role of the employee?"
        },
        {
            type: "input",
            name: "employeeManager",
            message: "What is the name of the manager of this employee?"
        }
    ])
}

addEmployee = employee => {
    let sql;
    let params;

    // get the role id
    sql = `
        SELECT role_id
        FROM roles
        WHERE title = ?`
    params = [employee.employeeRole]
    db.query(sql, params, (err, roleRow) => {
        if(err) {
            console.log(err);
            return;
        }

        // get the manager's id
        sql = `
            SELECT employee_id
            FROM employees
            WHERE CONCAT(first_name, ' ', last_name) = ?`
        params = [employee.employeeManager]
        db.query(sql, params, (err, managerRow) => {
            if(err) {
                console.log(err);
                return;
            }

            // add the employee
            sql = `
                INSERT INTO employees (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, ?, ?)`
            params = [
                employee.employeeFirstName, 
                employee.employeeLastName, 
                roleRow[0].role_id,
                managerRow[0].employee_id
            ]

            db.query(sql, params, (err, result) => {
                if(err) {
                    console.log(err);
                    return;
                }

                console.log(`Employee has been added`);
                promptUser();
            })
        })
    }) 
}

updateEmployee = () => {
    // get employee names
    const sql = `
        SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS employee_name
        FROM employees`

    db.query(sql, (err, rows) => {
        if(err) {
            console.log(err);
            return;
        }

        // put employee names in an array for inquirer
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
                message: "What is the name of the role you would like to add?"
            }
        ])
        .then(updateInfo => {
            let sql;
            let params;

            // get role id
            sql = `
                SELECT role_id
                FROM roles
                WHERE title = ?`
            params = [updateInfo.role]
            db.query(sql, params, (err, row) => {
                if(err) {
                    console.log(err);
                    return;
                }

                // update the employee's role
                sql = `
                    UPDATE employees
                    SET role_id = ?
                    WHERE CONCAT(employees.first_name, ' ', employees.last_name) = ?`
                params = [row[0].role_id, updateInfo.employeeNames]
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