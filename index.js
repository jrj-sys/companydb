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
        // Destruct the menu Promise into the variable choice
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


let viewDepartments = () => {
    console.log('You chose to View All Departments');
}

let viewRoles = () => {
    console.log('You chose to View All Roles')
}

let viewEmployees = () => {
    console.log('You chose to View All Employees');
}

let addDepartment = () => {
    console.log('You chose to Add a Department');
}

let addRole = () => {
    console.log('Add a role');
}

let addEmployee = () => {
    console.log('Add an employee');
}

let updateEmployee = () => {
    console.log('Update an Employee');
}

