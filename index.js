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
        }
    })
}

viewAllDepartments = () => {
    const sql = `SELECT * FROM departments`

    db.query(sql, (err, rows) => {
        if(err) {
            console.log(err);
        }
        console.log("\n");
        console.table(rows);
    })

    promptUser();
}

viewAllRoles = () => {
    const sql = `
        SELECT roles.*, departments.name
        AS department_name
        FROM roles
        LEFT JOIN departments
        ON roles.department_id = departments.id`;

    db.query(sql, (err, rows) => {
        if(err) {
            console.log(err);
        }
        console.log("\n");
        console.table(rows);
    })

    promptUser();
}

viewAllEmployees = () => {
    const sql = `
        SELECT employees.*, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name, roles.title AS role
        FROM employees
        LEFT JOIN employees manager ON employees.manager_id = manager.id
        LEFT JOIN roles ON employees.role_id = roles.id`

    db.query(sql, (err, rows) => {
        if(err) {
            console.log(err);
        }
        console.log("\n");
        console.table(rows);
    })

    promptUser();
}

startApp = () => {
    db.connect(err => {
        if(err) throw err;
        console.log("Connected");
    })

    promptUser();
}

startApp();