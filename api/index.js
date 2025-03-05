const express = require('express');
const fs = require('fs');
const axios = require('axios'); 
const app = express();
const port = process.env.PORT || 3000;
const mysql = require('mysql2');

// MySQL variables
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'student',  
    password: process.env.DB_PASSWORD || 'student', 
    database: process.env.DB_NAME || 'passagepay'
});
  
// MySQL Connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

  
  app.use(express.json());

app.use(express.json());

// Function to read data from 'db.employees.json'
function fetchDataEmployees() {
    try {
        const rawData = fs.readFileSync('db.employees.json', 'utf8');
        return JSON.parse(rawData);
    } catch (err) {
        console.error('Error reading or parsing employee data ', err);
        return { employees: [] };
    }
}

// Function to read data from 'db.companies.json'
function fetchDataCompanies() {
    try {
        const rawData = fs.readFileSync('db.companies.json', 'utf8');
        return JSON.parse(rawData);
    } catch (err) {
        console.error('Error reading or parsing company data ', err);
        return { companies: [] };
    }
}
// Routes for Employees
// Route to get a list of all employees
app.get('/api/employees', (req, res) => {
    db.query('SELECT * FROM employees', (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error retrieving the employee list.');
      }
      res.json(results);
    });
  });

  // Route to get a list of unemployed employees
app.get('/api/employees/unemployed', (req, res) => {
    db.query('SELECT * FROM employees WHERE idCompany = 0', (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error retrieving the unemployed employee list.');
      }
      res.json(results);
    });
  });


  // Route to get a specific employee by ID
app.get('/api/employees/:idemployee', (req, res) => {
    const { idemployee } = req.params;
    db.query('SELECT * FROM employees WHERE id = ?', [idemployee], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error retrieving the employee.');
      }
      if (results.length === 0) {
        return res.status(404).send('Employee not found');
      }
      res.json(results[0]);
    });
  });


  
// Route to get the employee's address information through the ID and an external query to VIACEP
app.get('/api/employees/:idemployee/address', async (req, res) => {
    try {
      const { idemployee } = req.params;
      db.query('SELECT * FROM employees WHERE id = ?', [idemployee], async (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error retrieving the employee.');
        }
  
        if (results.length === 0 || !results[0].zipCode) {
          return res.status(404).send('Employee not found or does not have a zip code.');
        }
  
        const zipCode = results[0].zipCode;
        const viacepResponse = await axios.get(`http://viacep.com.br/ws/${zipCode}/json/`);
        res.json(viacepResponse.data);
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving employee address.');
    }
  });



// Function to save data to 'db.employees.json'
function saveDataEmployees(data) {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync('db.employees.json', jsonData, 'utf8');
}
// Function to save data to 'db.companies.json'
function saveDataCompanies(data) {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync('db.companies.json', jsonData, 'utf8');
}

// Route to add a new employee
app.post('/api/employees', (req, res) => {
    const { name, lastName, cpf, position, company, zipCode, idCompany } = req.body;
  
    if (!name || !cpf || !zipCode) {
      return res.status(400).send('Name, CPF, and zip code are required for the employee.');
    }
  
    const newEmployee = {
      name,
      lastName,
      cpf,
      position: position || 'unemployed',
      company,
      zipCode,
      idCompany: idCompany || 0
    };
  
    db.query('INSERT INTO employees SET ?', newEmployee, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error adding new employee.');
      }
      newEmployee.id = results.insertId; // get the inserted ID
      res.status(201).json(newEmployee);
    });
  });

// Update employee by ID
app.put('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    const { name, lastName, cpf, position, company, zipCode, idCompany } = req.body;
  
    const updatedEmployee = { name, lastName, cpf, position, company, zipCode, idCompany };
  
    db.query('UPDATE employees SET ? WHERE id = ?', [updatedEmployee, id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error updating employee.');
      }
      if (results.affectedRows === 0) {
        return res.status(404).send('Employee not found');
      }
      res.json(updatedEmployee);
    });
  });
  

//############### COMPANIES ###################
// Routes for Companies

// Route to get company list
app.get('/api/companies', (req, res) => {
    try {
        const companies = fetchDataCompanies().companies;
        res.json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving the company list.');
    }
});

// Get list of companies
app.get('/api/companies', (req, res) => {
    db.query('SELECT * FROM companies', (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error retrieving the company list.');
      }
      res.json(results);
    });
  });
  

// Route to add a new company
app.post('/api/companies', express.json(), (req, res) => {
    try {
        const data = fetchDataCompanies();
        const newCompany = {
            name: req.body.name,
            cnpj: req.body.cnpj
        };

        if (!newCompany.name || !newCompany.cnpj) {
            throw new Error('Name and CNPJ of the company are required.');
        }

        const companies = data.companies;

        // Generate ID for the company
        newCompany.id = companies.length > 0 ? Math.max(...companies.map(c => c.id)) + 1 : 1;

        companies.push(newCompany);
        saveDataCompanies(data);

        res.status(201).json(newCompany); // Successfully created
    } catch (error) {
        console.error(error);

        // Handle specific error cases
        if (error.message === 'Name and CNPJ of the company are required.') {
            res.status(400).send(error.message);  // Bad request
        } else {
            res.status(500).send('Error adding the new company.');
        }
    }
});

// Get employees linked to a company
app.get('/api/companies/:idCompany/employees', (req, res) => {
    const { idCompany } = req.params;
    db.query('SELECT * FROM employees WHERE idCompany = ?', [idCompany], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error retrieving employees.');
      }
      res.json(results);
    });
  });

// CNPJ JA
const apiKey = process.env.CNPJ_API_KEY;

// Route to get information about a company by ID
app.get('/api/companies/:idcompany/information', async (req, res) => {
    try {
      const { idcompany } = req.params;
      db.query('SELECT * FROM companies WHERE id = ?', [idcompany], async (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error retrieving the company.');
        }
        if (results.length === 0 || !results[0].cnpj) {
          return res.status(404).send('Company not found or does not have CNPJ.');
        }
  
        const cnpj = results[0].cnpj;
        const config = {
          method: 'get',
          url: `https://api.cnpja.com/office/${cnpj}`,
          headers: { 'Authorization': 'e0a9cc03-3b9a-47f8-af1c-886b472dd1bd-b7d6e4a0-cb4f-41a1-a51d-14c277d58ace' }
        };
  
        const cnpjResponse = await axios(config);
        res.json(cnpjResponse.data);
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving company information.');
    }
  });



//###################PASSAGE CALCULATOR################################
app.post('/api/calculation', async (req, res) => {
    try {
        // Check if idcompany and idemployee are in the request body
        if (!req.body.idcompany || !req.body.idemployee) {
            res.status(400).send('idcompany and idemployee are required in the request body.');
            return;
        }

        const idCompany = req.body.idcompany;
        const idEmployee = req.body.idemployee;

        // Fetch company data from the database
        db.query('SELECT * FROM companies WHERE id = ?', [idCompany], async (err, companyResults) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error retrieving the company.');
            }

            if (companyResults.length === 0 || !companyResults[0].cnpj) {
                return res.status(404).send('Company not found or does not have CNPJ.');
            }

            const company = companyResults[0];
            const cnpj = company.cnpj;

            // Make a request to CNPJA using the company's CNPJ
            const config = {
                method: 'get',
                url: `https://api.cnpja.com/office/${cnpj}`,
                headers: {
                    'Authorization': apiKey
                }
            };

            try {
                const cnpjResponse = await axios(config);

                // Extract company city and state
                const companyCity = cnpjResponse.data.address.city;
                const companyState = cnpjResponse.data.address.state;

                // Fetch employee data from the database
                db.query('SELECT * FROM employees WHERE id = ?', [idEmployee], async (err, employeeResults) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Error retrieving the employee.');
                    }

                    if (employeeResults.length === 0 || !employeeResults[0].zipCode) {
                        return res.status(404).send('Employee not found or does not have zip code.');
                    }

                    const employee = employeeResults[0];
                    const employeeZipCode = employee.zipCode;

                    // Get the employee's city and state using ViaCEP API
                    const viaCepResponse = await axios.get(`http://viacep.com.br/ws/${employeeZipCode}/json/`);
                    const employeeCity = viaCepResponse.data.localidade;
                    const employeeState = viaCepResponse.data.uf;

                    // Check if the cities and states are the same
                    const isSameCity = companyCity === employeeCity;
                    const isSameState = companyState === employeeState;

                    // Define a message based on the cities and states comparison
                    let message = 'Employee and company are in different states, so the hiring is not feasible';
                    if (isSameCity) {
                        message = 'Employee and company are in the same city, so you should only pay for one passage';
                    } else if (isSameState) {
                        message = 'Employee and company are in the same state, so you should pay for at least one passage';
                    }

                    // Return the result
                    res.json({
                        companyCity: companyCity,
                        employeeCity: employeeCity,
                        message: message
                    });
                });

            } catch (error) {
                console.error(error);
                res.status(500).send('Error retrieving company CNPJ or employee address.');
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving company or employee information.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});