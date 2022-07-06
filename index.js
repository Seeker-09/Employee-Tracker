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
            roles.id, 
            roles.title, 
            roles.salary, 
            departments.name AS department_name
        FROM roles
        LEFT JOIN departments
        ON roles.department_id = departments.id`;

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
            employees.id,
            employees.first_name, 
            employees.last_name, 
            CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name, roles.title AS role,
            roles.salary AS salary,
            roles.id,
            departments.name AS department
        FROM employees
        LEFT JOIN employees manager ON employees.manager_id = manager.id
        LEFT JOIN roles ON employees.role_id = roles.id
        LEFT JOIN departments ON roles.id = departments.id`

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

startApp = () => {
    db.connect(err => {
        if(err) throw err;
        console.log("Connected");
    })

    promptUser();
}

startApp();