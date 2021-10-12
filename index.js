const inquirer = require('inquirer');
const mysql = require('mysql');
const consoleTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'employees'
});

const init = () => {
    inquirer.prompt([{
        type: "rawlist",
        choices: [
            "Add Employee",
            "View All Employees",
            "Add Role",
            "View All Roles",
            "Add Department",
            "View All Departments",
            "Update Employee Role",
            "Update Employee Manager",
            "View All Employees By Manager",
            "Remove Employee",
            "Remove Department",
            "Remove Role",
            "View Total Utilized Budget By Department",
            "Exit"
        ],
        message: "What do you like to do?",
        name: "option"
    }]).then((answer) => {

        // switch cases for each user answer
        switch (answer.option) {
            case "Add Department":
                {
                    return addDepartment();
                }
            case "Add Role":
                {
                    return addRole();
                }
            case "Add Employee":
                {
                    return addEmployee();
                }
            case "View All Departments":
                {
                    return allDepartment();
                }
            case "View All Roles":
                {
                    return allRoles();
                }
            case "View All Employees":
                {
                    return allEmployee();
                }
            case "Update Employee Role":
                {
                    return updateRole();
                }
            case "Update Employee Manager":
                {
                    return updateManager();
                }
                // case "View All Employees By Department": {
                // return employeeByDeparment();
                // }
            case "View All Employees By Manager":
                {
                    return employeeByManager();
                }
            case "Remove Employee":
                {
                    return removeEmployee();
                }
            case "Remove Department":
                {
                    return removeDepartment();
                }
            case "Remove Role":
                {
                    return removeRole();
                }
            case "View Total Utilized Budget By Department":
                {
                    return departmentBudget();
                }
            default:
                {
                    return process.exit();
                }
        }
    });
}


const departmentBudget = () => {
    inquirer.prompt([{
        message: "What is the Department number?",
        name: "id",
        validate: validateNumber,
    }]).then(answer => {
        const query = `
    SELECT d.id as Department_ID, d.name as Department_Name, SUM(r.salary) as Total_utilized_budget 
    FROM role r
    inner join employee e on r.id = e.role_id
    inner join department d on r.department_id = d.id
    where r.department_id = ${answer.id}
    group by d.id, d.name
    `
        connection.query(query, function(err, res) {
            if (err) throw err;
            console.table(res);
            init()
        })
    });
}

const removeEmployee = () => {
    inquirer.prompt([{
        message: "What is the Employee number?",
        name: "id",
        validate: validateNumber,
    }]).then(answer => {
        deleteidFromTable(answer.id, 'employee')
    });;
}

const removeDepartment = () => {
    inquirer.prompt([{
        message: "What is the department number?",
        name: "id",
        validate: validateNumber,
    }]).then(answer => {
        deleteidFromTable(answer.id, 'department')
    });;
}

const removeRole = () => {
    inquirer.prompt([{
        message: "What is the role number?",
        name: "id",
        validate: validateNumber,
    }]).then(answer => {
        deleteidFromTable(answer.id, 'role')
    });;
}

//table department
const allDepartment = () => {
    connection.query('SELECT id, name FROM department', function(err, res) {
        if (err) throw err;
        console.table('department', res);
        init()
    })
}

const departmentName = (data) => {
    connection.query('INSERT INTO department SET?', data, (err, res) => {
        if (err) throw err;
        console.log("Department was successfully added!")
        init();
    });
}

const addDepartment = () => {
    inquirer.prompt([{
        message: "Whats your department name?",
        name: "name"
    }]).then(answer => {
        // console.log('answer');
        departmentName(answer);
    });
}

//table employee 
const createEmployee = (data) => {
    connection.query('INSERT INTO employee SET?', data, (err, res) => {
        if (err) throw err;
        console.log("Employee was successfully added!")
        init();
    });
}

const allEmployee = () => {
    connection.query('SELECT id, first_name, last_name, role_id, manager_id FROM employee', function(err, res) {
        if (err) throw err;
        console.table('employee', res);
        init()
    })
}

const employeeByManager = (managerID) => {
    inquirer.prompt([{
            message: "what's the manager ID number?",
            name: "manager_id",
            validate: validateNumber,
        }])
        .then(answer => {
            connection.query(`SELECT * FROM employee where manager_id = ${answer.manager_id}`, function(err, res) {
                if (err) throw err;
                console.table('employee', res);
                init()
            })
        });
}

function deleteidFromTable(id, tableName) {
    const query = `DELETE FROM ${tableName} WHERE id = ${id}`;
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table(tableName);
        init()
    })
};

const addEmployee = () => {
    inquirer.prompt([{
            message: "What is the first name?",
            name: "first_name"
        },
        {
            message: "What is the last name?",
            name: "last_name"
        },
        {
            message: "What is the role ID number?",
            name: "role_id",
            validate: validateNumber,
        },
        {
            message: "what is the manager ID number?",
            name: "manager_id",
            validate: validateNumber,
        }
    ]).then(answer => {
        // console.log('ANSWER');
        createEmployee(answer);
    });
}

//table role
const allRoles = () => {
    connection.query('SELECT id, title, salary, department_id FROM role', function(err, res) {
        if (err) throw err;
        console.table('role', res);
        init()
    })
}

const addRole = () => {
    inquirer.prompt([{
            message: "What is your title?",
            name: "title"
        },
        {
            message: "Enter your salary",
            name: "salary",
            validate: validateNumber,
        },
        {
            message: "Whats your department",
            name: "department_id",
            validate: validateNumber,
        }
    ]).then(data => {
        connection.query('INSERT INTO role SET?', data, (err, res) => {
            if (err) throw err;
            console.log("Role was successfully added!")
            init();
        });
    });
}

//updating role
const updateRole = () => {
    inquirer.prompt([{
            name: 'employeeId',
            type: 'number',
            message: 'Enter employee Id number',
            validate: validateNumber
        },
        {
            name: 'newRole',
            type: 'number',
            message: 'Enter new role Id number',
            validate: validateNumber,
        },
    ])

    .then((answer) => {
        connection.query(
            `UPDATE employee SET role_id = ${answer.newRole} WHERE id = ${answer.employeeId}`, (err, data) => {
                if (err) throw err;
                console.log('Employee updated');
                init();
            });
    });
}

const updateManager = () => {
    inquirer.prompt([{
            name: 'employeeId',
            type: 'number',
            message: 'Enter employee Id number',
            validate: validateNumber
        },
        {
            name: 'managerID',
            type: 'number',
            message: 'Enter manager Id number',
            validate: validateNumber,
        },
    ])

    .then((answer) => {
        connection.query(
            `UPDATE employee SET manager_id = ${answer.managerID} WHERE id = ${answer.employeeId}`, (err, data) => {
                if (err) throw err;
                console.log('Employee Manager updated');
                init();
            });
    });
}

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    init();
});


const validateNumber = number => {
    const reg = /^\d+$/;
    return reg.test(number) || "Please enter a number.";
}