// require the connection 
// this file will directly utilize the connection for the algorithms 
const connection = require('./connection');

// create an objct that holds cmultiple methods that will later be used 
class DB {
    // kep a basic connection method 
    // what is a constructor (creates an instance - this instance gets called when declaring an object )
    constructor(connection) {

        this.connection = connection
    }

    // create Employeesconst
    createEmployee = (data) => {
        this.connection.query('INSERT INTO employee SET?', data, (err, res) => {
            if (err) throw err;
            console.log("Employee was successfully added!")

        });
    }
    allEmployee() {
        return this.connection.query('SELECT employee.id, employee.first_name, employee.last_name, role_id, manager_id FROM employee;');
    }

    // add department
    departmentName = (data) => {
        connection.query('INSERT INTO department SET?', data);
    }

    // add role 
    addRole = () => {
        connection.query('INSERT INTO  id, title, salary, department_id FROM role', );
    }

    // add employee
    addE = () => {
        connection.query(`SELECT * FROM employee where manager_id`);
    }


}
module.exports = new DB(connection);