const Company = require('../models/Company');

exports.getAllCompanies = (req, res) => {
    Company.getAll((err, results) => {
        if (err) return res.status(500).send('Error retrieving companies.');
        res.json(results);
    });
};

exports.getCompanyById = (req, res) => {
    Company.getById(req.params.id, (err, results) => {
        if (err) return res.status(500).send('Error retrieving company.');
        if (results.length === 0) return res.status(404).send('Company not found');
        res.json(results[0]);
    });
};

exports.getEmployeesByCompany = (req, res) => {
    Company.getEmployees(req.params.idCompany, (err, results) => {
        if (err) return res.status(500).send('Error retrieving employees.');
        res.json(results);
    });
};
