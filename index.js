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
    console.log(`Please answer the following question...\n`);
    
    inquirer.prompt([ 
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of your new Department?',
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log(`Please enter the name of your department!`);
                    return false;
                }
            }
        }
    ])
    .then(response => {
        let { department } = response;

        let sql = `INSERT INTO department (name)
                    VALUES ('${department}')`;

        db.promise().query(sql)
            .then( ([rows]) => {
                console.log(`Department added! Here are the database updates:\n`)
                console.table(rows);
                promptManager();
            })
    })
    .catch(console.log);
}

addRole = () => {
    console.log(`Please answer the following prompts...\n`);

    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'What is the title of your new Role?',
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log('Please enter a Role title!')
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for your new Role?',
            validate: input => {
                if (isNaN(input)) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    ])
    .then(response => {
        let params = [response.role, response.salary];
        
        console.log(`Here are a list of available Departments...\n`)
        let deptSql = `SELECT name AS Name, id AS Id FROM department;`

        db.promise().query(deptSql)
            .then( ([rows]) => {
                const dept = rows.map(({ Name, Id }) => ({ name: Name, value: Id }));

                inquirer.prompt([
                    {
                    type: 'list',
                    name: 'department',
                    message: 'Which Department will this role belong to?',
                    choices: dept
                }
            ])
            .then(response => {
                let deptParam = response.department;
                params.push(deptParam);
                
                let sql = `INSERT INTO role (title, salary, department_id)
                            VALUES (?, ? , ?)`;
                
                db.promise().query(sql, params)
                    .then( ([rows]) => {
                        console.log(`Role added! Here are the database updates:\n`)
                        console.table(rows);
                        promptManager();
                    })
            })
        })
    })       
}

addEmployee = () => {
    console.log(`Please respond to the following prompts...\n`);

    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: `What is the new Employee's first name?`,
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log('Please enter an Employee first name!')
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: `What is the new Employee's last name?`,
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log('Please enter an Employee last name!')
                    return false;
                }
            }
        }
    ])
    .then(response => {
        params = [response.firstName, response.lastName];
        
        console.log(`Here are a list of available employee Roles...\n`)
        let roleSql = `SELECT title as Title, id as Id FROM role;`

        db.promise().query(roleSql)
            .then( ([rows]) => {
                const roles = rows.map(({ Title, Id }) => ({ name: Title, value: Id }))


                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: 'Which role will your new Employee be taking on?',
                        choices: roles
                    }
            ])
            .then(response => {
                const roleParam = response.role
                params.push(roleParam);
                
                console.log(`Here are all available Employees...\n`)
                let managerSql = `SELECT id as Id, first_name AS First_Name, last_name AS Last_Name
                                    FROM employee;`

                db.promise().query(managerSql)
                    .then( ([rows]) => {
                        const employees = rows.map( ({ First_Name, Last_Name, Id }) => ({ name: First_Name + ' ' + Last_Name, value: Id }))
                        
                        inquirer.prompt([
                            {
                                type: 'list',
                                name: 'manager',
                                message: 'Which Employee will this new Employee be reporting to?',
                                choices: employees
                            }
                        ])
                        .then(managerChoice => {
                            let managerParam = managerChoice.manager
                            params.push(managerParam);

                            let sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                        VALUES (?, ?, ?, ?);`

                            db.promise().query(sql, params) 
                                .then( ([rows]) => {
                                    console.log(`Employee has successfully been added. Here are the database changes:\n`)
                                    console.table(rows);
                                    promptManager();
                                })
                        })
                    })
            })
        })
    })
}

updateEmployee = () => {
    console.log('Update an Employee');
}

