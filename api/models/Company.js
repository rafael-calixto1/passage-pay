const db = require('../config/database');

class Company {
    static getAll(callback) {
        db.query('SELECT * FROM companies', callback);
    }

    static getById(id, callback) {
        db.query('SELECT * FROM companies WHERE id = ?', [id], callback);
    }

    static create(companyData, callback) {
        db.query('INSERT INTO companies SET ?', companyData, callback);
    }

    static getEmployees(idCompany, callback) {
        db.query('SELECT * FROM employees WHERE idCompany = ?', [idCompany], callback);
    }
}

module.exports = Company;
