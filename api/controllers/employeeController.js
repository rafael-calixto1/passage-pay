const Employee = require('../models/Employee');

exports.getAllEmployees = (req, res) => {
    Employee.getAll((err, results) => {
        if (err) return res.status(500).send('Error retrieving employees.');
        res.json(results);
    });
};

exports.getEmployeeById = (req, res) => {
    Employee.getById(req.params.id, (err, results) => {
        if (err) return res.status(500).send('Error retrieving employee.');
        if (results.length === 0) return res.status(404).send('Employee not found');
        res.json(results[0]);
    });
};

exports.getUnemployedEmployees = (req, res) => {
    Employee.getUnemployed((err, results) => {
        if (err) return res.status(500).send('Error retrieving unemployed employees.');
        res.json(results);
    });
};

exports.createEmployee = (req, res) => {
    const { name, lastName, cpf, position, company, zipCode, idCompany } = req.body;
    if (!name || !cpf || !zipCode) return res.status(400).send('Name, CPF, and zip code are required.');

    const newEmployee = { name, lastName, cpf, position: position || 'unemployed', company, zipCode, idCompany: idCompany || 0 };

    Employee.create(newEmployee, (err, results) => {
        if (err) return res.status(500).send('Error adding employee.');
        newEmployee.id = results.insertId;
        res.status(201).json(newEmployee);
    });
};
