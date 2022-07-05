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
        console.log(answer.view);
        switch(answer.view) {
            case "View all Departments":
                viewAllDepartments();
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

startApp = () => {
    db.connect(err => {
        if(err) throw err;
        console.log("Connected");
    })

    promptUser();
}

startApp();