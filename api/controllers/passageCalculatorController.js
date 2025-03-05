const db = require('../config/database');
const axios = require('axios');

exports.calculatePassage = async (req, res) => {
    const { idcompany, idemployee } = req.body;
    if (!idcompany || !idemployee) return res.status(400).send('idcompany and idemployee are required.');

    try {
        const [company] = await db.promise().query('SELECT * FROM companies WHERE id = ?', [idcompany]);
        const [employee] = await db.promise().query('SELECT * FROM employees WHERE id = ?', [idemployee]);

        if (!company.length || !employee.length) return res.status(404).send('Company or employee not found.');

        const companyCNPJ = company[0].cnpj;
        const employeeZipCode = employee[0].zipCode;

        const companyResponse = await axios.get(`https://api.cnpja.com/office/${companyCNPJ}`);
        const employeeResponse = await axios.get(`http://viacep.com.br/ws/${employeeZipCode}/json/`);

        res.json({ company: companyResponse.data, employee: employeeResponse.data });
    } catch (error) {
        res.status(500).send('Error processing request.');
    }
};
