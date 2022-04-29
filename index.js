const cTable = require('console.table');
const db = require('./config/connection.js');
const inquirer = require('inquirer');


// connect to MySQL db and then prompt the main menu
db.connect(err => {
    if (err) throw err;
    console.log(`
    ================================
    Connected to company database...
    ================================
    `);
    promptManager();
});


const promptManager = () => {
    // Main menu of inquirer 
    inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department',
            'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Exit']
        }
    ])
    .then(menu => {
        // Destruct the promptManager return Promise into the variable choice
        const { choice } = menu;
        // Switch statement to call different functions depending on user choice in main menu
        switch (choice) {
            case 'View All Departments':
                viewDepartments();
                break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'View All Employees':
                viewEmployees();
                break;
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case 'Update an Employee Role':
                updateEmployee();
                break;
            // End connection if user selects 'Exit'
            case 'Exit':
                db.end(err => {
                    if (err) {
                        return console.log(`Error: ${err.message}`);
                    }
                    console.log(`
    ===========================
    Ending connection. Goodbye!
    ===========================`);
                });
                break;
        }
    })
}


viewDepartments = () => {
    console.log(`Pulling all Departments...\n`);
    let sql = `SELECT department.id AS Id, department.name AS Department FROM department;`;

    db.promise().query(sql)
        .then( ([rows]) => {
            console.table(rows)
            promptManager();
        })
        .catch(console.log)
};

viewRoles = () => {
    console.log(`Pulling all Roles...\n`);
    let sql = `SELECT role.id AS Id, role.title AS Title, role.salary AS Salary, department.name AS Department
                FROM role
                INNER JOIN department ON role.department_id = department.id;`;
    
    db.promise().query(sql)
        .then( ([rows]) => {
            console.table(rows);
            promptManager();
        })
        .catch(console.log);
};

viewEmployees = () => {
    console.log(`Pulling all Employees...\n`);
    let sql = `SELECT employee.id AS Id, 
                employee.first_name AS First_Name, 
                employee.last_name AS Last_Name, 
                role.title AS Title, 
                department.name AS Department,
                role.salary AS Salary, 
                CONCAT (manager.first_name, ' ', manager.last_name) AS Manager
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    
    db.promise().query(sql)
        .then( ([rows]) => {
            console.table(rows);
            promptManager();
        })
        .catch(console.log);
}

addDepartment = () => {
    console.log('You chose to Add a Department');
}

addRole = () => {
    console.log('Add a role');
}

addEmployee = () => {
    console.log('Add an employee');
}

updateEmployee = () => {
    console.log('Update an Employee');
}

