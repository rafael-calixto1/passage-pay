const db = require('../config/database');

class Employee {
    static getAll(callback) {
        db.query('SELECT * FROM employees', callback);
    }

    static getById(id, callback) {
        db.query('SELECT * FROM employees WHERE id = ?', [id], callback);
    }

    static getUnemployed(callback) {
        db.query('SELECT * FROM employees WHERE idCompany = 0', callback);
    }

    static create(employeeData, callback) {
        db.query('INSERT INTO employees SET ?', employeeData, callback);
    }

    static update(id, employeeData, callback) {
        db.query('UPDATE employees SET ? WHERE id = ?', [employeeData, id], callback);
    }
}

module.exports = Employee;
